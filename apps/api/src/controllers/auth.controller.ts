import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import authService from '@/services/auth.service';
import { transporter } from '@/helpers/nodemailer';
import { statusEnum } from '@/enums/statusEnum.enums';

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: serviceFeedback = await authService.register(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      // try logging in
      const data: serviceFeedback = await authService.login(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data: serviceFeedback = await authService.getList(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data: serviceFeedback = await authService.refreshToken(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      if (!token) {
        return responseHandler(
          res,
          'Verification token is required',
          statusEnum.FAILED,
          null,
          400,
        );
      }

      const data = await authService.verifyEmailToken(token);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async resendVerification(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { email } = req.body;

      if (!email) {
        return responseHandler(
          res,
          'Email is required',
          statusEnum.FAILED,
          null,
          400,
        );
      }

      const data = await authService.resendVerificationEmail(email);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  // public async sendVerificationEmail(email: string, token: string) {
  //   const verificationUrl = `${process.env.BASE_URL}/auth/verify?token=${token}`;

  //   await transporter.sendMail({
  //     from: `MeatMart`,
  //     to: email,
  //     subject: 'Verify Your Email Address',
  //     html: `
  //       <div style="font-fam, sans-serif; max-width: 600px; margin: 0 auto;">
  //         <h2 style="color: #2563eb;">MeatMart Email Verification</h2>
  //         <p>Please click the button below to verify your email address:</p>
  //         <a href="${verificationUrl}"
  //            style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white;
  //                   text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">
  //            Verify Email
  //         </a>
  //         <p>This link will expire in 1 hour.</p>
  //         <p>If you didn't request this verification, please ignore this email.</p>
  //         <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
  //         <p style="font-size: 12px; color: #6b7280;">
  //           © ${new Date().getFullYear()} MeatMart. All rights reserved.
  //         </p>
  //       </div>
  //     `,
  //   });
  // }
}

export default new AuthController();
