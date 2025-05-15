// import { useState } from 'react';
// import {
//   calculateShippingCost,
//   getSupportedCouriers,
// } from '@/helpers/shipping';

// export function useShipping() {
//   const [shippingOptions, setShippingOptions] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const calculateShipping = async (
//     originCityId: string,
//     destinationCityId: string,
//     weight: number,
//   ) => {
//     setIsLoading(true);
//     setError(null);
//     console.log('I am here');
//     try {
//       const couriers = await getSupportedCouriers();
//       const allOptions = [];

//       for (const courier of couriers) {
//         const options = await calculateShippingCost(
//           originCityId,
//           destinationCityId,
//           weight,
//           courier.code,
//         );
//         allOptions.push({
//           courier: courier.name,
//           services: options,
//         });
//       }

//       setShippingOptions(allOptions);
//       console.log('Shipping option==================', shippingOptions);
//     } catch (err) {
//       setError('Failed to calculate shipping costs');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     shippingOptions,
//     isLoading,
//     error,
//     calculateShipping,
//   };
// }
