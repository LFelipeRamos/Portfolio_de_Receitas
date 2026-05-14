$ErrorActionPreference = "Stop"

Write-Host "========================================="
Write-Host "Setup com Docker - Portfolio de Receitas"
Write-Host "Windows"
Write-Host "========================================="

function Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Green
}

function Warn($message) {
    Write-Host "[WARN] $message" -ForegroundColor Yellow
}

function Fail($message) {
    Write-Host "[ERRO] $message" -ForegroundColor Red
}

function Test-CommandExists($command) {
    $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
}

function Install-DockerDesktop {
    Warn "Docker não encontrado."
    Warn "Tentando instalar Docker Desktop via winget."

    if (-not (Test-CommandExists "winget")) {
        Fail "winget não está disponível neste Windows."
        Write-Host ""
        Write-Host "Instale o Docker Desktop manualmente:"
        Write-Host "https://docs.docker.com/desktop/setup/install/windows-install/"
        exit 1
    }

    winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements

    Info "Instalação do Docker Desktop concluída ou iniciada."
}

function Check-OrInstallDocker {
    Info "Verificando Docker..."

    if (-not (Test-CommandExists "docker")) {
        Install-DockerDesktop
    } else {
        Info "Docker encontrado: $(docker --version)"
    }
}

function Start-DockerDesktop {
    $dockerDesktopPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"

    if (Test-Path $dockerDesktopPath) {
        Info "Abrindo Docker Desktop..."
        Start-Process $dockerDesktopPath
    } else {
        Warn "Docker Desktop não encontrado no caminho padrão."
    }
}

function Wait-ForDockerDaemon {
    Info "Verificando se o Docker daemon está rodando..."

    try {
        docker info | Out-Null
        Info "Docker daemon está rodando."
        return
    } catch {
        Warn "Docker Desktop ainda não está pronto."
    }

    Start-DockerDesktop

    Write-Host ""
    Write-Host "Aguardando Docker Desktop iniciar..."
    Write-Host "Se aparecer uma janela do Docker Desktop, aceite as permissões necessárias."
    Write-Host ""

    for ($i = 1; $i -le 90; $i++) {
        try {
            docker info | Out-Null
            Info "Docker daemon está rodando."
            return
        } catch {
            Start-Sleep -Seconds 2
        }
    }

    Fail "Docker Desktop não iniciou a tempo."
    Write-Host ""
    Write-Host "Abra o Docker Desktop manualmente e rode novamente:"
    Write-Host ".\setup-docker-windows.ps1"
    Write-Host ""
    exit 1
}

function Check-Compose {
    Info "Verificando Docker Compose..."

    try {
        $composeVersion = docker compose version
        Info "Docker Compose encontrado: $composeVersion"
    } catch {
        Fail "Docker Compose não está disponível."
        Write-Host "Atualize ou reinstale o Docker Desktop:"
        Write-Host "https://docs.docker.com/desktop/setup/install/windows-install/"
        exit 1
    }
}

function New-SessionSecret {
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

function Write-EnvFile {
    $sessionSecret = New-SessionSecret

@"
APP_PORT=3000

DB_NAME=p_receita
DB_USER=postgres
DB_PASSWORD=123456
DB_HOST=postgres
DB_DIALECT=postgres

SESSION_SECRET=$sessionSecret

MONGO_URL=mongodb://mongodb:27017/portfolio_receitas

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123456
"@ | Set-Content -Encoding UTF8 ".env"
}

function Create-OrFixEnv {
    if (-not (Test-Path ".env")) {
        Info "Criando arquivo .env..."
        Write-EnvFile
        Info "Arquivo .env criado com sucesso."
        return
    }

    Info "Arquivo .env encontrado. Verificando se está pronto para Docker..."

    $envContent = Get-Content ".env" -Raw
    $needsRewrite = $false

    if ($envContent -match "DB_HOST=localhost" -or $envContent -match "DB_HOST=127\.0\.0\.1") {
        $needsRewrite = $true
    }

    if ($envContent -match "MONGO_URL=mongodb://127\.0\.0\.1" -or $envContent -match "MONGO_URL=mongodb://localhost") {
        $needsRewrite = $true
    }

    $requiredKeys = @(
        "APP_PORT",
        "ADMIN_NAME",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "DB_NAME",
        "DB_USER",
        "DB_PASSWORD",
        "SESSION_SECRET",
        "MONGO_URL"
    )

    foreach ($key in $requiredKeys) {
        if ($envContent -notmatch "(?m)^$key=") {
            $needsRewrite = $true
        }
    }

    if ($needsRewrite) {
        Warn "O arquivo .env existente não está pronto para Docker."
        Warn "Criando backup em .env.backup e gerando um novo .env..."

        Copy-Item ".env" ".env.backup" -Force
        Write-EnvFile

        Info "Novo .env criado com configuração Docker."
        Info "Backup salvo como .env.backup."
    } else {
        Info "Arquivo .env já está configurado para Docker."
    }
}

function Test-PortInUse($port) {
    $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    return $null -ne $connection
}

function Set-AppPort {
    Info "Verificando porta da aplicação..."

    $appPort = 3000

    while (Test-PortInUse $appPort) {
        Warn "Porta $appPort já está em uso."
        $appPort++
    }

    $envContent = Get-Content ".env" -Raw

    if ($envContent -match "(?m)^APP_PORT=") {
        $envContent = $envContent -replace "(?m)^APP_PORT=.*", "APP_PORT=$appPort"
        Set-Content -Encoding UTF8 ".env" $envContent
    } else {
        Add-Content ".env" ""
        Add-Content ".env" "APP_PORT=$appPort"
    }

    if ($appPort -eq 3000) {
        Info "Porta 3000 está livre."
    } else {
        Warn "Usando porta alternativa: $appPort"
    }
}

function Get-AppPort {
    $line = Get-Content ".env" | Where-Object { $_ -match "^APP_PORT=" } | Select-Object -First 1
    return ($line -split "=", 2)[1]
}

function Start-Containers {
    Info "Construindo e iniciando containers..."

    docker compose up --build -d

    $appPort = Get-AppPort

    Write-Host ""
    Info "Containers iniciados."
    Write-Host ""
    Write-Host "Aplicação disponível em:" -ForegroundColor Green
    Write-Host "http://localhost:$appPort" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Credenciais padrão:"
    Write-Host "  Email: admin@gmail.com"
    Write-Host "  Senha: 123456"
    Write-Host ""
    Write-Host "Comandos úteis:"
    Write-Host "  Ver logs: docker compose logs -f"
    Write-Host "  Ver logs da aplicação: docker compose logs -f app"
    Write-Host "  Parar containers: docker compose down"
    Write-Host "  Parar e apagar dados dos bancos: docker compose down -v"
}

Check-OrInstallDocker
Wait-ForDockerDaemon
Check-Compose
Create-OrFixEnv
Set-AppPort
Start-Containers