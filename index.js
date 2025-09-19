require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 8900;

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

const lemonTranspoter = nodemailer.createTransport({
  service: 'Gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: "lemonprojets@gmail.com",
    pass: "ppeo hpft mgoc gdtk",
  },
});

// Email sending route
app.post('/ar-finanzberatung', async (req, res) => {
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

app.post('/lemon-projects', async (req, res) => {
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
    await lemonTranspoter.sendMail({
      from: process.env.SMTP_USER,
      to: 'info@lemonprojects.de',
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
}
);

// Unreachable URLs notification endpoint
app.post('/notify-unreachable-urls', async (req, res) => {
  try {
    const { urls } = req.body;

    // Validate required fields
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'URLs array is required and must not be empty'
      });
    }

    // Validate that all URLs are strings
    const invalidUrls = urls.filter(url => typeof url !== 'string');
    if (invalidUrls.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'All URLs must be strings'
      });
    }

    const currentDate = new Date().toLocaleString('de-DE', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Create HTML formatted list
    const htmlUrlList = urls.map((url, index) => 
      `<li style="margin-bottom: 8px;"><a href="${url}" style="color: #e74c3c; text-decoration: none;">${url}</a></li>`
    ).join('');

    // Create plain text formatted list
    const textUrlList = urls.map((url, index) => `${index + 1}. ${url}`).join('\n');

    // Send email using lemonTransporter
    await lemonTranspoter.sendMail({
      from: 'lemonprojets@gmail.com',
      to: 'info@lemonprojects.de',
      subject: `🚨 Unerreichbare URLs erkannt - ${currentDate}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
            🚨 Unerreichbare URLs Warnung
          </h2>
          <p style="color: #555; font-size: 16px;">
            <strong>Datum:</strong> ${currentDate}
          </p>
          <p style="color: #555; font-size: 16px;">
            Die folgenden <strong>${urls.length}</strong> URL${urls.length === 1 ? '' : 's'} konnten nicht erreicht werden:
          </p>
          <div style="background-color: #f8f9fa; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0;">
            <ul style="margin: 0; padding-left: 20px;">
              ${htmlUrlList}
            </ul>
          </div>
          <p style="color: #777; font-size: 14px; margin-top: 30px;">
            Bitte überprüfen Sie diese URLs und ergreifen Sie bei Bedarf entsprechende Maßnahmen.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            Dies ist eine automatische Benachrichtigung von Ihrem Überwachungssystem.
          </p>
        </div>
      `,
      text: `
🚨 UNERREICHBARE URLs WARNUNG

Datum: ${currentDate}

Die folgenden ${urls.length} URL${urls.length === 1 ? '' : 's'} konnten nicht erreicht werden:

${textUrlList}

Bitte überprüfen Sie diese URLs und ergreifen Sie bei Bedarf entsprechende Maßnahmen.

---
Dies ist eine automatische Benachrichtigung von Ihrem Überwachungssystem.
      `,
    });

    return res.json({
      success: true,
      message: `Email notification sent successfully for ${urls.length} unreachable URL${urls.length === 1 ? '' : 's'}`,
      data: {
        urlCount: urls.length,
        sentAt: currentDate
      }
    });
  } catch (error) {
    console.error('Error sending unreachable URLs notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending email notification',
      error: error.message
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 