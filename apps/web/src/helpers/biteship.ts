import axios from 'axios';

const BITESHIP_API_KEY = process.env.NEXT_PUBLIC_BITESHIP_API_KEY;
const BITESHIP_BASE_URL = 'https://api.biteship.com/v1';

const biteshipClient = axios.create({
  baseURL: BITESHIP_BASE_URL,
  headers: {
    Authorization: BITESHIP_API_KEY,
    'Content-Type': 'application/json',
  },
});

export async function getProvinces() {
  try {
    const response = await biteshipClient.get('/maps/areas', {
      params: {
        countries: 'ID',
        type: 'single',
        area_level: 1,
      },
    });
    return response.data.areas;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw error;
  }
}

export async function getCities(provinceId: string) {
  try {
    const response = await biteshipClient.get('/maps/areas', {
      params: {
        countries: 'ID',
        type: 'single',
        area_level: 2,
        parent_id: provinceId,
      },
    });
    return response.data.areas;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}

export async function getDistricts(cityId: string) {
  try {
    const response = await biteshipClient.get('/maps/areas', {
      params: {
        countries: 'ID',
        type: 'single',
        area_level: 3,
        parent_id: cityId,
      },
    });
    return response.data.areas;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
}

export async function calculateShippingRates(params: {
  origin_area_id: string;
  destination_area_id: string;
  items: Array<{
    name: string;
    description: string;
    value: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    quantity: number;
  }>;
  couriers: string[];
}) {
  try {
    const response = await biteshipClient.post('/rates/couriers', params);
    return response.data.pricing;
  } catch (error) {
    console.error('Error calculating shipping rates:', error);
    throw error;
  }
}

export async function getAvailableCouriers() {
  try {
    const response = await biteshipClient.get('/couriers');
    return response.data.couriers;
  } catch (error) {
    console.error('Error fetching couriers:', error);
    throw error;
  }
}
