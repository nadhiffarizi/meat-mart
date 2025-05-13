import { apiRequest } from '../api.helper';

export const getCustomer = async (apiRoute: string) => {
  const res = await apiRequest(apiRoute, 'GET');
  return res;
};
