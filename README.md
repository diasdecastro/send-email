# Email Sending Application

A simple Express.js application that sends emails using nodemailer.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your email credentials:
```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

Note: For Gmail, you'll need to use an App Password instead of your regular password. You can generate one in your Google Account settings under Security > 2-Step Verification > App passwords.

## Running the Application

Start the server:
```bash
node index.js
```

The server will run on port 3000 by default.

## API Endpoint

### Send Email
- **URL**: `/send-email`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "telefon": "1234567890", // optional
  "nachricht": "Your message here"
}
```

### Response
Success:
```json
{
  "success": true,
  "message": "Email wurde erfolgreich gesendet"
}
```

Error:
```json
{
  "success": false,
  "message": "Error message here"
}
``` 