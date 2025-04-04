import nodemailer from 'nodemailer';
import { ContactMessage, NewsletterSubscriber } from '@shared/schema';

// Configure email transport
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password'
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
