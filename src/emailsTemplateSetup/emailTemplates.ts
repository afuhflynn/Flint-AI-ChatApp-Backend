const verificationEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    /* General Reset */
    a {
  text-decoration: none; /* Removes underline */
  color: inherit; /* Inherits the color from the parent element */
  background: none; /* Removes any background styles */
  border: none; /* Removes any borders */
  outline: none; /* Removes focus outlines */
  cursor: pointer; /* Optional: ensures the pointer cursor appears */
}

    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f7fc;
      color: #333333;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .email-container {
      min-height: 85vh;
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e1e4e8;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Header */
    .email-header {
      text-align: center;
      padding: 20px;
      background-color: #0073e6;
    }

    .email-header img {
      max-width: 150px;
    }

    /* Main Content */
    .email-content {
      padding: 20px;
      text-align: center;
    }

    .verification-code {
      margin: 20px auto;
      padding: 15px;
      font-size: 24px;
      font-weight: bold;
      color: #0073e6;
      background-color: #f1f8fe;
      border: 1px solid #d6e9ff;
      border-radius: 8px;
      max-width: 300px;
    }

    .email-button {
      display: inline-block;
      background-color: #0073e6;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 20px;
      font-size: 16px;
      border-radius: 5px;
      margin: 20px 0;
    }

    /* Footer */
    .email-footer {
      background-color: #f9fafc;
      padding: 10px;
      text-align: center;
      font-size: 14px;
      color: #666666;
    }

    .email-footer a {
      color: #0073e6;
      text-decoration: none;
    }

    /* Responsive Design */
    @media screen and (max-width: 768px) {
      .email-container {
        width: 95%;
      }

      .verification-code {
        font-size: 20px;
        padding: 10px;
      }
    }

    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #121212;
        color: #e0e0e0;
      }
      .email-container {
        background-color: #1e1e1e;
        border: 1px solid #333333;
      }
      .email-header {
        background-color: #1a73e8;
      }
      .verification-code {
        background-color: #333333;
        color: #ffffff;
        border: 1px solid #555555;
      }
      .email-button {
        background-color: #1a73e8;
        color: #ffffff;
        cursor: pointer;
      }
      .email-footer {
        background-color: #292929;
        color: #aaaaaa;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <img src="cid:unique_inline_logo_cid" alt="Flint AI Logo"> <h1 style="color: #FFFFFF; font-weight: bold;">Flint AI</h1>
    </div>

    <!-- Main Content -->
    <div class="email-content">
      <h1 style="color: #0073e6;">Verify Your Email</h1>
      <p>
        Hi, [user_name] </br>
        Thank you for signing up with Flint AI! Use the code below to verify your email address or click the button to activate your account.
      </p>

      <!-- Verification Code -->
      <div class="verification-code">
        [verification_code]
      </div>

      <!-- Button -->
      <a href=[verification_link] class="email-button">Verify Email</a>

      <p style="font-size: 14px;">
        If you didn’t sign up, ignore this email or contact support for assistance.
      </p>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>Need help? <a href="mailto:flyinnsafuh@gmail.com" style="cursor: pointer;">Contact our support team</a>.</p>
    </div>
  </div>
</body>
</html>
`;

const welcomeEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Flint AI!</title>
  <style>
    /* General Reset */
    a {
  text-decoration: none; /* Removes underline */
  color: inherit; /* Inherits the color from the parent element */
  background: none; /* Removes any background styles */
  border: none; /* Removes any borders */
  outline: none; /* Removes focus outlines */
  cursor: pointer; /* Optional: ensures the pointer cursor appears */
}

    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f7fc;
      color: #333333;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .email-container {
      min-height: 85vh;
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e1e4e8;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Header */
    .email-header {
      text-align: center;
      padding: 20px;
      background-color: #1a73e8;
    }

    .email-header img {
      max-width: 150px;
    }

    /* Main Content */
    .email-content {
      padding: 20px;
      text-align: center;
    }

    .welcome-message {
      margin: 20px auto;
      font-size: 24px;
      font-weight: bold;
      color: #1a73e8;
    }

    .email-button {
      display: inline-block;
      background-color: #1a73e8;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 20px;
      font-size: 16px;
      border-radius: 5px;
      margin: 20px 0;
    }

    .email-footer {
      background-color: #f9fafc;
      padding: 10px;
      text-align: center;
      font-size: 14px;
      color: #666666;
    }

    .email-footer a {
      color: #1a73e8;
      text-decoration: none;
    }

    /* Responsive Design */
    @media screen and (max-width: 768px) {
      .email-container {
        width: 95%;
      }
    }

    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #121212;
        color: #e0e0e0;
      }
      .email-container {
        background-color: #1e1e1e;
        border: 1px solid #333333;
      }
      .email-header {
        background-color: #1a73e8;
      }
      .email-button {
        background-color: #1a73e8;
        color: #ffffff;
        cursor: pointer;
      }
      .email-footer {
        background-color: #292929;
        color: #aaaaaa;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <img src="cid:unique_inline_logo_cid" alt="Flint AI Logo"> <h1 style="color: #FFFFFF; font-weight: bold;">Flint AI</h1>
    </div>

    <!-- Main Content -->
    <div class="email-content">
      <h1 style="color: #1a73e8;">Welcome to Flint AI!</h1>
      <p class="welcome-message">
        Hi, [user_name]!</p>
      <p>
        Thank you for joining the Flint AI community. We're excited to have you on board! You can now start exploring our platform and make the most of the resources we offer to help you grow and succeed.
      </p>

      <p style="font-size: 16px; color: #555555;">
        If you're ready to get started, click the button below to begin your journey!
      </p>

      <!-- Button -->
      <a href=[homepage_link] class="email-button">Start Exploring</a>

      <p style="font-size: 14px;">
        Need help or have questions? Our support team is here to assist you. Feel free to reach out!
      </p>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>Have a question? <a href="mailto:flyinnsafuh@gmail.com">Contact our support team</a>.</p>
      <p>Enjoy your experience with Flint AI!</p>
    </div>
  </div>
</body>
</html>
`;

const passwordResetEmailTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        /* General Reset */
        a {
  text-decoration: none; /* Removes underline */
  color: inherit; /* Inherits the color from the parent element */
  background: none; /* Removes any background styles */
  border: none; /* Removes any borders */
  outline: none; /* Removes focus outlines */
  cursor: pointer; /* Optional: ensures the pointer cursor appears */
}

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
            color: #333333;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .email-container {
            min-height: 85vh;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e1e4e8;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .email-header {
            text-align: center;
            padding: 20px;
            background-color: #1a73e8;
        }

        .email-header img {
            max-width: 150px;
        }

        /* Main Content */
        .email-content {
            padding: 20px;
            text-align: center;
        }

        .reset-message {
            margin: 20px auto;
            font-size: 20px;
            color: #1a73e8;
        }

        .email-button {
            display: inline-block;
            background-color: #1a73e8;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            font-size: 16px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .email-footer {
            background-color: #f9fafc;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }

        .email-footer a {
            color: #1a73e8;
            text-decoration: none;
        }

        /* Responsive Design */
        @media screen and (max-width: 768px) {
            .email-container {
                width: 95%;
            }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #121212;
                color: #e0e0e0;
            }

            .email-container {
                background-color: #1e1e1e;
                border: 1px solid #333333;
            }

            .email-header {
                background-color: #1a73e8;
            }

            .email-button {
                background-color: #1a73e8;
                color: #ffffff;
                cursor: pointer;
            }

            .email-footer {
                background-color: #292929;
                color: #aaaaaa;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <img src="cid:unique_inline_logo_cid" alt="Flint AI Logo">
            <h1 style="color: #FFFFFF; font-weight: bold;">Flint AI</h1>
        </div>

        <!-- Main Content -->
        <div class="email-content">
            <h1 style="color: #1a73e8;">Password Reset Request</h1>
            <p class="reset-message">
                Hi, [user_name]!</p>
            <p>
                We received a request to reset your password. Click the button below to reset your password and get back
                into your account.
            </p>

            <p style="font-size: 16px; color: #555555;">
                If you did not request a password reset, please ignore this email or contact support.
            </p>

            <!-- Button -->
            <a href=[reset_link] class="email-button">Reset Password</a>

            <p style="font-size: 14px;">
                If the button above doesn’t work, you can copy and paste the following link into your browser: <br>
                <[reset_link]>
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>Need help? <a href="mailto:flyinnsafuh@gmail.com">Contact our support team</a>.</p>
            <p>Stay safe and secure with Flint AI!</p>
        </div>
    </div>
</body>

</html>
`;

const accountDeleteEmailTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deletion Request</title>
    <style>
        /* General Reset */
        a {
  text-decoration: none; /* Removes underline */
  color: inherit; /* Inherits the color from the parent element */
  background: none; /* Removes any background styles */
  border: none; /* Removes any borders */
  outline: none; /* Removes focus outlines */
  cursor: pointer; /* Optional: ensures the pointer cursor appears */
}

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
            color: #333333;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .email-container {
            min-height: 85vh;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e1e4e8;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .email-header {
            text-align: center;
            padding: 20px;
            background-color: #1a73e8;
        }

        .email-header img {
            max-width: 150px;
        }

        /* Main Content */
        .email-content {
            padding: 20px;
            text-align: center;
        }

        .deletion-message {
            margin: 20px auto;
            font-size: 20px;
            color: #1a73e8;
        }

        .email-button {
            display: inline-block;
            background-color: #1a73e8;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            font-size: 16px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .email-footer {
            background-color: #f9fafc;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }

        .email-footer a {
            color: #1a73e8;
            text-decoration: none;
        }

        /* Responsive Design */
        @media screen and (max-width: 768px) {
            .email-container {
                width: 95%;
            }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #121212;
                color: #e0e0e0;
            }

            .email-container {
                background-color: #1e1e1e;
                border: 1px solid #333333;
            }

            .email-header {
                background-color: #1a73e8;
            }

            .email-button {
                background-color: #1a73e8;
                color: #ffffff;
                cursor: pointer;
            }

            .email-footer {
                background-color: #292929;
                color: #aaaaaa;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <img src="cid:unique_inline_logo_cid" alt="Flint AI Logo">
            <h1 style="color: #FFFFFF; font-weight: bold;">Flint AI</h1>
        </div>

        <!-- Main Content -->
        <div class="email-content">
            <h1 style="color: #d9534f;">Account Deletion Request</h1>
            <p class="deletion-message">
                Hi, [user_name]!</p>
            <p>
                We’ve received a request to delete your Flint AI account. If you didn’t make this request, or if you’ve
                changed your mind, you can cancel the process by clicking the button below.
            </p>

            <p style="font-size: 16px; color: #555555;">
                Please note, once your account is deleted, all your data will be permanently removed, and you will no
                longer have access to any of the services associated with it.
            </p>

            <!-- Button -->
            <a href=[cancel_deletion_link] class="email-button">Cancel Account Deletion</a>
            or
            <a href=[account_deletion_link] class="email-button" style="background-color: #d9534f;">Confirm Account
                Deletion</a>

            <p>
            If the buttons above don’t work, you can copy and paste the following link into your browser: <br> Cancel account deletion: [cancel_deletion_link] <br> Confirm account deletion: [account_deletion_link]
            </p>

            <p style="font-size: 14px;">
                If you want to proceed with the deletion, no further action is required. The process will be completed
                within 24 hours.
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>Need help or have questions? <a href="mailto:flyinnsafuh@gmail.com">Contact our support team</a>.</p>
            <p>We hope to see you again at Flint AI!</p>
        </div>
    </div>
</body>

</html>
`;

const accountLogoutEmailTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Logout Notification</title>
    <style>
        /* General Reset */
        a {
  text-decoration: none; /* Removes underline */
  color: inherit; /* Inherits the color from the parent element */
  background: none; /* Removes any background styles */
  border: none; /* Removes any borders */
  outline: none; /* Removes focus outlines */
  cursor: pointer; /* Optional: ensures the pointer cursor appears */
}

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
            color: #333333;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .email-container {
            min-height: 85vh;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e1e4e8;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .email-header {
            text-align: center;
            padding: 20px;
            background-color: #1a73e8;
        }

        .email-header img {
            max-width: 150px;
        }

        /* Main Content */
        .email-content {
            padding: 20px;
            text-align: center;
        }

        .logout-message {
            margin: 20px auto;
            font-size: 20px;
            color: #1a73e8;
        }

        .email-button {
            display: inline-block;
            background-color: #1a73e8;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            font-size: 16px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .email-footer {
            background-color: #f9fafc;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }

        .email-footer a {
            color: #1a73e8;
            text-decoration: none;
        }

        /* Responsive Design */
        @media screen and (max-width: 768px) {
            .email-container {
                width: 95%;
            }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #121212;
                color: #e0e0e0;
            }

            .email-container {
                background-color: #1e1e1e;
                border: 1px solid #333333;
            }

            .email-header {
                background-color: #1a73e8;
            }

            .email-button {
                background-color: #1a73e8;
                color: #ffffff;
                cursor: pointer;
            }

            .email-footer {
                background-color: #292929;
                color: #aaaaaa;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <img src="cid:unique_inline_logo_cid" alt="Flint AI Logo">
            <h1 style="color: #FFFFFF; font-weight: bold;">Flint AI</h1>
        </div>

        <!-- Main Content -->
        <div class="email-content">
            <h1 style="color: #1a73e8;">Logout Successful</h1>
            <p class="logout-message">
                Hi, [user_name]!
            </p>
            <p>
                We wanted to let you know that your account has been successfully logged out from all devices. If you
                initiated this action, there's nothing else to worry about.
            </p>
            <p>
                If you did not log out and believe this was unauthorized, please take immediate action by securing your
                account.
            </p>

            <!-- Button -->
            <a href=[account_security_link] class="email-button">Secure Your Account</a>

            <p style="font-size: 14px;">
                If you have any issues or concerns, feel free to contact our support team. We are here to help.
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>Need help or have questions? <a href="mailto:flyinnsafuh@gmail.com">Contact our support team</a>.</p>
            <p>We take your account security seriously and are here to assist you.</p>
        </div>
    </div>
</body>

</html>
`;

const accountNotificationTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activity Notification</title>
    <style>
        /* General Reset */
        a {
  text-decoration: none; /* Removes underline */
  color: inherit; /* Inherits the color from the parent element */
  background: none; /* Removes any background styles */
  border: none; /* Removes any borders */
  outline: none; /* Removes focus outlines */
  cursor: pointer; /* Optional: ensures the pointer cursor appears */
}

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
            color: #333333;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .email-container {
            min-height: 85vh;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e1e4e8;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .email-header {
            text-align: center;
            padding: 20px;
            background-color: #0073e6;
        }

        .email-header img {
            max-width: 150px;
        }

        /* Main Content */
        .email-content {
            padding: 20px;
            text-align: center;
        }

        .activity-message {
            margin: 20px auto;
            font-size: 20px;
            color: #0073e6;
        }

        .email-button {
            display: inline-block;
            background-color: #0073e6;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            font-size: 16px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .email-footer {
            background-color: #f9fafc;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }

        .email-footer a {
            color: #0073e6;
            text-decoration: none;
        }

        /* Responsive Design */
        @media screen and (max-width: 768px) {
            .email-container {
                width: 95%;
            }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #121212;
                color: #e0e0e0;
            }

            .email-container {
                background-color: #1e1e1e;
                border: 1px solid #333333;
            }

            .email-header {
                background-color: #1a73e8;
            }

            .email-button {
                background-color: #1a73e8;
                color: #ffffff;
                cursor: pointer;
            }

            .email-footer {
                background-color: #292929;
                color: #aaaaaa;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <img src="cid:unique_inline_logo_cid" alt="Flint AI Logo">
            <h1 style="color: #FFFFFF; font-weight: bold;">Flint AI</h1>
        </div>

        <!-- Main Content -->
        <div class="email-content">
            <h1 style="color: #0073e6;">Account Activity Notification</h1>
            <p class="activity-message">
                Hi, [user_name]!
            </p>
            <p>
                We noticed some activity in your account recently. Below are the details of the action:
            </p>

            <!-- Activity Details -->
            <p>
                <strong>Activity:</strong> [activity_description]<br>
                <strong>Time:</strong> [activity_time]<br>
                <strong>Author:</strong> [activity_author]<br>
            </p>

            <!-- Button -->
            <a href=[account_security_link] class="email-button">Review Account Activity</a>

            <p style="font-size: 14px;">
                If you did not perform this action, please review your account activity and secure your account by
                changing your password.
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>Need help or have questions? <a href="mailto:flyinnsafuh@gmail.com">Contact our support team</a>.</p>
            <p>Your security is our priority. We’re here to assist you with any concerns.</p>
        </div>
    </div>
</body>

</html>
`;
const adminNotificationTemplateForAccountDelete = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activity Notification</title>
    <style>
        /* General Reset */
        a {
  text-decoration: none; /* Removes underline */
  color: inherit; /* Inherits the color from the parent element */
  background: none; /* Removes any background styles */
  border: none; /* Removes any borders */
  outline: none; /* Removes focus outlines */
  cursor: pointer; /* Optional: ensures the pointer cursor appears */
}

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
            color: #333333;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .email-container {
            min-height: 85vh;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e1e4e8;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .email-header {
            text-align: center;
            padding: 20px;
            background-color: #0073e6;
        }

        .email-header img {
            max-width: 150px;
        }

        /* Main Content */
        .email-content {
            padding: 20px;
            text-align: center;
        }

        .activity-message {
            margin: 20px auto;
            font-size: 20px;
            color: #0073e6;
        }

        .email-button {
            display: inline-block;
            background-color: #0073e6;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            font-size: 16px;
            border-radius: 5px;
            margin: 20px 0;
        }

        .email-footer {
            background-color: #f9fafc;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: #666666;
        }

        .email-footer a {
            color: #0073e6;
            text-decoration: none;
        }

        /* Responsive Design */
        @media screen and (max-width: 768px) {
            .email-container {
                width: 95%;
            }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #121212;
                color: #e0e0e0;
            }

            .email-container {
                background-color: #1e1e1e;
                border: 1px solid #333333;
            }

            .email-header {
                background-color: #1a73e8;
            }

            .email-button {
                background-color: #1a73e8;
                color: #ffffff;
                cursor: pointer;
            }

            .email-footer {
                background-color: #292929;
                color: #aaaaaa;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <img src="cid:unique_inline_logo_cid" alt="Flint AI Logo">
            <h1 style="color: #FFFFFF; font-weight: bold;">Flint AI</h1>
        </div>

        <!-- Main Content -->
        <div class="email-content">
            <h1 style="color: #0073e6;">Account Activity Notification</h1>
            <p class="activity-message">
                Hi, [user_name]!
            </p>
            <p>
                A user deleted their account!!
            </p>

            <!-- Activity Details -->
            <p>
                <strong>Activity:</strong> [activity_description]<br>
                <strong>Reason:</strong> [account_delete_reason]<br>
                <strong>Time:</strong> [activity_time]<br>
                <strong>Author:</strong> [activity_author]<br>
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>Need help or have questions? <a href="mailto:flyinnsafuh@gmail.com">Contact our support team</a>.</p>
            <p>Your security is our priority. We’re here to assist you with any concerns.</p>
        </div>
    </div>
</body>

</html>
`;

export {
  verificationEmailTemplate,
  welcomeEmailTemplate,
  accountDeleteEmailTemplate,
  accountLogoutEmailTemplate,
  passwordResetEmailTemplate,
  accountNotificationTemplate,
  adminNotificationTemplateForAccountDelete,
};
