## Overview

![Welcome to Flint-AI-ChatApp Backend](./fav_logo_ngb.png)

Welcome to the Flint-AI-ChatApp Backend! We're excited to have you here. This document will guide you through the setup and usage of the backend service for our chat application. If you have any questions or need further assistance, feel free to reach out to us.

This is the backend service for the Flint-AI-ChatApp. It handles message processing, and interaction with the AI model. But no user authentication at the moment (It will come later). The project was created using the Google Gemini API.

## Prerequisites
- Node.js
- npm / deno
- TypeScript

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [User Authentication and Verification](#user-authentication-and-verification)
    - [Planned Features](#planned-features)
    - [Future Configuration](#future-configuration)
    - [Future API Endpoints](#future-api-endpoints)
- [Authors](#authors)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/AfuhFlyine/Flint-AI-ChatApp-Backend.git
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Configuration
1. Create a `.env` file in the backend directory and add the following environment variables:
    ```env
    GOOGLE_GEMINI_API_KEY = <Your Google gemini api key>
    PORT = 3000
    ```

## Running the Server
Start the server with the following command:
```bash
npm start or deno task start
```
The server will be running on `http://localhost:3000`.

## API Endpoints
- `POST /` - Ping API
- `POST /assist/api/ai` - Ask AI

## User Authentication and Verification

User authentication and verification are crucial components of any chat application. Although the current version of Flint-AI-ChatApp Backend does not include user authentication, we plan to integrate it in future updates. Here is a brief overview of what to expect:

### Planned Features

1. **User Registration**: Users will be able to register using their email and password.
2. **Email Verification**: After registration, users will receive a verification email to confirm their account.
3. **Login**: Registered users can log in using their email and password.
4. **Password Reset**: Users can reset their password if they forget it.
5. **Token-Based Authentication**: Secure API endpoints using JWT (JSON Web Tokens).

### Future Configuration

When user authentication is implemented, you will need to add additional environment variables to your `.env` file:

```env
JWT_SECRET = <Your JWT secret key>
EMAIL_SERVICE_API_KEY = <Your email service API key>
```

### Future API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `POST /auth/verify-email` - Verify user email
- `POST /auth/reset-password` - Reset user password

Stay tuned for updates on these features!


## Authors

- **Your Name** - *Initial work* - [AfuhFlynns](https://github.com/AfuhFlynns)

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Contact
For any inquiries, please contact flyinnsafuh@gmail.com.
