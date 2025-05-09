import axios from 'axios';

const RAJAONGKIR_API_KEY = 'R1tyi2Zy1d3822239e6d694dbnL25c9b';
const RAJAONGKIR_BASE_URL = 'https://api.rajaongkir.com/starter';

export async function calculateShippingCost(
  origin: string, // city ID
  destination: string, // city ID
  weight: number, // in grams
  courier: string, // 'jne', 'tiki', 'pos'
) {
  try {
    console.log('I am here in ts');
    const response = await axios.post(
      `${RAJAONGKIR_BASE_URL}/cost`,
      {
        origin,
        destination,
        weight,
        courier,
      },
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.rajaongkir.results[0].costs;
  } catch (error) {
    console.error('Error calculating shipping cost:', error);
    throw error;
  }
}

export async function getSupportedCouriers() {
  return [
    { code: 'jne', name: 'JNE' },
    { code: 'tiki', name: 'TIKI' },
    { code: 'pos', name: 'Pos Indonesia' },
  ];
}
