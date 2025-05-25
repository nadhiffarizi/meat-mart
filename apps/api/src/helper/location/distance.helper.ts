import ILocation from '@/interface/location.interface';
import prisma from '@/prisma';
import { headingDistanceTo } from 'geolocation-utils';

export const countDistance = (location1: ILocation, location2: ILocation) => {
  const dis = headingDistanceTo(
    {
      lat: Number(location1.lat),
      lon: Number(location1.lon),
    },
    {
      lat: Number(location2.lat),
      lon: Number(location2.lon),
    },
  );
  return dis['distance'];
};

export const xDistancePrisma = (loc1: ILocation) => {
  const distanceIncluded = prisma.$extends({
    result: {
      stores: {
        distance: {
          needs: { latitude: true, longitude: true },
          compute(stores) {
            // logic computation
            const loc2: ILocation = {
              lat: String(stores.latitude),
              lon: String(stores.longitude),
            };
            return countDistance(loc1, loc2);
          },
        },
      },
    },
  });

  return distanceIncluded;
};
