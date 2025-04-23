require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 80881;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: 'cristian.diasdecastro@gmail.com',
    pass: 'hwkv zfmj hmzz uuii',
  },
});

// Email sending route
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, telefon, nachricht } = req.body;

    // Validate required fields
    if (!name || !email || !nachricht) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email und Nachricht sind erforderlich'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Ungültiges Email-Format'
      });
    }

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'info@ar-finanzberatung.de',
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        ${telefon ? `<p><strong>Telefon:</strong> ${telefon}</p>` : ''}
        <p><strong>Nachricht:</strong></p>
        <p>${nachricht.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        Neue Kontaktanfrage
        
        Name: ${name}
        E-Mail: ${email}
        ${telefon ? `Telefon: ${telefon}\n` : ''}
        Nachricht:
        ${nachricht}
      `,
    });

    return res.json({
      success: true,
      message: 'Email wurde erfolgreich gesendet'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: 'Fehler beim Senden der Email'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 