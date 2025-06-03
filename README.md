# Node.js Authentication API with MySQL
---
### Overview

This project is the back-end of Kodsho Software built with Node.js, Express, and MySQL. The API provides functionality for user registration and login, with password validation and token-based authentication using JSON Web Tokens (JWT).

### Features
User registration with validations for:
- Email uniqueness
- Password strength (minimum length, uppercase, lowercase, numbers, and special characters)
- User login with token generation for authenticated sessions
- Secure storage of user passwords using bcrypt
- UUID generation for unique user identifiers
- Error handling for invalid input and server-side issues
- Getting Started

#### Follow the steps below to set up and run the project on your local machine:
---

**Prerequisites**
1. Ensure you have the following installed on your system:

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MySQL database
- Installation

2. Clone the repository:

```
git clone <repository-url>
cd <repository-directory>
```

3. Install dependencies: `npm install`

4. Set up environment variables:

- Create a .env file in the project root and define the following variables:

```
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

5. Replace your_database_user, your_database_password, your_database_name, and your_secret_key with your actual database credentials;

**Running the Application**

Start the development server: `npm start`

(The API will run on http://localhost:3000 by default)

**API Endpoints**
1. Register User

- Endpoint: POST /signup

Request Body:

```
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

Validations:
**Name:** Must not be empty.
**Email:** Must be a valid email address and not already registered.
**Password:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@, $, !, %, *, ?, &)

Response:

<p style="color: green;">201 Created:</p>

```
{
  "message": "User registered!"
}
```

<p style="color: red;">422 Validation Error:</p>

```
{
  "message": "Validation failed.",
  "errors": [
    { "msg": "Password must be at least 8 characters long.", "param": "password", "location": "body" },
    { "msg": "Password must contain at least one uppercase letter.", "param": "password", "location": "body" }
  ]
}
```

2. Login User

- Endpoint: POST /login

Request Body:

```
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

Validations:
**Email:** Must be registered.
**Password:** Must match the stored hash.

Response

<p style="color: green;">200 OK:</p>

```
{
  "token": "your.jwt.token",
  "userId": 1
}
```

<p style="color: red;">401 Unauthorized:</p>

```
{
  "message": "Wrong password!"
}
```

**Error Handling**
The API returns structured error responses with HTTP status codes:

- *422 Validation Error:* Input validation failed
- *401 Unauthorized:* Invalid login credentials
- *500 Internal Server Error:* Unexpected server-side error

### How It Works
The password is hashed using bcrypt before saving to the database.
A UUID is generated for each user and stored along with the other details.
User Login:

The password provided is compared with the stored hash using bcrypt.compare.
If valid, a JWT is issued with a 1-hour expiration.
Token:

The JWT contains the user’s email and ID, signed with a secret key.