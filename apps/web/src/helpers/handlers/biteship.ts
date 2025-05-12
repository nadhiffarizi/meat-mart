import axios from 'axios';

const BITESHIP_API_KEY = process.env.NEXT_PUBLIC_BITESHIP_API_KEY;
const BITESHIP_BASE_URL = process.env.NEXT_PUBLIC_BITESHIP_BASE_URL;

const biteshipClient = axios.create({
  baseURL: BITESHIP_BASE_URL,
  headers: {
    Authorization: BITESHIP_API_KEY,
    'Content-Type': 'application/json',
  },
});

interface ShippingCostParams {
  origin_latitude: string;
  origin_longitude: string;
  destination_latitude: string;
  destination_longitude: string;
  couriers: string;
  items: Array<{
    name: string;
    description: string;
    length: number;
    width: number;
    height: number;
    weight: number;
    value: number;
    quantity: number;
  }>;
}

export async function getShippingCost(params: ShippingCostParams) {
  try {
    const response = await biteshipClient.post('/rates/couriers', params);
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    throw error;
  }
}
