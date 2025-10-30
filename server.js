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

  // Send email via Gmail (using App Password)
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS // Use App Password from Google Account settings
        }
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER, // Messages will be sent to your Gmail
        subject: `Portfolio Contact: ${name}`,
        text: `Message from your portfolio website:\n\nFrom: ${name} <${email}>\n\n${message}`,
        html: `
          <h3>New message from your portfolio website</h3>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr/>
          <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent to Gmail:', info.messageId);
      return res.json({ ok: true, info: 'Message sent successfully!' });
    } catch (err) {
      console.error('Failed to send via Gmail:', err);
      return res.status(500).json({ error: 'Could not send message. Please try again later.' });
    }
  }

  // Fallback: log the message and return success (no creds configured)
  console.log('Contact (logged):', { name, email, message });
  res.json({ ok: true, info: 'logged', note: 'No SMTP configured. See .env.example to enable sending.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
