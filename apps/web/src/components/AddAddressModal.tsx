import { addUserAddress, setPrimaryAddress } from '@/helper/auth/auth';
import { useLocations } from '@/hooks/useLocations';
import { Address } from '@/interface/user/address.interface';
import {
  Modal,
  Box,
  TextField,
  Typography,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: any) => void;
  user: string;
}

export default function AddAddressModal({
  open,
  onClose,
  onSave,
  user,
}: AddAddressModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [addAddress, setAddAddress] = useState<Address[]>([]);
  const { provinces, cities, districts, setSelectedProvince, setSelectedCity } =
    useLocations();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<Address>>({
    recipient_name: '',
    recipient_phone_number: '',
    address: '',
    province: '',
    city: '',
    district: '',
    postal_code: '',
    is_selected: false,
  });
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipient_name)
      newErrors.recipient_name = 'Recipient name is required';
    if (!formData.recipient_phone_number)
      newErrors.recipient_phone_number = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.province_id) newErrors.province = 'Province is required';
    if (!formData.city_id) newErrors.city = 'City is required';
    if (!formData.district_id) newErrors.district = 'District is required';
    if (!formData.postal_code)
      newErrors.postal_code = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!user) return;

      const newAddress = await addUserAddress(
        user,
        formData as Omit<Address, 'id'>,
      );
      const updatedAddresses = await setPrimaryAddress(user, newAddress.id);
      onSave(updatedAddresses);
      //   setAddAddress([newAddress]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };
  const handleLocationChange = (
    e: SelectChangeEvent<string>,
    type: 'province' | 'city' | 'district',
  ) => {
    const { value } = e.target;

    setFormData((prev) => {
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
  {
    error && (
      <Typography color="error" variant="body2">
        {error}
      </Typography>
    );
  }

  {
    Object.entries(errors).map(([field, message]) => (
      <Typography key={field} color="error" variant="body2">
        {message}
      </Typography>
    ));
  }
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,

          fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
        }}
      >
        <h2 className="mt-2 ml-2 font-semibold text-xl">Add New Address</h2>
        {/* <Typography variant="h6" mb={2}>
          Add New Address
        </Typography> */}

        <TextField
          fullWidth
          label="Nama Penerima"
          name="recipient_name"
          value={formData.recipient_name}
          onChange={handleChange}
          margin="normal"
          sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
        />
        <TextField
          fullWidth
          label="No. Telepon Penerima"
          name="recipient_phone_number"
          value={formData.recipient_phone_number}
          onChange={handleChange}
          margin="normal"
          sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
        />

        <TextField
          fullWidth
          label="Street Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
          sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
        />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <FormControl fullWidth>
            <InputLabel
              sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
            >
              Provinsi
            </InputLabel>
            <Select
              value={formData.province_id || ''}
              label="Provinsi"
              onChange={(e) => handleLocationChange(e, 'province')}
              sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
            >
              {provinces.map((province) => (
                <MenuItem
                  key={province.code}
                  value={province.code}
                  sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
                >
                  {province.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>{' '}
          <FormControl fullWidth>
            <InputLabel
              sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
            >
              Kabupaten/Kota
            </InputLabel>
            <Select
              value={formData.city_id || ''}
              label="Provinsi"
              onChange={(e) => handleLocationChange(e, 'city')}
              sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
            >
              {cities.map((city) => (
                <MenuItem
                  key={city.code}
                  value={city.code}
                  sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
                >
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <FormControl fullWidth>
            <InputLabel
              sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
            >
              Kecamatan
            </InputLabel>
            <Select
              value={formData.district_id || ''}
              label="Provinsi"
              onChange={(e) => handleLocationChange(e, 'district')}
              sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
            >
              {districts.map((district) => (
                <MenuItem
                  key={district.code}
                  value={district.code}
                  sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
                >
                  {district.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Kode Pos"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            sx={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78' }}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="text-sm tracking-wider bg-primaryBackground text-primaryText  py-2 px-4 rounded-full hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm tracking-wider bg-orangeAccent text-white py-2 px-4 rounded-full hover:opacity-55"
          >
            Simpan
          </button>
        </div>
      </Box>
    </Modal>
  );
}
