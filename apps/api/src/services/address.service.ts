import { statusEnum } from '@/enums/statusEnum.enums';
import { getCoordinates } from '@/helper/geocode';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { Request } from 'express';

class AddressService {
  async getAddressByEmail(req: Request) {
    const { email } = req.query;
    console.log('INSIDE SERVICE', email);
    try {
      const user = await prisma.users.findUnique({
        where: { email: email as string },
        include: { UserAddresses: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        code: 200,
        data: user.UserAddresses,
        status: statusEnum.SUCCESS,
        message: 'Successfully fetch data user address',
      };
    } catch (error) {
      console.error('Fetching address error:', error);
      throw new Error('Error during fetching address');
    }
  }

  async selectedFirstAddress(req: Request) {
    const { address, email } = req.body;
    console.log('THE ADDRESS IN SERVICE', address);
    try {
      //verify the user exists
      const user = await prisma.users.findUnique({
        where: { email: email as string },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const fullAddress = `${address.address}, ${address.district}, ${address.city}, ${address.province}, ${address.postal_code}, Indonesia`;
      const coordinates = await getCoordinates(fullAddress);
      console.log('KOORDINAT DI CREATE ADDRESS', coordinates);

      if (!coordinates) {
        throw new Error('Could not geocode the provided address');
      }
      // count existing addresses
      const existingAddresses = await prisma.userAddresses.count({
        where: { user_id: user.id },
      });

      const newAddress = await prisma.userAddresses.create({
        data: {
          recipient_name: address.recipient_name,
          recipient_phone_number: address.recipient_phone_number,
          address: address.address,
          province: address.province,
          city: address.city,
          district: address.district,
          postal_code: address.postal_code,
          user_id: user.id,
          is_selected: existingAddresses === 0,
          latitude: coordinates.lat.toString(),
          longitude: coordinates.lng.toString(),
        },
      });
      console.log('LATLONG', newAddress);
      return {
        code: 200,
        data: newAddress,
        status: statusEnum.SUCCESS,
        message: 'Successfully add first address as selected address',
      };
    } catch (error) {
      console.error('Creating first address error:', error);
      throw new Error('Error during creating first address');
    }
  }

  async updateAddressById(req: Request) {
    const { id } = req.query;
    const { email, address } = req.body;

    try {
      const updatedAddress = await prisma.userAddresses.update({
        where: { id: address.id as string, users: { email: email } },
        data: {
          recipient_name: address.recipient_name,
          recipient_phone_number: address.recipient_phone_number,
          is_selected: address.is_selected,
          address: address.address,
          province: address.province,
          city: address.city,
          district: address.district,
          postal_code: address.postal_code,
          latitude: address.latitude,
          longitude: address.longitude,
        },
      });

      return {
        code: 200,
        data: updatedAddress,
        status: statusEnum.SUCCESS,
        message: 'Successfully update address',
      };
    } catch (error) {
      console.error('Updating address error:', error);
      throw new Error('Error during updating address');
    }
  }

  async deleteAddressById(req: Request) {
    const { id } = req.params;
    const { email } = req.body;
    console.log('DELETETHIS ID', id);
    console.log('DELETETHIS EMAIL', email);
    try {
      const user = await prisma.users.findUnique({
        where: { email: email as string },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const address = await prisma.userAddresses.findUnique({
        where: { id: id as string, user_id: user.id },
      });

      if (!address) {
        throw new Error('Address not found');
      }

      if (address?.is_selected) {
        return {
          code: 400,
          data: null,
          status: statusEnum.FAILED,
          message: 'Cannot delete primary address',
        };
      }

      await prisma.userAddresses.delete({
        where: { id },
      });

      const remainingAddresses = await prisma.userAddresses.findMany({
        where: { user_id: user.id },
      });

      return {
        code: 200,
        data: remainingAddresses,
        status: statusEnum.SUCCESS,
        message: 'Address deleted successfully',
      };
    } catch (error) {
      console.error('Deleting address error: ', error);
      throw new Error('Error during deleting address');
    }
  }

  async updateIsSelected(req: Request) {
    const { id } = req.params;
    const { email } = req.body;
    try {
      const user = await prisma.users.findUnique({
        where: { email: email as string },
      });

      if (!user) {
        throw new Error('User not found');
      }

      await prisma.userAddresses.updateMany({
        where: { user_id: user.id },
        data: { is_selected: false },
      });

      await prisma.userAddresses.update({
        where: { id: id as string, user_id: user.id as string },
        data: { is_selected: true },
      });

      const addresses = await prisma.userAddresses.findMany({
        where: { user_id: user.id as string },
      });

      return {
        code: 200,
        status: statusEnum.SUCCESS,
        data: addresses,
        message: 'Successfully change selected address',
      };
    } catch (error) {
      console.error('Updating selected address error: ', error);
      throw new Error('Error during updating selected address');
    }
  }
}

export default new AddressService();
