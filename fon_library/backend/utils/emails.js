import dotenv from 'dotenv';
import { MailGenerator, transporter } from './mailer.js';

dotenv.config();

export const sendVerificationMail = async (name, email, verificationCode) => {
  let mail = {
    body: {
      name,
      intro: `Welcome to Fon Library! Your account verification code is: ${verificationCode}`,
      action: {
        instructions: 'To verify your account please click here:',
        button: {
          color: '#22BC66',
          text: 'Verify Account',
          link: `${process.env.CLIENT_URL}/verify-email/${email}`,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  let emailBody = MailGenerator.generate(mail);
  let message = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: 'Welcome to Fon Library',
    html: emailBody,
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong while sending an email verification');
  }
};

export const sendWelcomeEmail = async (email, name) => {
  let mail = {
    body: {
      name,
      intro:
        'Welcome to Fon Library! Your account has been verified, you can log in now.',
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  let emailBody = MailGenerator.generate(mail);
  let message = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: 'Account verified',
    html: emailBody,
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong while sending an welcome email');
  }
};

export const sendForgotPasswordMail = async (email, name, url) => {
  let mail = {
    body: {
      name,
      intro:
        'You have received this email because a password reset request for your account was received.',
      action: {
        instructions:
          'To provide new password for your account, please click here:',
        button: {
          color: '#22BC66',
          text: 'Reset Password',
          link: url,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  let emailBody = MailGenerator.generate(mail);
  let message = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: 'Forgot Password?',
    html: emailBody,
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong while sending forgot password mail');
  }
};

export const sendResetSuccessEmail = async (email, name) => {
  let mail = {
    body: {
      name,
      intro: 'Your password has been changed successfully!',
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  let emailBody = MailGenerator.generate(mail);
  let message = {
    from: process.env.GMAIL_EMAIL,
    to: email,
    subject: 'Password Changed',
    html: emailBody,
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong while sending forgot password mail');
  }
};
