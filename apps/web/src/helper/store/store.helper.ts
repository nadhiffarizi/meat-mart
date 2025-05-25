import { StoreWithAdmin } from '@/interface/store/store.interface';
import { apiRequest } from '../api.helper';
import { api } from '../api';

export const getStoreByAdmin = async (apiRouter: string, token: string) => {
  const response = await apiRequest(apiRouter, 'GET', undefined, {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  return response;
};

export const createStore = async (
  store: Omit<StoreWithAdmin, 'id'>,
  email: string,
): Promise<StoreWithAdmin> => {
  const response = await api('store/', 'POST', {
    body: { store, email },
    contentType: 'application/json',
  });

  return response.data;
};
export async function updateStore(
  email: string,
  id: string,
  store: StoreWithAdmin,
): Promise<StoreWithAdmin> {
  const response = await api(`store/${id}`, 'PATCH', {
    body: { email, store },
    contentType: 'application/json',
  });

  return response;
}

export const getListStore = async (email: string) => {
  const response = await api(`store/get?email=${email}`, 'GET', {
    contentType: 'application/json',
  });

  return response.data;
};

export const getStoreAdmin = async (email: string) => {
  const response = await api(`admin/get?email=${email}`, 'GET', {
    contentType: 'application/json',
  });

  return response.data;
};

export const deleteStoreById = async (email: string, id: string) => {
  console.log('IN HANDLERS STORE FOR DELETE');
  const response = await api(`store/delete/${id}`, 'PATCH', {
    body: { email, id },
    contentType: 'application/json',
  });
  console.log('IN HANDLERS STORE FOR DELETE res', response);
  return response;
};

export const getStoreById = async (email: string, id: string) => {
  const response = await api(`store/${id}`, 'POST', {
    body: { email, id },
    contentType: 'application/json',
  });
  return response;
};
