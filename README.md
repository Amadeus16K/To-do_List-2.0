# API de Gerenciamento de Tarefas (To-Do List 2.0)

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## 📖 Sobre o Projeto

Esta é uma API RESTful completa para um sistema de gerenciamento de tarefas (To-Do List), desenvolvida como parte do meu portfólio de desenvolvedor Back-end. O projeto demonstra habilidades em construção de APIs seguras, autenticação baseada em token, manipulação de banco de dados relacional e conteinerização com Docker.

O principal objetivo é fornecer uma base sólida e segura onde um usuário pode se cadastrar, fazer login e gerenciar suas próprias tarefas, sem ter acesso às tarefas de outros usuários.

---

## ✨ Funcionalidades

- **Autenticação de Usuários**: Sistema completo de registro e login com senhas criptografadas (`bcrypt`) e autenticação via **JSON Web Tokens (JWT)**.
- **CRUD de Tarefas**: Operações completas de Criar, Ler, Atualizar e Deletar tarefas.
- **Segurança**: Rotas protegidas que só podem ser acessadas por usuários autenticados.
- **Relacionamento de Dados**: Cada tarefa está estritamente associada ao usuário que a criou.
- **Gerenciamento de Banco de Dados**: Uso do **Knex.js** para criar e gerenciar as tabelas do banco de dados através de *migrations*.

---

## 🛠️ Tecnologias Utilizadas

- **Back-end**: Node.js, Express.js
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JSON Web Tokens (JWT), bcrypt.js
- **Conteinerização**: Docker, Docker Compose
- **Migrations**: Knex.js

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para ter uma cópia do projeto rodando na sua máquina.

**Pré-requisitos:**
- [Node.js](https://nodejs.org/en/) (v16 ou superior)
- [Docker](https://www.docker.com/products/docker-desktop/)
- Um cliente de API como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/)

**Passo a passo:**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Amadeus16K/To-do_List-2.0.git](https://github.com/Amadeus16K/To-do_List-2.0.git)
    cd To-do_List-2.0
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
    - Preencha as variáveis de ambiente no arquivo `.env` conforme necessário.

4.  **Inicie o container do banco de dados com Docker:**
    ```bash
    docker-compose up -d
    ```

5.  **Execute as migrations para criar as tabelas:**
    ```bash
    npx knex migrate:latest
    ```

6.  **Inicie o servidor da API:**
    ```bash
    npm run dev
    ```

Pronto! A API estará rodando em `http://localhost:3000`.

---

## API Endpoints

A URL base para todos os endpoints é `/api`.

### Autenticação

| Método | Endpoint          | Descrição                                         |
| :----- | :---------------- | :------------------------------------------------ |
| `POST` | `/users/register` | Registra um novo usuário.                         |
| `POST` | `/users/login`    | Autentica um usuário e retorna um token JWT.      |
| `GET`  | `/users/me`       | **(Protegido)** Retorna o perfil do usuário logado. |

### Tarefas (Tasks)

*Todas as rotas de tarefas são protegidas e exigem um token JWT no cabeçalho `Authorization: Bearer seu_token`.*

| Método   | Endpoint     | Descrição                                 |
| :------- | :----------- | :---------------------------------------- |
| `POST`   | `/tasks`     | Cria uma nova tarefa.                     |
| `GET`    | `/tasks`     | Lista todas as tarefas do usuário logado.   |
| `GET`    | `/tasks/:id` | Obtém uma tarefa específica pelo ID.      |
| `PUT`    | `/tasks/:id` | Atualiza uma tarefa específica.           |
| `DELETE` | `/tasks/:id` | Deleta uma tarefa específica.             |

---

Feito com ❤️ por **Amadeus Moura**.
