import { Province } from '@/interfaces/card.interface';
import { api } from './handlers/api';

const BASE_URL = process.env.RAJAONGKIR_BASE_URL || 'http://localhost:3000';
export async function getProvinces() {
  try {
    const response = await fetch('/api/provinces');
    if (!response.ok) throw new Error('Failed to fetch provinces');
    const data = await response.json();
    console.log('DATA', data.data);
    return data.data;
  } catch (error) {
    console.error('Province fetch error:', error);
    throw error;
  }
}

export async function getCities(provinceCode: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/cities/${provinceCode}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    throw error;
  }
}

export async function getDistricts(regencyCode: string) {
  try {
    console.log('MASUK KECEMATAN ', regencyCode);
    const response = await fetch(`/api/districts/${regencyCode}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('REGENCIES', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    throw error;
  }
}
