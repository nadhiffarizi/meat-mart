import { statusEnum } from '@/enums/statusEnum.enums';
import { prisma } from '../config';
import { transporter } from './nodemailer';

export const getUserByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      is_verified: true,
      role: true,
    },
  });

  return user;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  // const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${encodeURIComponent(token)}`;
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: `MeatMart`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
        <div style="font-fam, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">MeatMart Email Verification</h2>
          <p>Please click the button below to verify your email address and input your password:</p>

          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; 
                    text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">
             Set Password and Verify Email
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">
            © ${new Date().getFullYear()} MeatMart. All rights reserved.
          </p>
        </div>
      `,
  });
};
