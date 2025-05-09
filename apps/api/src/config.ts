import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
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
export const jwtAccessSecret = process.env.ACCESS_SECRET || ""
export const jwtRefreshSecret = process.env.REFRESH_SECRET || ""
export const cloudinary_config = process.env.CLOUDINARY_URL || ""
export const node_account = {
  user: process.env.NODEMAILER_USER || '',
  pass: process.env.NODEMAILER_PASS || '',
};
export const supabase = createClient(process.env.SUPABASE_PROJECT!, process.env.SUPABASE_ANONKEY!)
export const midtransServerKey = process.env.MIDTRANS_SERVER_KEY || ''
export const xenditSecretKey = process.env.XENDIT_SECRET_KEY || ''