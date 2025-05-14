'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setPrimaryAddress,
} from '@/helper/auth/auth';
import { Alert, SelectChangeEvent, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Address } from '@/interface/user/address.interface';
import { useLocations } from '@/hooks/useLocations';
import AddressForm from './AddressForm';
import { DeleteConfirmationDialog } from './DeleteConfirm';

export default function AddressManager() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { provinces, cities, districts, setSelectedProvince, setSelectedCity } =
    useLocations();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({
    recipient_name: '',
    recipient_phone_number: '',
    address: '',
    province: '',
    city: '',
    district: '',
    postal_code: '',
    is_selected: false,
  });

  useEffect(() => {
    async function loadAddresses() {
      try {
        if (session) {
          const data = await getUserAddresses(session.user.email);
          setAddresses(data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load addresses',
        );
      } finally {
        setLoading(false);
      }
    }

    loadAddresses();
  }, [session]);

  const handleOpenAddDialog = () => {
    setCurrentAddress({
      recipient_name: '',
      recipient_phone_number: '',
      address: '',
      province: '',
      city: '',
      district: '',
      postal_code: '',
      is_selected: false,
    });
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (address: Address) => {
    setCurrentAddress(address);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentAddress.recipient_name)
      newErrors.recipient_name = 'Recipient name is required';
    if (!currentAddress.recipient_phone_number)
      newErrors.recipient_phone_number = 'Phone number is required';

    if (!currentAddress.address) newErrors.address = 'Address is required';
    if (!currentAddress.province_id)
      newErrors.province = 'Province is required';
    if (!currentAddress.city_id) newErrors.city = 'City is required';
    if (!currentAddress.district_id)
      newErrors.district = 'District is required';
    if (!currentAddress.postal_code)
      newErrors.postal_code = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!session?.user?.email) return;

      if (editMode) {
        const updatedAddress = await updateUserAddress(
          session.user.email,
          currentAddress.id!,
          currentAddress as Address,
        );
        setAddresses(
          addresses.map((addr) =>
            addr.id === currentAddress.id ? updatedAddress : addr,
          ),
        );
      } else {
        console.log('KETAMBAH di new address');
        const newAddress = await addUserAddress(
          session.user.email,
          currentAddress as Omit<Address, 'id'>,
        );
        setAddresses([...addresses, newAddress]);
        console.log('KETAMBAH', newAddress);
      }
      setOpenDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteClick = (id: string) => {
    if (!session?.user?.email) return;

    const addressToDelete = addresses.find((addr) => addr.id === id);

    if (addressToDelete?.is_selected) {
      setAlertMessage('Cannot delete selected address');
      setAlertOpen(true);
      return;
    }

    setAddressToDelete(id);
    setAlertMessage('Yakin hapus alamatmu?');
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete || !session?.user?.email) return;

    try {
      await deleteUserAddress(session.user.email, addressToDelete);
      const updatedAddresses = await getUserAddresses(session.user.email);
      setAddresses(updatedAddresses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete address');
    } finally {
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      if (!session?.user?.email) return;
      const updatedAddresses = await setPrimaryAddress(session.user.email, id);
      setAddresses(updatedAddresses);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to set primary address',
      );
    }
  };

  const handleLocationChange = (
    e: SelectChangeEvent<string>,
    type: 'province' | 'city' | 'district',
  ) => {
    const { value } = e.target;

    setCurrentAddress((prev) => {
      const updatedAddress = { ...prev };

      if (type === 'province') {
        const selectedProvince = provinces.find((p) => p.code === value);
        updatedAddress.province = selectedProvince?.name || '';
        updatedAddress.province_id = value;
        updatedAddress.city = '';
        updatedAddress.city_id = '';
        updatedAddress.district = '';
        updatedAddress.district_id = '';
        setSelectedProvince(value);
      } else if (type === 'city') {
        const selectedCity = cities.find((c) => c.code === value);
        updatedAddress.city = selectedCity?.name || '';
        updatedAddress.city_id = value;
        updatedAddress.district = '';
        updatedAddress.district_id = '';
        setSelectedCity(value);
      } else if (type === 'district') {
        const selectedDistrict = districts.find((d) => d.code === value);
        updatedAddress.district = selectedDistrict?.name || '';
        updatedAddress.district_id = value;
      }

      return updatedAddress;
    });
  };

  if (loading) {
    return (
      <div className="py-10 h-screen animate-pulse">
        <p className="mt-20 text-center">Loading addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 min-h-96">
        Gagal Memuat Alamat
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-96 font-inter">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Alamat</h2>
        <button
          onClick={handleOpenAddDialog}
          className="text-sm bg-orangeAccent text-white  py-2 px-4 rounded-full hover:bg-slate-500"
        >
          + Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 min-h-96">Anda belum memiliki alamat</p>
        </div>
      ) : (
        <div className="grid gap-4 text-sm">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 ${address.is_selected ? 'border-orangeAccent bg-orange-50' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    {address.is_selected ? (
                      <StarIcon className="text-orange-500 mr-2" />
                    ) : (
                      <StarBorderIcon className="text-gray-400 mr-2" />
                    )}
                    <h3 className="font-medium">{address.recipient_name}</h3>
                    {address.is_selected && (
                      <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                        Utama
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 tesxt-xs">
                    {address.recipient_phone_number}
                  </p>
                  <p className="text-gray-600">
                    {address.address}, {address.district}, {address.city},{' '}
                    {address.province} {address.postal_code}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEditDialog(address)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(address.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
              {!address.is_selected && (
                <div className="mt-4">
                  <button
                    onClick={() => handleSetPrimary(address.id)}
                    className="border border-orangeAccent px-3 py-2 text-xs rounded-full"
                  >
                    Jadikan Alamat Utama
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddressForm
        open={openDialog}
        editMode={editMode}
        currentAddress={currentAddress}
        provinces={provinces}
        cities={cities}
        districts={districts}
        isSubmitting={isSubmitting}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        onLocationChange={handleLocationChange}
      />
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          onClose={() => setAlertOpen(false)}
          sx={{ width: '100%', fontFamily: 'Inter, sans-serif' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
