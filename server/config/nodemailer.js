import nodemailer from 'nodemailer';
import logger from './winston.js';

let transporter;

const createTransporter = async () => {
  if (transporter) return transporter;

  const hasSMTPConfig =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (hasSMTPConfig) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    logger.info('SMTP transporter configured with environment variables.');
  } else {
    // Generate Ethereal testing account as fallback
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.warn(
        `SMTP credentials not configured. Using Ethereal test account: ${testAccount.user}. View emails at https://ethereal.email`
      );
    } catch (err) {
      logger.error(`Failed to create Ethereal test mail account: ${err.message}. Email alerts will run in Console Log Mode.`);
      // Mock transporter that logs to Winston
      transporter = {
        sendMail: async (mailOptions) => {
          logger.info(
            `[MOCK EMAIL SENT] To: ${mailOptions.to} | Subject: ${mailOptions.subject}\nBody: ${mailOptions.text}`
          );
          return { messageId: 'mock-id-12345' };
        },
      };
    }
  }
  return transporter;
};

export const sendContactEmail = async (action, contact, userEmail) => {
  try {
    const client = await createTransporter();
    const fromAddress = process.env.SMTP_FROM || 'noreply@enclaveportal.com';
    const contactName = `${contact.firstName} ${contact.lastName}`;

    let subject = '';
    let text = '';
    let html = '';

    const actionsMap = {
      create: {
        subject: `Enclave Portal: New Contact Created - ${contactName}`,
        text: `Hello,\n\nA new contact has been created in your Enclave Portal account:\nName: ${contactName}\nEmail: ${contact.email || 'N/A'}\nPhone: ${contact.phone || 'N/A'}\nCompany: ${contact.company || 'N/A'}\n\nBest regards,\nEnclave Portal Team`,
        html: `<h3>Hello,</h3><p>A new contact has been created in your Enclave Portal account:</p><ul><li><strong>Name:</strong> ${contactName}</li><li><strong>Email:</strong> ${contact.email || 'N/A'}</li><li><strong>Phone:</strong> ${contact.phone || 'N/A'}</li><li><strong>Company:</strong> ${contact.company || 'N/A'}</li></ul><p>Best regards,<br/>Enclave Portal Team</p>`,
      },
      update: {
        subject: `Enclave Portal: Contact Updated - ${contactName}`,
        text: `Hello,\n\nA contact has been updated in your Enclave Portal account:\nName: ${contactName}\nEmail: ${contact.email || 'N/A'}\nPhone: ${contact.phone || 'N/A'}\nCompany: ${contact.company || 'N/A'}\n\nBest regards,\nEnclave Portal Team`,
        html: `<h3>Hello,</h3><p>A contact has been updated in your Enclave Portal account:</p><ul><li><strong>Name:</strong> ${contactName}</li><li><strong>Email:</strong> ${contact.email || 'N/A'}</li><li><strong>Phone:</strong> ${contact.phone || 'N/A'}</li><li><strong>Company:</strong> ${contact.company || 'N/A'}</li></ul><p>Best regards,<br/>Enclave Portal Team</p>`,
      },
      delete: {
        subject: `Enclave Portal: Contact Deleted - ${contactName}`,
        text: `Hello,\n\nA contact has been deleted from your Enclave Portal account:\nName: ${contactName}\nEmail: ${contact.email || 'N/A'}\n\nBest regards,\nEnclave Portal Team`,
        html: `<h3>Hello,</h3><p>A contact has been deleted from your Enclave Portal account:</p><ul><li><strong>Name:</strong> ${contactName}</li><li><strong>Email:</strong> ${contact.email || 'N/A'}</li></ul><p>Best regards,<br/>Enclave Portal Team</p>`,
      },
    };

    const details = actionsMap[action] || {
      subject: `Enclave Portal Notice`,
      text: `Hello,\n\nAction ${action} took place on contact ${contactName}.\n\nBest regards,\nEnclave Portal Team`,
      html: `<h3>Hello,</h3><p>Action ${action} took place on contact ${contactName}.</p>`,
    };

    const mailOptions = {
      from: `"Enclave Portal" <${fromAddress}>`,
      to: userEmail,
      subject: details.subject,
      text: details.text,
      html: details.html,
    };

    const info = await client.sendMail(mailOptions);
    logger.info(`Notification email sent: ${info.messageId} (Action: ${action}, Contact: ${contactName})`);

    // Log URL for ethereal testing account
    if (info && info.messageId && !process.env.SMTP_HOST) {
      const nodemailerUrl = nodemailer.getTestMessageUrl(info);
      if (nodemailerUrl) {
        logger.info(`Test Email preview URL: ${nodemailerUrl}`);
      }
    }
    return info;
  } catch (error) {
    logger.error(`Nodemailer failure: ${error.message}`);
  }
};
