import { statusEnum } from '@/enums/statusEnum.enums';
import { returnServiceFeedback } from '@/helper/responseHandler.helper';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { E_Role } from '@prisma/client';
import { Request } from 'express';

class UserService {
  async getCustomer(req: Request) {
    try {
      const user = await prisma.users.findFirst({
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          UserAddresses: {
            where: {
              is_selected: true,
              recipient_name: 'Nadhif',
            },
          },
        },
        where: {
          role: E_Role.CUSTOMER,
        },
      });

      return returnServiceFeedback(
        200,
        user,
        statusEnum.SUCCESS,
        'get customer data success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get customer data failed',
      );
    }
  }
}

export default new UserService();
