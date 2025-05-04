'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setPrimaryAddress,
} from '@/helpers/handlers/auth';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Address } from '@/interfaces/card.interface';
import { useLocations } from '@/hooks/useLocations';

export default function AddressManager() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState('');
  const {
    provinces,
    cities,
    districts,
    loadingTime,
    errorMessage,
    setSelectedProvince,
    setSelectedCity,
    selectedProvince,
    selectedCity,
  } = useLocations();
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
  console.log('CURRENT', currentAddress);
  useEffect(() => {
    async function loadAddresses() {
      try {
        if (session) {
          console.log('Fetching addresses for:', session.user.email);
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

  const handleSubmit = async () => {
    try {
      if (!session?.user?.email) return;

      if (editMode) {
        console.log('HALO UPDATE DULU NIH', currentAddress);
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
        const newAddress = await addUserAddress(
          session.user.email,
          currentAddress as Omit<Address, 'id'>,
        );
        console.log('HALO ADD DULU NIH');
        setAddresses([...addresses, newAddress]);
      }
      setOpenDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!session?.user?.email) return;
      const addressToDelete = addresses.find((addr) => addr.id === id);
      if (addressToDelete?.is_selected) {
        setAlertMessage('Cannot delete selected address');
        setAlertOpen(true);
        return;
      }

      setAddresses((prev) => prev.filter((addr) => addr.id !== id));

      await deleteUserAddress(session.user.email, id);

      const updatedAddresses = await getUserAddresses(session.user.email);

      setAddresses(updatedAddresses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete address');
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
      <div className=" py-10 h-screen animate-pulse">
        <p className="mt-20 text-center">Loading addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 min-h-96">
        {'Gagal Memuat Alamat'}
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-96">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Alamat</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddDialog}
          sx={{
            backgroundColor: '#013028',
            '&:hover': {
              backgroundColor: '#fb7011',
            },
          }}
        >
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 min-h-96">Anda belum memiliki alamat</p>
        </div>
      ) : (
        <div className="grid gap-4 ">
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
                  <p className="text-gray-600">
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
                    onClick={() => handleDelete(address.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
              {!address.is_selected && (
                <div className="mt-4">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSetPrimary(address.id)}
                    sx={{
                      color: '#000',
                      borderColor: '#fb7011',
                      '&:hover': {
                        backgroundColor: '#fb7011',
                      },
                    }}
                  >
                    Jadikan Alamat Utama
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editMode ? 'Edit Alamat' : 'Tambah Alamat Baru'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Nama Penerima"
              name="recipient_name"
              value={currentAddress.recipient_name}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Nomor Telepon"
              name="recipient_phone_number"
              value={currentAddress.recipient_phone_number}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Alamat Lengkap"
              name="address"
              value={currentAddress.address}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth>
                <InputLabel>Provinsi</InputLabel>
                <Select
                  value={currentAddress.province_id || ''}
                  label="Provinsi"
                  onChange={(e) => handleLocationChange(e, 'province')}
                  //disabled={loading.province}
                >
                  {provinces.map((province) => (
                    <MenuItem key={province.code} value={province.code}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                //  disabled={!currentAddress.province_id || loading.cities}
              >
                <InputLabel>Kota/Kabupaten</InputLabel>
                <Select
                  value={currentAddress.city_id || ''}
                  label="Kota/Kabupaten"
                  onChange={(e) => handleLocationChange(e, 'city')}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.code} value={city.code}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormControl
                fullWidth
                //disabled={!currentAddress.city_id || loading.districts}
              >
                <InputLabel>Kecamatan</InputLabel>
                <Select
                  value={currentAddress.district_id || ''}
                  label="Kecamatan"
                  onChange={(e) => handleLocationChange(e, 'district')}
                >
                  {districts.map((district) => (
                    <MenuItem key={district.code} value={district.code}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Kode Pos"
                name="postal_code"
                value={currentAddress.postal_code}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              color: '#000',
              borderColor: '#013028',
              '&:hover': {
                backgroundColor: '#FFF3E0',
                borderColor: '#fb7011',
              },
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            className="bg-primaryGreen rounded-md"
            variant="contained"
            sx={{
              backgroundColor: '#013028',
              '&:hover': {
                backgroundColor: '#fb7011',
              },
            }}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          onClose={() => setAlertOpen(false)}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
