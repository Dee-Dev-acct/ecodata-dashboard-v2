import nodemailer from 'nodemailer';
import { ContactMessage, NewsletterSubscriber } from '@shared/schema';

// Configure email transport with correct environment variable names
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.office365.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password'
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false // ONLY FOR DEVELOPMENT - Remove this in production
  }
});

// Verify connection
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transport.verify();
    return true;
  } catch (error) {
    console.error('Email service connection error:', error);
    return false;
  }
}

// Send contact form notification to admins
export async function sendContactNotification(message: ContactMessage): Promise<boolean> {
  try {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@ecodatacic.org'];
    
    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@ecodatacic.org',
      to: adminEmails.join(','),
      subject: `New Contact Form Submission: ${message.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong></p>
        <div>${message.message}</div>
        <hr />
        <p>Received on: ${message.createdAt?.toLocaleString()}</p>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send contact notification:', error);
    return false;
  }
}

// Send confirmation to the person who submitted the contact form
export async function sendContactConfirmation(message: ContactMessage): Promise<boolean> {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@ecodatacic.org',
      to: message.email,
      subject: 'Thank you for contacting ECODATA CIC',
      html: `
        <h1>Thank You for Contacting Us</h1>
        <p>Dear ${message.name},</p>
        <p>Thank you for reaching out to ECODATA CIC. We have received your message and will get back to you as soon as possible.</p>
        <p>For your reference, here's a copy of your message:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Subject:</strong> ${message.subject}</p>
          <p><strong>Message:</strong></p>
          <div>${message.message}</div>
        </div>
        <p>Best regards,<br>The ECODATA CIC Team</p>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send contact confirmation:', error);
    return false;
  }
}

// Send newsletter confirmation email
export async function sendNewsletterConfirmation(subscriber: NewsletterSubscriber): Promise<boolean> {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@ecodatacic.org',
      to: subscriber.email,
      subject: 'Welcome to ECODATA CIC Newsletter',
      html: `
        <h1>Welcome to Our Newsletter!</h1>
        <p>Thank you for subscribing to the ECODATA CIC newsletter. You'll now receive updates on our latest projects, research insights, and environmental data trends.</p>
        <p>We're committed to providing valuable content and won't spam your inbox.</p>
        <p>If you ever wish to unsubscribe, you can click the unsubscribe link in any of our emails.</p>
        <p>Best regards,<br>The ECODATA CIC Team</p>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send newsletter confirmation:', error);
    return false;
  }
}

// Send admin notification about new newsletter subscriber
export async function sendNewSubscriberNotification(subscriber: NewsletterSubscriber): Promise<boolean> {
  try {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@ecodatacic.org'];
    
    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@ecodatacic.org',
      to: adminEmails.join(','),
      subject: 'New Newsletter Subscriber',
      html: `
        <h1>New Newsletter Subscriber</h1>
        <p>A new user has subscribed to the ECODATA CIC newsletter:</p>
        <p><strong>Email:</strong> ${subscriber.email}</p>
        <p><strong>Date:</strong> ${subscriber.createdAt?.toLocaleString()}</p>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send new subscriber notification:', error);
    return false;
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string, username?: string): Promise<boolean> {
  try {
    // Get the base URL from environment or default to localhost
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    const resetUrl = `${baseUrl}/password-recovery?token=${token}`;
    
    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@ecodatacic.org',
      to: email,
      subject: 'ECODATA CIC - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3E6259; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">ECODATA CIC</h1>
            <p style="margin-top: 5px;">Password Reset</p>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${username || 'User'},</p>
            <p>We received a request to reset your password for your ECODATA CIC account. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click on the button below:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetUrl}" style="background-color: #3E6259; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
            <p style="margin-bottom: 5px;">Or copy and paste this URL into your browser:</p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 14px;">${resetUrl}</p>
            <p>The link will expire in 30 minutes for security reasons.</p>
            <p>If you continue to have issues, please contact our support team.</p>
            <p>Best regards,<br>The ECODATA CIC Team</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© 2025 ECODATA CIC. All rights reserved.</p>
            <p>This email was sent to ${email} because you requested a password reset.</p>
          </div>
        </div>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

// Send password change confirmation email
export async function sendPasswordChangeConfirmation(email: string, username?: string): Promise<boolean> {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@ecodatacic.org',
      to: email,
      subject: 'ECODATA CIC - Password Successfully Changed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #3E6259; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">ECODATA CIC</h1>
            <p style="margin-top: 5px;">Password Changed</p>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Dear ${username || 'User'},</p>
            <p>This email confirms that your password for your ECODATA CIC account has been successfully changed.</p>
            <p>If you did not authorize this change, please contact our support team immediately.</p>
            <p>Best regards,<br>The ECODATA CIC Team</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© 2025 ECODATA CIC. All rights reserved.</p>
            <p>This email was sent to ${email} to confirm your password change.</p>
          </div>
        </div>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send password change confirmation:', error);
    return false;
  }
}
