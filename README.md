````md
# Todo List API

A RESTful Todo List API built with Node.js, Express.js, MongoDB, and JWT Authentication.

## API Documentation

🌐 Live Documentation:

https://mohammadh-ghasemi.github.io/todo-list-api/todo-list-api-documentation.html

## Features

- User Authentication & Authorization
- JWT-based Login System
- Password Hashing with bcrypt
- Forgot Password & Reset Password Flow
- CRUD Operations for Todos
- User-specific Todos
- Protected Routes
- Cookie-based Authentication
- Global Error Handling
- MongoDB with Mongoose
- API Testing Collection (Bruno)

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcryptjs

### Development Tools

- ESLint
- Prettier
- Bruno API Client

---

## Project Structure

```text
├── controllers/
│   ├── authController.js
│   ├── todoController.js
│   ├── userController.js
│   └── errorController.js
│
├── models/
│   ├── userModel.js
│   └── todoModel.js
│
├── routes/
│   ├── userRoutes.js
│   └── todoRoutes.js
│
├── utils/
│
├── dev-data/
│   ├── Bruno-data/
│   └── api-documentation.html
│
├── app.js
├── server.js
└── package.json
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/mohammadh-ghasemi/todo-list-api.git
cd todo-list-api
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development

PORT=3000

DATABASE=mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d

JWT_COOKIE_EXPIRES_IN=90

```

---

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

---

## Authentication Endpoints

| Method | Endpoint                             | Description               |
| ------ | ------------------------------------ | ------------------------- |
| POST   | `/api/v1/users/signup`               | Register new user         |
| POST   | `/api/v1/users/login`                | Login                     |
| POST   | `/api/v1/users/forgotPassword`       | Send password reset token |
| PATCH  | `/api/v1/users/resetPassword/:token` | Reset password            |
| PATCH  | `/api/v1/users/updateMyPassword`     | Update current password   |

---

## User Endpoints

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/v1/users`          | Get all users       |
| PATCH  | `/api/v1/users/updateMe` | Update profile      |
| DELETE | `/api/v1/users/deleteMe` | Soft delete account |

---

## Todo Endpoints

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| GET    | `/api/v1/todos`     | Get all todos   |
| GET    | `/api/v1/todos/:id` | Get single todo |
| POST   | `/api/v1/todos`     | Create todo     |
| PATCH  | `/api/v1/todos/:id` | Update todo     |
| DELETE | `/api/v1/todos/:id` | Delete todo     |

---

## Security Features

- Password hashing using bcrypt
- JWT authentication
- Protected routes
- Password reset tokens
- Secure cookie handling
- Centralized error handling

---

## API Testing

A complete Bruno collection is included inside:

```text
dev-data/Bruno-data
```

You can import it directly into Bruno and test all API endpoints.

---

## Future Improvements

- Refresh Token Rotation
- Role-Based Access Control (RBAC)
- Pagination
- Filtering & Sorting
- Rate Limiting
- Email Verification
- Docker Support
- PostgreSQL Support

---

## Author

GitHub: https://github.com/mohammadh-ghasemi
````
