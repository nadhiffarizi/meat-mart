import { apiRequest } from '../api.helper';

export const getCustomer = async (apiRoute: string) => {
  const res = await apiRequest(apiRoute, 'GET');
  return res;
};

export const profileSideMenu = [
  { id: '1', name: 'Profil', slug: './profile' },
  { id: '2', name: 'Alamat', slug: 'address' },
  //   { id: '3', name: 'Pesanan Saya', slug: 'order-list' },
  //   { id: '4', name: 'Transaksi', slug: 'transaction-list' },
  { id: '3', name: 'Pesanan Saya', slug: 'order-list' },
  { id: '4', name: 'Transaksi', slug: 'transaction-list' },
  { id: '5', name: 'Voucher Saya', slug: 'specialty-items' },
];
