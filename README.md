# Portfolio de Receitas

Sistema web para gerenciamento de receitas, alunos, habilidades e comentários.

## 🚀 Início rápido com Docker

A forma mais simples de rodar o projeto localmente é com Docker. A aplicação sobe com PostgreSQL, MongoDB e o servidor Node em containers separados.

### Linux

```bash
cd Portfolio_de_Receitas
chmod +x setup-docker-linux.sh
./setup-docker-linux.sh
```

### Outras plataformas

Se você estiver no macOS ou Windows, instale o Docker Desktop e rode os comandos abaixo na pasta do projeto:

```bash
docker compose up -d --build
```

O `docker compose` vai ler o arquivo `.env` da raiz do projeto automaticamente. Se o arquivo não existir, crie um com as variáveis da seção de instalação manual.

**Após terminar, acesse:** `http://localhost:3000`

**Credenciais padrão:**

- Email: `admin@gmail.com`
- Senha: `123456`

### Gerenciar containers

```bash
# Ver logs em tempo real
docker compose logs -f

# Parar containers
docker compose down

# Parar e remover volumes (limpa dados)
docker compose down -v
```

---

## 📋 Requisitos (sem Docker)

Se preferir instalar localmente:

- Node.js 20+ instalado
- PostgreSQL rodando
- MongoDB rodando

## 🛠️ Instalação manual

1. Clone o repositório:

```bash
git clone https://github.com/LFelipeRamos/Portfolio_de_Receitas.git
cd Portfolio_de_Receitas
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
DB_NAME=portfolio_receitas
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
CREATE DATABASE portfolio_receitas;
\q
```

5. Inicie os serviços e a aplicação:

```bash
# Terminal 1: Iniciar a aplicação
npm run dev
```

A aplicação estará em: `http://localhost:3000`

## 📦 Scripts disponíveis

```bash
# Modo desenvolvimento (com build automático)
npm run dev

# Build do frontend
npm run build

# Abrir frontend com Vite (desenvolvimento)
npm run client

# Verificar código com ESLint
npm run lint

# Corrigir código automaticamente
npm run lint:fix
```

## 🗄️ Bancos de dados

### PostgreSQL

O banco é criado automaticamente pelo `sequelize.sync()` na primeira execução. As tabelas também são criadas automaticamente.

### MongoDB

Usado para armazenar dados de sessão e outros documentos.

## 👤 Primeiro acesso

Na primeira vez que a aplicação inicia, cria automaticamente um usuário admin com as credenciais do `.env`:

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Se o usuário já existir, ele não será recriado.

## 📁 Estrutura do projeto

```
Portfolio_de_Receitas/
├── config/           # Configurações de banco e associações
├── controllers/      # Lógica dos endpoints
├── middlewares/      # Middlewares (autenticação, etc)
├── models/          # Modelos Sequelize
├── routes/          # Definição de rotas
├── src/             # Frontend React
│   ├── pages/       # Páginas da aplicação
│   ├── App.jsx
│   └── main.jsx
├── app.js           # Servidor Express
├── vite.config.js   # Configuração Vite
├── package.json
├── Dockerfile       # Imagem Docker
├── docker-compose.yml  # Orquestração Docker
└── README.md
```

## 🤝 Tecnologias

- **Backend:** Node.js, Express, Sequelize, MongoDB/Mongoose
- **Frontend:** React, Vite
- **Banco de dados:** PostgreSQL, MongoDB
- **Containerização:** Docker, Docker Compose

## 📝 Observações

- O backend usa `sequelize.sync()` para criar tabelas automaticamente
- O frontend é buildado para `dist/` e servido pelo Express
- A autenticação é baseada em sessão com bcrypt
- Admin automático só é criado se não existir
- Todos os dados do Docker Compose ficam em volumes persistentes

## 🐛 Troubleshooting

### Porta 3000 já está em uso

```bash
# Mudar porta em docker-compose.yml ou localizar processo
lsof -i :3000
kill -9 <PID>
```

### Docker não inicia

```bash
# Verificar status do Docker
docker ps

# Rebuild de containers
docker compose down
docker compose up -d --build
```

### Erro de conexão com PostgreSQL

```bash
# Verificar se container está rodando
docker compose logs postgres

# Testar conexão
docker compose exec postgres psql -U postgres -d portfolio_receitas
```

## 📄 Licença

ISC

---

**Dúvidas?** Abra uma issue no repositório!
