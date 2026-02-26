# Entourage API

Documentação dos endpoints no [Swagger](http://localhost:4521/docs)

## Setup inicial
Para fazer o setup inicial será necessário alguns pré-requisitos, tais como:
- Docker instalado
- Node.js instalado
- yarn instalado
- Container entourage-database rodando

## Instalação

#### 1. Caso ainda não possua o yarn instalado, execute o comando abaixo, se não, pule para o próximo passo:
```bash
$ npm install -g yarn
```

#### 2. Instale as dependências do projeto:
```bash
$ yarn
```

#### 3. Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:
```bash
# API
API_MODE=direct
API_PROTOCOL=http
API_ADDRESS=localhost
API_PORT=4521

# SECURITY
JWT_SECRET=elJ79pQbDyOye1xus11y5bRHmMapkVrcsSFc
JWT_EXPIRATION_TIME=1d
JWT_REFRESH_SECRET=icMiZ8lqvQZJFyIjW9dJJJ1QvtKfZrI8fn1u
JWT_REFRESH_EXPIRATION_TIME=7d

# ENCRYPTION
ENCRYPTION_SECRET=eWvLcENb9VFy32gV9RcVnhnmEzexRISfQCv8

# DOCUMENTATION
DOCS_ENABLED=true
DOCS_OPERATOR=cuiatech
DOCS_PASSWORD="uQaGBLeoX~Q3]xOr"

# DATABASE
DATABASE_URL="postgresql://postgres:Y3WjwtOEoBN39N5fRsgO@localhost:5462/entourage?schema=public"
```

`OBS: As variáveis de ambiente acima são apenas exemplos, você pode alterá-las conforme necessário. O arquivo .env não deve ser versionado.`

`OBS2: O valor da variável DATABASE_URL deve ser alterado de acordo com as variáveis definidas do container entourage-database`

#### 4. Executando as migrações
```bash
$ yarn prisma migrate dev && yarn prisma migrate deploy
```

#### 5. Criando os dados iniciais
```bash
$ yarn console:dev populate
```

## Iniciando o projeto
```bash
$ yarn start:dev
```

## Criando compilação para produção
```bash
$ yarn build
```
