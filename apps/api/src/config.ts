import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'path';

export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// Load all environment variables from .env file

export const prisma = new PrismaClient();
export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const jwtAccessSecret = process.env.ACCESS_SECRET || '';
export const jwtRefreshSecret = process.env.REFRESH_SECRET || '';
export const node_account = {
  user: process.env.NODEMAILER_USER || '',
  pass: process.env.NODEMAILER_PASS || '',
};
export const opencage_apikey = process.env.OPENCAGE_API_KEY;
