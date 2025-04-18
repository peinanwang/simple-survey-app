# Simple Survey Submission System (Rails API)

This is a backend-only API for managing surveys, built with Ruby on Rails. It supports user authentication (Devise + JWT), role-based permissions (Pundit), and survey assignment/response workflows.

---

## Requirements

- Ruby 3.3.5
- Rails 7.2+
- PostgreSQL
- Node.js & Yarn (optional for frontend)

---

## Setup Instructions

### 1. Clone the Repository and visit the backend subfolder

```bash

cd survey_api
```

### 2. Install Dependencies

```bash
bundle install
```

### 3. Configure the Database

Edit the `config/database.yml` file with your local PostgreSQL credentials:

```yml
default: &default
  adapter: postgresql
  encoding: unicode
  username: your_db_username
  password: your_db_password
  host: localhost

development:
  <<: *default
  database: survey_api_development

test:
  <<: *default
  database: survey_api_test
```

### 4. Create and Migrate the Database

```bash
rails db:create
rails db:migrate
```

### 5. Seed the Database

This will create test users and example surveys.

```bash
rails db:seed
```

### 6. Start the Rails Server

```bash
rails s
```

Visit: `http://localhost:3000`

---

## Authentication (JWT)

Devise + `devise-jwt` is used for authentication.

### Sign Up

```http
POST /signup
```

```json
{
  "user": {
    "email": "test@example.com",
    "name": "John Smith",
    "password": "123456"
  }
}
```

### Log In

```http
POST /login
```

```json
{
  "user": {
    "email": "test@example.com",
    "password": "123456"
  }
}
```

### Log Out

```http
DELETE /logout
```

Add JWT token in `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Default Users

| Role    | Email               | Password |
| ------- | ------------------- | -------- |
| Admin   | admin@example.com   | 123456   |
| Manager | manager@example.com | 123456   |
| User    | test_1@example.com  | 123456   |
| User    | test_2@example.com  | 123456   |

---

## Sample Endpoints

| Method | Endpoint                           | Description                      |
| ------ | ---------------------------------- | -------------------------------- |
| POST   | `/signup`                          | Create new user                  |
| POST   | `/login`                           | Login and receive JWT            |
| DELETE | `/logout`                          | Log out                          |
| GET    | `/survey_requests`                 | View assigned or created surveys |
| POST   | `/survey_requests`                 | Create a new survey              |
| POST   | `/survey_requests/:id/assign_user` | Assign survey to a user          |
| POST   | `/survey_requests/:id/answer`      | Submit answers for a survey      |
| GET    | `/users`                           | Admin/Manager: view all users    |
