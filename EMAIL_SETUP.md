# 📧 Email Verification Setup Guide

To enable the email OTP verification feature, you need to configure a Gmail account to send emails.

## 1. Get a Gmail App Password (Free)

Since standard Gmail passwords don't work with automated apps anymore, you need an **App Password**.

1.  Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2.  Enable **2-Step Verification** if it's not already on.
3.  Search for **"App passwords"** in the search bar at the top (or look under 2-Step Verification settings).
4.  Create a new App Password:
    *   **App name**: `Buztle`
    *   Click **Create**.
5.  Copy the 16-character password generated (e.g., `abcd efgh ijkl mnop`).

## 2. Update Server Environment Variables

1.  Open `server/.env`.
2.  Add the following lines:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

*(Replace with your actual email and the app password you just generated)*

## 3. Restart the Server

After saving the `.env` file, restart your backend server for changes to take effect.

```bash
cd server
npm start
```

## 4. Test It!

1.  Go to the Registration page.
2.  Sign up with a valid email.
3.  You should receive an OTP email immediately.
4.  Enter the OTP to verify and login.
