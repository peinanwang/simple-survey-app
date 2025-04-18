# Simple Survey Submission System

This is a full-stack web app for creating, managing, assigning, and responding to surveys. It supports different roles (Admin, Manager, User) with tailored access to functionality.

---

## Setup Instructions

### Frontend (React + Chakra UI)

- Navigate into the frontend directory:
  ```bash
  cd survey-app-frontend
  ```
- Start the frontend:
  ```bash
  npm install
  npm run dev
  ```
- Visit the app at: [http://localhost:5173](http://localhost:5173)

---

### Backend (Rails 7 API)

- Navigate into the backend directory:
  ```bash
  cd survey_api
  ```
- Setup and seed the database:
  ```bash
  bundle install
  rails db:create db:migrate db:seed
  ```
- Start the Rails server:
  ```bash
  rails server
  ```
- Server runs at: [http://localhost:5000](http://localhost:5000)

---

## User Guide

### Regular User

#### Login

- Email: `test_1@example.com`, Password: `123456`
- Email: `test_2@example.com`, Password: `123456`
- Or Sign Up for a new user account
  _(Note: after signing up, you’ll be redirected to the login screen to simulate email confirmation.)_

#### Features

- View surveys assigned to you
- Complete and submit uncompleted surveys
- View previously completed surveys
- Use search bar to filter your assigned surveys by title
- Known Issue: Completed survey answers may not display correctly due to mapping inconsistencies_

---

### Admin / Manager

#### Login

- Admin: `admin@example.com`, Password: `123456`
- Manager: `manager@example.com`, Password: `123456`

#### Features

- Create and edit surveys
- Assign surveys to users
- Delete incomplete surveys
- Filter surveys by title and creator name
- View all surveys regardless of assignee

---

## Limitations

- Admin and Manager currently share the same frontend capabilities; backend (via Pundit) enforces stricter access rules
- UI/UX design is functional but could use polish
- Lacking full test coverage:
  - More RSpec needed on Rails backend
  - Cypress integration needed for frontend
