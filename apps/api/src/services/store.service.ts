import { statusEnum } from '@/enums/statusEnum.enums';
import { getCoordinates } from '@/helpers/geocode';
import { getSuperAdminByEmail } from '@/helpers/store.prisma';
import prisma from '@/prisma';
import { Request } from 'express';

class StoreService {
  async getList(req: Request) {
    const { email } = req.query;
    console.log('INSIDE SERVICE', email);
    try {
      const superAdmin = await getSuperAdminByEmail(email as string);
      if (!superAdmin) {
        throw new Error('Super Admin not found');
      }
      const countStore = await prisma.stores.count({});
      if (countStore === 0) {
        return {
          code: 200,
          data: countStore,
          status: statusEnum.SUCCESS,
          message: 'There is no store yet!',
        };
      } else {
        const stores = await prisma.stores.findMany({
          where: { deleted_at: null },
          include: {
            storeadmin: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
          },
          orderBy: { created_at: 'desc' },
        });

        return {
          code: 200,
          data: stores,
          status: statusEnum.SUCCESS,
          message: 'Successfully fetched all stores',
        };
      }
    } catch (error) {
      console.error('Fetching stores error:', error);
      throw new Error('Error during fetching stores');
    }
  }

  async createStore(req: Request) {
    const { store, email } = req.body;
    console.log('THE ADDRESS IN SERVICE', store);
    try {
      const superAdmin = await getSuperAdminByEmail(email);

      if (!superAdmin) {
        throw new Error('Super Admin not found');
      }

      const fullAddress = `${store.address}, ${store.district}, ${store.city}, ${store.province}, ${store.postal_code}, Indonesia`;
      const coordinates = await getCoordinates(fullAddress);

      if (!coordinates) {
        throw new Error('Could not geocode the provided address');
      }

      const newStore = await prisma.stores.create({
        data: {
          name: store.name,
          address: store.address,
          province: store.province,
          city: store.city,
          district: store.district,
          postal_code: store.postal_code,
          status: store.status,
          latitude: coordinates.lat.toString(),
          longitude: coordinates.lng.toString(),
          storeadmin: {
            connect: {
              id: '01e96061-0f7a-4820-93d0-af4597f8a137',
            },
          },
        },
        include: {
          storeadmin: true,
        },
      });
      console.log('LATLONG', newStore);
      return {
        code: 200,
        data: newStore,
        status: statusEnum.SUCCESS,
        message: 'Successfully add new store',
      };
    } catch (error) {
      console.error('Creating new store error:', error);
      throw new Error('Error during creating new store');
    }
  }

  async getStoreById(req: Request) {
    const { id } = req.params;
    console.log('INSIDE SERVICE', id);
    try {
      const store = await prisma.stores.findUnique({
        where: { id: id as string },
        include: {
          storeadmin: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      });
      if (!store) {
        throw new Error('Store not found');
      }
      return {
        code: 200,
        data: store,
        status: statusEnum.SUCCESS,
        message: 'Successfully fetch data store',
      };
    } catch (error) {
      console.error('Fetching store error:', error);
      throw new Error('Error during fetching data store');
    }
  }

  async updateStoreById(req: Request) {
    const { id } = req.params;
    const { email, store } = req.body;

    try {
      const superAdmin = await getSuperAdminByEmail(email);
      if (!superAdmin) {
        throw new Error('Super Admin not found');
      }

      const updatedStore = await prisma.stores.update({
        where: { id: id as string },
        data: store,
        include: {
          storeadmin: true,
        },
      });
      return {
        code: 200,
        data: updatedStore,
        status: statusEnum.SUCCESS,
        message: 'Successfully update address',
      };
    } catch (error) {
      console.error('Updating address error:', error);
      throw new Error('Error during updating address');
    }
  }
  async deleteStoreById(req: Request) {
    const { id } = req.params;
    const { email } = req.body;
    console.log('DELETE SERVICE', id, email);
    const superAdmin = await getSuperAdminByEmail(email);
    if (!superAdmin)
      return {
        code: 401,
        data: null,
        status: statusEnum.FAILED,
        message: 'Super Admin not found',
      };
    console.log('DELETE SERVICE', id, email);
    const deletedstore = await prisma.stores.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    console.log('YANG KEHAPUS', deletedstore);

    const remainingStores = await prisma.stores.findMany({
      where: { deleted_at: null },
      include: {
        storeadmin: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
    return {
      code: 200,
      data: remainingStores,
      status: statusEnum.SUCCESS,
      message: 'successfull delete store',
    };
  }
}

export default new StoreService();
