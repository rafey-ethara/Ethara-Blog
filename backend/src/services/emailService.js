const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailer = getTransporter();
    const info = await mailer.sendMail({
      from: `"Ethara Blog" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email send failed to ${to}: ${error.message}`);
    // Don't throw — email failure shouldn't break the API response
    return { success: false, error: error.message };
  }
};

// --- Email Templates ---

const sendContactNotificationToOwner = async ({ name, email, phone, subject, message, timestamp }) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `📬 New Contact: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #6366F1, #8B5CF6); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Message</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Ethara Blog</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 120px;"><strong>Name</strong></td><td style="padding: 8px 0; color: #111;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>Email</strong></td><td style="padding: 8px 0; color: #111;"><a href="mailto:${email}" style="color: #6366F1;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>Phone</strong></td><td style="padding: 8px 0; color: #111;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>Subject</strong></td><td style="padding: 8px 0; color: #111;">${subject}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>Submitted</strong></td><td style="padding: 8px 0; color: #111;">${new Date(timestamp).toLocaleString()}</td></tr>
          </table>
          ${message ? `
          <div style="margin-top: 16px; padding: 16px; background: #F3F4F6; border-radius: 6px; border-left: 4px solid #6366F1;">
            <p style="margin: 0; font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Message</p>
            <p style="margin: 0; color: #111; line-height: 1.6;">${message}</p>
          </div>` : ''}
          <p style="margin-top: 20px; color: #9CA3AF; font-size: 12px; text-align: center;">Reply directly to this email to respond to ${name}.</p>
        </div>
      </div>
    `,
  });
};

const sendSubscriberConfirmation = async ({ name, email }) => {
  return sendEmail({
    to: email,
    subject: '🎉 Welcome to Ethara Blog!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #6366F1, #8B5CF6); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome, ${name}! 🎉</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 16px;">You're now subscribed to Ethara Blog</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
            Thank you for subscribing! You'll receive our latest articles, insights, and stories directly in your inbox. We promise to only send you the good stuff.
          </p>
          <div style="display: inline-block; background: linear-gradient(135deg, #6366F1, #8B5CF6); padding: 12px 28px; border-radius: 50px;">
            <span style="color: white; font-size: 15px; font-weight: 600;">Stay curious. Stay inspired.</span>
          </div>
          <p style="margin-top: 32px; color: #9CA3AF; font-size: 12px;">If you didn't subscribe, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
};

const sendNewSubscriberNotificationToOwner = async ({ name, email }) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `🎊 New Subscriber: ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #10B981, #059669); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🎊 New Newsletter Subscriber!</h1>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="color: #374151;">A new subscriber just joined Ethara Blog:</p>
          <table style="width: 100%;">
            <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 80px;"><strong>Name</strong></td><td style="color: #111;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>Email</strong></td><td style="color: #111;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;"><strong>Time</strong></td><td style="color: #111;">${new Date().toLocaleString()}</td></tr>
          </table>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendContactNotificationToOwner,
  sendSubscriberConfirmation,
  sendNewSubscriberNotificationToOwner,
};
