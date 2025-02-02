# Welcome to the Flint-AI-ChatApp Backend

<div align="center">
  <img src="./public/flintai-logo.png" alt="Flint ai logo" width="200"/>
</div>

This is the backend service for the Flint-AI-ChatApp. It handles message processing, and interaction with the AI model, User auth and more. The project was created using the Google Gemini API.

## Overview

Flint AI ChatApp is an advanced chat application that leverages artificial intelligence to provide seamless and intelligent communication. This project is designed to demonstrate the capabilities of AI in enhancing user interactions.

## Prerequisites
- node.js
- npm or deno
- TypeScript
- A google gmail account for (mail-host, mail-host-provider, gmail-passkey)
- A github account for (github-client-secret, github-client-id, github-callback-url). *NB: You must have an oauth application created on github with an authorized name* 
- A cloudinary account for (cloudinary-cloud-name, cloudinary-api-key, cloudinary-api-secret)

### Basic understading of:
- Typescript
- Nodejs with Expressjs

## Table of Contents

- [Welcome to the Flint AI ChatApp frontend](#welcome-to-the-flint-ai-chatapp-frontend)
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Table of contents](#table-of-contents)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [User Authentication and Verification](#user-authentication-and-verification)
    - [Planned Features](#planned-features)
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
2. Install the dependencies:
    ```bash
    npm install or deno install or yarn install
    ```

## Configuration
1. Create a `.env` file in the backend directory and add the following environment variables:
    ```env

    MONGODB_URL = mongodb-contect-string

    GOOGLE_GEMINI_API_KEY = google-gemini-api-key
    ACCESS_TOKEN_SECRET = your-access-token-secret
    REFRESH_TOKEN_SECRET = your-refresh-token-secret
    EXPRESS_SESSION_SECRET = your-express-session-secret

    APP_STATUS = development (in dev environment) or production (in production environment)
    CLIENT_URL = your-frontend-url (NB: replace with remote url in production)

    MAIL_HOST = your-mail-host
    MAIL_SERVICE_PROVIDER = your-mail-hosting-provider
    SENDER_EMAIL = your-email
    GMAIL_PASS_KEY = your-mail-host-passkey

    GITHUB_CLIENT_SECRET = github-client-secret
    GITHUB_CLIENT_ID = github-client-id
    GITHUB_CALLBACK_URL = github-client-callback-url

    CLOUDINARY_CLOUD_NAME = your-cloudinary-cloud-name
    CLOUDINARY_API_KEY = your-cloudinary-api-key
    CLOUDINARY_API_SECRET = your-cloudinary-api-secret

    ADMIN_EMAIL = your-email

    PORT = your-preferred-port
    ```

## Running the Server
Start the server with the following command:
```bash
npm start or deno task start (in dev mode use: npm run dev or deno task dev)
```
The server will be running on `<http:localhost:PORT-interminal>.

## API Endpoints
- `POST /` - Ping API
- `POST /assist/api/ai` - Ask AI

## User Authentication and Verification

### Authentication

The Flint AI ChatApp backend supports user authentication to ensure secure access to the application. The authentication process involves the following steps:

1. **Sign Up**: Users can create a new account by providing their email, username, and password or via github.
2. **Email confirmation**: Users verify their accounts by providing a verification code if signed up locally
3. **Login**: Registered users can log in using their email and password.
4. **Token Management**: Upon successful login, a JSON Web Token (JWT) is issued (using express-session) and stored in the browser's local storage for subsequent authenticated requests.

### Verification

To enhance security, the Flint AI ChatApp includes email verification for new users. The verification process includes:

1. **Email Verification**: After signing up, users receive a verification email with a unique 6 digit code.
2. **Account Activation**: Users must click the verification link and submit their confirmation code to verify their account and gain full access to the application

### Implementation Details

#### Sign Up

To sign up, users need to fill out the registration form and submit it. The frontend sends a POST request to the backend API endpoint `/api/auth/users/sign-up` with the user's details or `/api/auth/users/github` for gitHub auth.

#### Login

For logging in, users enter their credentials in the login form. The frontend sends a POST request to the backend API endpoint `/api/auth/users/log-in` or `/api/auth/users/github` for gitHub auth. If the credentials are valid, the backend responds with a JWT, which is stored in local storage.

#### Email Verification

After successful registration, the backend sends a verification email to the user. The email contains a link to the frontend email confirmation page and a 6 digit verification code. When the user enters the code, the backend verifies the code and activates the account.

### Example Code

#### Sign up Controller

```ts
// Register user
export const registerUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  // Check if all required fields are provided
  if (!username || !password || !email)
    return res.status(400).json({ message: "All fields are required" });
  try {
    // Check if user already exists
    const userNameExists = await User.findOne({ username: username });
    if (userNameExists)
      return res.status(400).json({
        message: "User with this username already exists. You can login",
      });
    const userEmailExists = await User.findOne({ email: email });
    if (userEmailExists)
      return res.status(400).json({
        message: "User with this email already exists. You can login",
      });
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate a new verification token
    const token: string = await crypto.randomBytes(60).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // one day
    // Generate new verification code
    const verificationCode: string = generateVerificationCode();
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      verificationCode,
      verificationCodeExpires: expiresAt,
      verificationToken: token,
      verificationTokenExpires: expiresAt,
    });
    await newUser.save();

    await sendVerificationEmail(verificationCode, email, username, token, {
      "X-Category": "Verification Email",
    });

    return res.status(201).json({
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};
```

#### Login Controller

```ts
// Login a user
export const loginUser = async (
  req: Request & RequestWithUser,
  res: Response
) => {
  try {
    const loggedInUser = await User.findOne({
      email: req.user.email,
    });

    if (loggedInUser) {
      // Save a new access token on client browser
      // Set JWT as an httpOnly cookie
      res.cookie("token", loggedInUser.accessToken, {
        httpOnly: true, // Makes the cookie inaccessible via JavaScript
        secure: process.env.APP_STATUS === "development" ? false : true, // Set to true if you're using HTTPS
        sameSite: "strict",
        maxAge: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      //send notification email
      await sendNotificationEmail(
        "Account Login",
        loggedInUser.email,
        loggedInUser.username,
        new Date().toLocaleDateString(),
        `${loggedInUser.username}, ${loggedInUser.email}`,
        { "X-Category": "Login Notification" }
      );
      return res.status(200).json({ message: "Logged in successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
```

### Planned Features

1. **User Registration**: Users will be able to register using their email and password.
2. **Email Verification**: After registration, users will receive a verification email to confirm their account.
3. **Login**: Registered users can log in using their email and password.
4. **Password Reset**: Users can reset their password if they forget it.
5. **Token-Based Authentication**: Secure API endpoints using JWT (JSON Web Tokens).

### Future API Endpoints

- `POST /api/auth/users/sign-up` - Register a new user
- `POST /api/auth/users/log-in` - Login a user
- `POST /api/auth/users/verify-email` - Verify user email
- `POST /api/auth/users/reset-password/:token` - Reset user password
- `POST /api/auth/users/forgot-password` - Send user password reset email details
- `GET /api/auth/users/get-user-profile` - Send user profile info to frontend

Stay tuned for updates on these features!

## Authors

- **Afuh Flyine Tembeng** - *Initial work* - [AfuhFlynns](https://github.com/AfuhFlynns)

## License

This project is proprietary and subject to the terms described in the [LICENSE TEXT FILE](./LICENSE.txt) or [LICENSE MARKDOWN FILE](./LICENSE.md) file. Unauthorized copying, distribution, or modification of this software is strictly prohibited.


## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Contact
For any inquiries, please contact flyinnsafuh@gmail.com.
