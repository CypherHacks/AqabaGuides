// .netlify/functions/send-listing.js
require('dotenv').config()
const nodemailer = require('nodemailer')

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let data
  try {
    data = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { name, industry, contact, email, phone, message } = data
  if (!name || !industry || !contact || !email || !phone) {
    return { statusCode: 400, body: 'Missing required fields' }
  }

  // configure SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: true,       // true if port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  const mailOptions = {
    from: `"AqabaGuide" <${process.env.SMTP_USER}>`,
    to:   process.env.TO_EMAIL,
    subject: `New Listing Request: ${name}`,
    text: `
Business Name: ${name}
Industry: ${industry}
Contact Person: ${contact}
Email: ${email}
Phone: ${phone}
Message:
${message || '[none]'}
    `,
    html: `
      <h1>New Listing Request</h1>
      <p><strong>Business Name:</strong> ${name}</p>
      <p><strong>Industry:</strong> ${industry}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br/>${message || '—'}</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }
  } catch (err) {
    console.error('✉️ Mail error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    }
  }
}
