import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateAuthToken } from '../token';
import { ISocialUserData } from '@/interface/User.interface';

const prisma = new PrismaClient();

export const registerSocialUser = async (data: ISocialUserData) => {
  try {
    let user = await prisma.users.findFirst({
      where: {
        OR: [{ email: data.email }, { provider_id: data.provider_id }],
      },
    });

    if (!user) {
      const nameParts = data.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      console.log('NAMAKU DI GOOGLE', data.name);

      user = await prisma.users.create({
        data: {
          email: data.email,
          first_name: firstName,
          last_name: lastName,
          image_url: data.image,
          provider: data.provider,
          provider_id: data.provider_id || uuidv4(),
          is_verified: true,
          role: 'CUSTOMER',
          password: await hash(uuidv4(), 10),
        },
      });
    } else if (user.provider !== data.provider) {
      throw new Error('Email already registered with different provider');
    }

    // Generate tokens for the user
    const { access_token, refresh_token } = await generateAuthToken(user);

    return {
      id: user.id,
      email: user.email,
      access_token,
      refresh_token,
      first_name: user.first_name,
      last_name: user.last_name,
      image_url: user.image_url,
      role: user.role,
      is_verified: user.is_verified,
      provider: user.provider,
    };
  } catch (error) {
    console.error('Error in registerSocialUser:', error);
    throw error;
  }
};
