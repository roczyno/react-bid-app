import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email transporter configuration error:', error);
  } else {
    logger.info('Email server is ready to send messages');
  }
});

export const sendVerificationEmail = async (email, token) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"CarDealer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address - CarDealer',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #57b3ac;">CarDealer</h1>
          </div>
          
          <h2 style="color: #333;">Welcome to CarDealer!</h2>
          
          <p>Thank you for registering with CarDealer. To complete your registration and start using our platform, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #57b3ac; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          
          <p>This verification link will expire in 24 hours.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="color: #666; font-size: 12px;">
            If you didn't create an account with CarDealer, please ignore this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Send verification email error:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"CarDealer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - CarDealer',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #57b3ac;">CarDealer</h1>
          </div>
          
          <h2 style="color: #333;">Password Reset Request</h2>
          
          <p>We received a request to reset your password for your CarDealer account. Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #57b3ac; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          
          <p>This password reset link will expire in 1 hour.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="color: #666; font-size: 12px;">
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Send password reset email error:', error);
    throw error;
  }
};

export const sendAuctionNotificationEmail = async (email, subject, message) => {
  try {
    const mailOptions = {
      from: `"CarDealer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${subject} - CarDealer`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #57b3ac;">CarDealer</h1>
          </div>
          
          <h2 style="color: #333;">${subject}</h2>
          
          <p>${message}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="background-color: #57b3ac; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit CarDealer</a>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="color: #666; font-size: 12px;">
            You're receiving this email because you have an active account with CarDealer.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Notification email sent to ${email}`);
  } catch (error) {
    logger.error('Send notification email error:', error);
    throw error;
  }
};