import { api } from '../api';
import { apiRequest } from '../api.helper';

export const getProducts = async (apiRoute: string) => {
  const response = await apiRequest(apiRoute, 'GET', undefined, {
    'Content-Type': 'application/json',
  });
  return response;
};

export const getProductBasedLoc = async (apiRoute: string) => {
  const response = await apiRequest(apiRoute, 'GET', undefined, {
    'Content-Type': 'application/json',
  });
  return response;
};

export const currencyFormatter = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
};
