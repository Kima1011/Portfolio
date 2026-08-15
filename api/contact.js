const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Parse body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { name, email, phone, budget, service, message } = body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email, and message are required.' 
    });
  }

  const gmailUser = process.env.GMAIL_USER || 'kimfrozz96@gmail.com';
  // Use provided App Password (stripped of spaces) or environment variable
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'sjodyldbuojdsrxb').replace(/\s+/g, '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass
    }
  });

  const mailOptions = {
    from: `"Portfolio Inquiry" <${gmailUser}>`,
    to: 'kimfrozz96@gmail.com',
    replyTo: email,
    subject: `🚀 New Inquiry: ${service || 'General Project'} - from ${name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #080b12; color: #f8fafc; padding: 32px 24px; border-radius: 12px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">
          <h2 style="color: #38bdf8; margin: 0 0 6px 0; font-size: 24px;">New Client Inquiry</h2>
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">Received via your portfolio contact form</p>
        </div>

        <div style="background: #0f1523; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #334155;">
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 140px;"><strong>Client Name:</strong></td>
              <td style="padding: 8px 0; color: #f8fafc; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Email Address:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Phone / WhatsApp:</strong></td>
              <td style="padding: 8px 0; color: #f8fafc;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Service Required:</strong></td>
              <td style="padding: 8px 0;"><span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 4px 10px; border-radius: 4px; font-weight: 500;">${service || 'General'}</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Estimated Budget:</strong></td>
              <td style="padding: 8px 0; color: #10b981; font-weight: 600;">${budget || 'Not specified'}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 24px;">
          <h3 style="color: #f59e0b; margin: 0 0 10px 0; font-size: 16px;">Client Message & Scope Details:</h3>
          <div style="background: #111625; padding: 18px; border-radius: 8px; border-left: 4px solid #38bdf8; color: #e2e8f0; line-height: 1.7; font-size: 14px; white-space: pre-wrap;">${message}</div>
        </div>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center;">
          Sent directly to <strong>kimfrozz96@gmail.com</strong> from Lalfamkima Portfolio
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return res.status(200).json({ 
      success: true, 
      message: 'Inquiry notification sent to Kim successfully!' 
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Email service error', 
      error: error.message 
    });
  }
};
