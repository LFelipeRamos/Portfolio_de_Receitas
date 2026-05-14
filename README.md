# Portfolio de Receitas

Sistema web para gerenciamento de receitas, alunos, habilidades e comentários.

## 🚀 Início rápido com Docker

A forma mais simples de rodar o projeto localmente é com Docker. A aplicação sobe com PostgreSQL, MongoDB e o servidor Node em containers separados.

Os scripts de setup fazem automaticamente:

- verificam se Docker está instalado
- instalam ou orientam a instalação do Docker quando possível
- iniciam/verificam o Docker
- criam ou corrigem o arquivo `.env`
- escolhem automaticamente uma porta livre para a aplicação
- executam `docker compose up --build -d`

Por padrão, a aplicação tenta usar:

```text
http://localhost:3000
```

Se a porta `3000` já estiver ocupada, o script usa automaticamente `3001`, `3002`, etc.

---

## 🐧 Linux e 🍎 macOS

Na pasta do projeto:

```bash
cd Portfolio_de_Receitas
chmod +x setup-docker.sh
./setup-docker.sh
```

O script detecta automaticamente se o sistema é Linux ou macOS.

No Linux, ele tenta instalar e iniciar o Docker Engine automaticamente.

No macOS, ele usa Docker Desktop. Se Docker Desktop não estiver instalado, o script tenta instalar via Homebrew. Se você não tiver Homebrew, instale o Docker Desktop manualmente:

```text
https://docs.docker.com/desktop/setup/install/mac-install/
```

Depois abra o Docker Desktop e rode novamente:

```bash
./setup-docker.sh
```

---

## 🪟 Windows

No Windows, use PowerShell.

Abra o PowerShell na pasta do projeto e rode:

```powershell
.\setup-docker-windows.ps1
```

Se o PowerShell bloquear a execução do script, rode:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup-docker-windows.ps1
```

Esse comando libera a execução de scripts somente para a sessão atual do PowerShell.

Se preferir, você também pode usar o arquivo `.bat`:

```text
setup-docker-windows.bat
```

O script verifica se Docker está instalado. Se Docker não estiver instalado, ele tenta instalar o Docker Desktop via `winget`.

Se a instalação automática não funcionar, instale o Docker Desktop manualmente:

```text
https://docs.docker.com/desktop/setup/install/windows-install/
```

Depois abra o Docker Desktop e rode novamente o script.

---

## ✅ Após o setup

Ao final, o script mostra a URL correta da aplicação, por exemplo:

```text
http://localhost:3000
```

ou, se a porta `3000` estiver ocupada:

```text
http://localhost:3001
```

**Credenciais padrão:**

- Email: `admin@gmail.com`
- Senha: `123456`

---

## ⚙️ Arquivo `.env`

O arquivo `.env` é criado automaticamente pelos scripts de setup.

Para Docker, ele deve usar os nomes dos serviços do `docker-compose.yml`:

```env
DB_HOST=postgres
MONGO_URL=mongodb://mongodb:27017/portfolio_receitas
```

Não use isto dentro do Docker:

```env
DB_HOST=localhost
MONGO_URL=mongodb://localhost:27017/portfolio_receitas
```

Dentro de um container, `localhost` aponta para o próprio container, não para os containers do PostgreSQL ou MongoDB.

Exemplo de `.env` usado pelo Docker:

```env
APP_PORT=3000

DB_NAME=p_receita
DB_USER=postgres
DB_PASSWORD=123456
DB_HOST=postgres
DB_DIALECT=postgres

SESSION_SECRET=uma_chave_gerada_automaticamente

MONGO_URL=mongodb://mongodb:27017/portfolio_receitas

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123456
```

O script pode criar um backup do `.env` antigo como `.env.backup` se detectar configurações incompatíveis com Docker.

---

## 🧰 Gerenciar containers

```bash
# Ver logs em tempo real
docker compose logs -f

# Ver logs somente da aplicação
docker compose logs -f app

# Parar containers
docker compose down

# Parar containers e remover volumes, apagando dados dos bancos
docker compose down -v
```

---

## 📋 Requisitos para instalação manual, sem Docker

Se preferir instalar localmente sem Docker:

- Node.js 20+
- PostgreSQL rodando localmente
- MongoDB rodando localmente

---

## 🛠️ Instalação manual, sem Docker

1. Clone o repositório:

```bash
git clone https://github.com/LFelipeRamos/Portfolio_de_Receitas.git
cd Portfolio_de_Receitas
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto:

```env
DB_NAME=p_receita
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_DIALECT=postgres

MONGO_URL=mongodb://localhost:27017/portfolio_receitas

SESSION_SECRET=uma_chave_secreta_forte

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123456
```

4. Crie o banco de dados PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE p_receita;
\q
```

5. Inicie a aplicação:

```bash
npm run dev
```

A aplicação estará em:

```text
http://localhost:3000
```

---

## 📦 Scripts disponíveis

```bash
# Modo desenvolvimento
npm run dev

# Build do frontend
npm run build

# Abrir frontend com Vite
npm run client

# Verificar código com ESLint
npm run lint

# Corrigir código automaticamente
npm run lint:fix
```

---

## 🗄️ Bancos de dados

### PostgreSQL

Usado para armazenar os dados relacionais da aplicação.

No Docker, o PostgreSQL roda no serviço:

```text
postgres
```

Internamente, a aplicação se conecta usando:

```env
DB_HOST=postgres
```

### MongoDB

Usado para armazenar dados de sessão e outros documentos.

No Docker, o MongoDB roda no serviço:

```text
mongodb
```

Internamente, a aplicação se conecta usando:

```env
MONGO_URL=mongodb://mongodb:27017/portfolio_receitas
```

---

## 👤 Primeiro acesso

Na primeira vez que a aplicação inicia, ela cria automaticamente um usuário admin com as credenciais do `.env`:

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Se o usuário já existir, ele não será recriado.

Credenciais padrão criadas pelos scripts:

- Email: `admin@gmail.com`
- Senha: `123456`

---

## 📁 Estrutura do projeto

```text
Portfolio_de_Receitas/
├── config/                    # Configurações de banco e associações
├── controllers/               # Lógica dos endpoints
├── middlewares/               # Middlewares
├── models/                    # Modelos Sequelize
├── routes/                    # Definição de rotas
├── src/                       # Frontend React
│   ├── pages/                 # Páginas da aplicação
│   ├── App.jsx
│   └── main.jsx
├── app.js                     # Servidor Express
├── vite.config.js             # Configuração Vite
├── package.json
├── package-lock.json
├── Dockerfile                 # Imagem Docker da aplicação
├── docker-compose.yml         # PostgreSQL, MongoDB e app
├── setup-docker.sh            # Setup para Linux e macOS
├── setup-docker-windows.ps1   # Setup para Windows PowerShell
├── setup-docker-windows.bat   # Atalho opcional para Windows
├── .env.example               # Exemplo de variáveis de ambiente
├── .dockerignore
└── README.md
```

---

## 🤝 Tecnologias

- **Backend:** Node.js, Express, Sequelize, Mongoose
- **Frontend:** React, Vite
- **Banco de dados:** PostgreSQL, MongoDB
- **Containerização:** Docker, Docker Compose

---

## 📝 Observações

- O backend usa `sequelize.sync()` para criar tabelas automaticamente
- O frontend é buildado para `dist/` e servido pelo Express
- A autenticação é baseada em sessão com bcrypt
- O usuário admin automático só é criado se não existir
- Os dados do Docker Compose ficam em volumes persistentes
- Os scripts escolhem uma porta livre automaticamente para a aplicação
- PostgreSQL e MongoDB não precisam expor portas para o host, pois a aplicação acessa os bancos pela rede interna do Docker

---

## 🐛 Troubleshooting

### PowerShell bloqueou o script no Windows

Rode:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup-docker-windows.ps1
```

Esse comando vale apenas para a sessão atual do PowerShell.

---

### Docker Desktop não iniciou

Abra o Docker Desktop manualmente e aguarde ele terminar de iniciar.

Depois rode novamente o script da sua plataforma.

Linux/macOS:

```bash
./setup-docker.sh
```

Windows:

```powershell
.\setup-docker-windows.ps1
```

---

### Porta 3000 já está em uso

Os scripts tentam resolver isso automaticamente, usando `3001`, `3002`, etc.

Ao final do setup, veja a URL exibida no terminal.

Exemplo:

```text
Aplicação disponível em:
http://localhost:3001
```

---

### Ver logs da aplicação

```bash
docker compose logs -f app
```

---

### Rebuild dos containers

```bash
docker compose down
docker compose up --build -d
```

---

### Apagar todos os dados dos bancos Docker

Cuidado: isso remove os volumes do PostgreSQL e MongoDB.

```bash
docker compose down -v
```

Depois rode novamente o script de setup.

---

### Erro de conexão com PostgreSQL

Verifique os logs:

```bash
docker compose logs postgres
docker compose logs app
```

Dentro do Docker, confirme que o `.env` usa:

```env
DB_HOST=postgres
```

e não:

```env
DB_HOST=localhost
```

---

### Erro de conexão com MongoDB

Verifique os logs:

```bash
docker compose logs mongodb
docker compose logs app
```

Dentro do Docker, confirme que o `.env` usa:

```env
MONGO_URL=mongodb://mongodb:27017/portfolio_receitas
```

e não:

```env
MONGO_URL=mongodb://localhost:27017/portfolio_receitas
```

---

## 📄 Licença

ISC

---

**Dúvidas?** Abra uma issue no repositório.

## Agradecimento

Agradeço de coração ao meu grande amigo e mentor [rayan6ms](https://github.com/rayan6ms) por me auxiliar no decorrer do desenvolvimento do projeto.
