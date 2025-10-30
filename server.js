// Simple Express backend for portfolio
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (your existing frontend)
app.use(express.static(path.join(__dirname)));

// GET /api/projects -> returns data.json contents
app.get('/api/projects', async (req, res) => {
  try {
    const raw = await fs.promises.readFile(path.join(__dirname, 'data.json'), 'utf8');
    const projects = JSON.parse(raw);
    res.json(projects);
  } catch (err) {
    console.error('Failed to read data.json', err);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// POST /api/contact -> accepts { name, email, message }
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing name, email or message' });
  }

  // If SMTP env vars are provided, attempt to send email via Nodemailer
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: process.env.EMAIL_TO || process.env.SMTP_USER,
        subject: `Portfolio contact from ${name}`,
        text: `${message}\n\nFrom: ${name} <${email}>`,
        html: `<p>${message.replace(/\n/g, '<br/>')}</p><hr/><p>From: ${name} &lt;${email}&gt;</p>`
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent', info && info.messageId);
      return res.json({ ok: true, info: 'sent' });
    } catch (err) {
      console.error('Failed to send email', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  }

  // Fallback: log the message and return success (no creds configured)
  console.log('Contact (logged):', { name, email, message });
  res.json({ ok: true, info: 'logged', note: 'No SMTP configured. See .env.example to enable sending.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
