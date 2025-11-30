const nodemailer = require('nodemailer');

// Initialize email transporter (uses environment variables or mocks for testing)
export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || 'test',
    pass: process.env.SMTP_PASSWORD || 'test'
  }
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@ticketing-system.com',
      to,
      subject,
      text,
      html: html || text
    });
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    throw new Error(`Email send failed: ${err.message}`);
  }
};

export const sendBulkEmail = async (recipients: string[], subject: string, text: string, html?: string) => {
  const results = [];
  for (const email of recipients) {
    try {
      const result = await sendEmail(email, subject, text, html);
      results.push({ email, ...result });
    } catch (err: any) {
      results.push({ email, success: false, error: err.message });
    }
  }
  return results;
};
