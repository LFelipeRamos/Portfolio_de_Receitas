#!/bin/bash

set -e

echo "========================================="
echo "Setup com Docker - Portfolio de Receitas"
echo "Linux"
echo "========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Commands used later
DOCKER_CMD="docker"
COMPOSE_CMD="docker compose"

info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERRO]${NC} $1"
}

install_docker() {
  warn "Docker não encontrado."
  warn "Instalando Docker usando o script oficial de conveniência."

  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  rm get-docker.sh

  sudo usermod -aG docker "$USER" || true

  info "Docker instalado."
  warn "Se houver erro de permissão, faça logout/login depois ou execute:"
  echo -e "${YELLOW}newgrp docker${NC}"
}

check_or_install_docker() {
  info "Verificando Docker..."

  if ! command -v docker > /dev/null 2>&1; then
    install_docker
  else
    info "Docker encontrado: $(docker --version)"
  fi
}

check_docker_daemon() {
  info "Verificando se o Docker daemon está rodando..."

  if docker info > /dev/null 2>&1; then
    DOCKER_CMD="docker"
    info "Docker daemon está rodando."
    return
  fi

  warn "Docker está instalado, mas o daemon não está rodando."
  warn "Tentando iniciar o Docker automaticamente..."

  if command -v systemctl > /dev/null 2>&1; then
    sudo systemctl start docker || true
    sudo systemctl enable docker || true

    sleep 3
  fi

  if docker info > /dev/null 2>&1; then
    DOCKER_CMD="docker"
    info "Docker daemon iniciado com sucesso."
    return
  fi

  if sudo docker info > /dev/null 2>&1; then
    DOCKER_CMD="sudo docker"
    warn "Docker funciona com sudo, mas não com o usuário atual."
    warn "Continuando com sudo nesta execução."
    return
  fi

  error "Não foi possível iniciar o Docker automaticamente."

  echo ""
  echo "Possíveis causas:"
  echo "1. Você está usando Docker Desktop e ele precisa ser aberto manualmente."
  echo "2. O serviço Docker Engine não está instalado como serviço systemd."
  echo "3. Seu usuário ainda não tem permissão para usar Docker sem sudo."
  echo ""
  echo "Tente uma destas opções:"
  echo -e "${YELLOW}sudo systemctl start docker${NC}"
  echo -e "${YELLOW}sudo systemctl enable docker${NC}"
  echo -e "${YELLOW}newgrp docker${NC}"
  echo ""
  echo "Depois rode novamente:"
  echo -e "${YELLOW}./setup-docker-linux.sh${NC}"
  echo ""

  exit 1
}

check_compose() {
  info "Verificando Docker Compose..."

  if $DOCKER_CMD compose version > /dev/null 2>&1; then
    COMPOSE_CMD="$DOCKER_CMD compose"
    info "Docker Compose encontrado: $($DOCKER_CMD compose version)"
    return
  fi

  error "Docker Compose não está disponível."
  warn "Tentando instalar o plugin Docker Compose..."

  if command -v apt-get > /dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
  elif command -v yum > /dev/null 2>&1; then
    sudo yum install -y docker-compose-plugin
  elif command -v dnf > /dev/null 2>&1; then
    sudo dnf install -y docker-compose-plugin
  else
    error "Não foi possível instalar Docker Compose automaticamente neste sistema."
    echo "Instale manualmente:"
    echo "https://docs.docker.com/compose/install/linux/"
    exit 1
  fi

  if $DOCKER_CMD compose version > /dev/null 2>&1; then
    COMPOSE_CMD="$DOCKER_CMD compose"
    info "Docker Compose instalado: $($DOCKER_CMD compose version)"
  else
    error "Docker Compose ainda não está disponível após a instalação."
    exit 1
  fi
}

write_env_file() {
  SESSION_SECRET=$(head -c 32 /dev/urandom | base64)

  cat > .env << EOF
APP_PORT=3000

DB_NAME=p_receita
DB_USER=postgres
DB_PASSWORD=123456
DB_HOST=postgres
DB_DIALECT=postgres

SESSION_SECRET=$SESSION_SECRET

MONGO_URL=mongodb://mongodb:27017/portfolio_receitas

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123456
EOF
}

create_or_fix_env() {
  if [ ! -f .env ]; then
    info "Criando arquivo .env..."
    write_env_file
    info "Arquivo .env criado com sucesso."
    return
  fi

  info "Arquivo .env encontrado. Verificando se está pronto para Docker..."

  NEEDS_REWRITE=false

  if grep -q "DB_HOST=localhost" .env || grep -q "DB_HOST=127.0.0.1" .env; then
    NEEDS_REWRITE=true
  fi

  if grep -q "MONGO_URL=mongodb://127.0.0.1" .env || grep -q "MONGO_URL=mongodb://localhost" .env; then
    NEEDS_REWRITE=true
  fi

  if ! grep -q "^APP_PORT=" .env; then
    NEEDS_REWRITE=true
  fi

  if ! grep -q "^ADMIN_NAME=" .env; then
    NEEDS_REWRITE=true
  fi

  if ! grep -q "^ADMIN_EMAIL=" .env; then
    NEEDS_REWRITE=true
  fi

  if ! grep -q "^ADMIN_PASSWORD=" .env; then
    NEEDS_REWRITE=true
  fi

  if ! grep -q "^DB_NAME=" .env; then
    NEEDS_REWRITE=true
  fi

  if ! grep -q "^DB_USER=" .env; then
    NEEDS_REWRITE=true
  fi

  if ! grep -q "^DB_PASSWORD=" .env; then
    NEEDS_REWRITE=true
  fi

  if ! grep -q "^SESSION_SECRET=" .env; then
    NEEDS_REWRITE=true
  fi

  if [ "$NEEDS_REWRITE" = true ]; then
    warn "O arquivo .env existente não está pronto para Docker."
    warn "Criando backup em .env.backup e gerando um novo .env..."

    cp .env .env.backup
    write_env_file

    info "Novo .env criado com configuração Docker."
    info "Backup salvo como .env.backup."
  else
    info "Arquivo .env já está configurado para Docker."
  fi
}

is_port_in_use() {
  PORT="$1"

  if command -v ss > /dev/null 2>&1; then
    ss -ltn | awk '{print $4}' | grep -q ":$PORT$"
    return $?
  fi

  if command -v lsof > /dev/null 2>&1; then
    lsof -i :"$PORT" > /dev/null 2>&1
    return $?
  fi

  return 1
}

set_app_port() {
  info "Verificando porta da aplicação..."

  APP_PORT_VALUE=3000

  while is_port_in_use "$APP_PORT_VALUE"; do
    warn "Porta $APP_PORT_VALUE já está em uso."
    APP_PORT_VALUE=$((APP_PORT_VALUE + 1))
  done

  if grep -q "^APP_PORT=" .env; then
    sed -i "s/^APP_PORT=.*/APP_PORT=$APP_PORT_VALUE/" .env
  else
    echo "" >> .env
    echo "APP_PORT=$APP_PORT_VALUE" >> .env
  fi

  if [ "$APP_PORT_VALUE" = "3000" ]; then
    info "Porta 3000 está livre."
  else
    warn "Usando porta alternativa: $APP_PORT_VALUE"
  fi
}

start_containers() {
  info "Construindo e iniciando containers..."

  $COMPOSE_CMD up --build -d

  APP_PORT_VALUE=$(grep "^APP_PORT=" .env | cut -d "=" -f2)

  echo ""
  info "Containers iniciados."
  echo ""
  echo -e "${GREEN}Aplicação disponível em:${NC}"
  echo -e "${YELLOW}http://localhost:${APP_PORT_VALUE}${NC}"
  echo ""
  echo "Credenciais padrão:"
  echo "  Email: admin@gmail.com"
  echo "  Senha: 123456"
  echo ""
  echo "Comandos úteis:"
  echo "  Ver logs: $COMPOSE_CMD logs -f"
  echo "  Ver logs da aplicação: $COMPOSE_CMD logs -f app"
  echo "  Parar containers: $COMPOSE_CMD down"
  echo "  Parar e apagar dados dos bancos: $COMPOSE_CMD down -v"
}

check_or_install_docker
check_docker_daemon
check_compose
create_or_fix_env
set_app_port
start_containers