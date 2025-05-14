import { StoreWithAdmin } from '@/interface/store/store.interface';
import { api } from '../api';

export const createStore = async (
  store: Omit<StoreWithAdmin, 'id'>,
  email: string,
): Promise<StoreWithAdmin> => {
  const response = await api('store/', 'POST', {
    body: { email, store },
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

  return response.data;
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

export const deleteStore = async (email: string, id: string) => {
  console.log('IN HANDLERS STORE FOR DELETE');
  const response = await api(`store/delete/${id}`, 'PATCH', {
    body: { email, id },
    contentType: 'application/json',
  });
  console.log('IN HANDLERS STORE FOR DELETE res', response);
  return response.data;
};
