'use client';

import { Address } from '@/interface/user/address.interface';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface AddressDialogProps {
  open: boolean;
  editMode: boolean;
  currentAddress: Partial<Address>;
  provinces: { code: string; name: string }[];
  cities: { code: string; name: string }[];
  districts: { code: string; name: string }[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationChange: (
    e: SelectChangeEvent<string>,
    type: 'province' | 'city' | 'district',
  ) => void;
}

export default function AddressForm({
  open,
  editMode,
  currentAddress,
  provinces,
  cities,
  districts,
  isSubmitting,
  onClose,
  onSubmit,
  onInputChange,
  onLocationChange,
}: AddressDialogProps) {
  const getCurrentLocationName = (type: 'province' | 'city' | 'district') => {
    const code =
      type === 'province'
        ? currentAddress.province_id
        : type === 'city'
          ? currentAddress.city_id
          : currentAddress.district_id;

    const collection =
      type === 'province' ? provinces : type === 'city' ? cities : districts;

    const found = collection.find((item) => item.code === code);
    return found ? found.name : '';
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <h2 className="mt-6 ml-6 font-semibold text-xl">
        {editMode ? 'Edit Alamat' : 'Tambah Alamat Baru'}
      </h2>
      <DialogContent sx={{ fontFamily: 'Inter, sans-serif', fontSize: '50%' }}>
        <div className="space-y-4 mt-4">
          <TextField
            fullWidth
            label="Nama Penerima"
            name="recipient_name"
            value={currentAddress.recipient_name || ''}
            onChange={onInputChange}
            size="small"
          />
          <TextField
            fullWidth
            label="Nomor Telepon"
            name="recipient_phone_number"
            value={currentAddress.recipient_phone_number || ''}
            onChange={onInputChange}
            size="small"
          />
          <TextField
            fullWidth
            label="Alamat Lengkap"
            name="address"
            value={currentAddress.address || ''}
            onChange={onInputChange}
            multiline
            rows={3}
            size="small"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: 'Inter, sans-serif' }} size="small">
                Provinsi
              </InputLabel>
              <Select
                value={currentAddress.province_id || ''}
                label="Provinsi"
                onChange={(e) => onLocationChange(e, 'province')}
                sx={{ fontFamily: 'Inter, sans-serif' }}
                size="small"
                renderValue={(selected) => {
                  if (!selected) return <em>Pilih Provinsi</em>;
                  return getCurrentLocationName('province') || selected;
                }}
              >
                <MenuItem value="" disabled>
                  <em>Pilih Provinsi</em>
                </MenuItem>
                {provinces.map((province) => (
                  <MenuItem
                    key={province.code}
                    value={province.code}
                    sx={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {province.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontFamily: 'Inter, sans-serif' }}>
                Kota/Kabupaten
              </InputLabel>
              <Select
                value={currentAddress.city_id || ''}
                label="Kota/Kabupaten"
                onChange={(e) => onLocationChange(e, 'city')}
                sx={{ fontFamily: 'Inter, sans-serif' }}
                renderValue={(selected) => {
                  if (!selected) return <em>Pilih Kota/Kabupaten</em>;
                  return getCurrentLocationName('city') || selected;
                }}
              >
                <MenuItem value="" disabled>
                  <em>Pilih Kota/Kabupaten</em>
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem
                    key={city.code}
                    value={city.code}
                    sx={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: 'Inter, sans-serif' }} size="small">
                Kecamatan
              </InputLabel>
              <Select
                value={currentAddress.district_id || ''}
                label="Kecamatan"
                onChange={(e) => onLocationChange(e, 'district')}
                sx={{ fontFamily: 'Inter,sans-serif' }}
                size="small"
                renderValue={(selected) => {
                  if (!selected) return <em>Pilih Kecamatan</em>;
                  return getCurrentLocationName('district') || selected;
                }}
              >
                <MenuItem value="" disabled>
                  <em>Pilih Kecamatan</em>
                </MenuItem>
                {districts.map((district) => (
                  <MenuItem
                    key={district.code}
                    value={district.code}
                    sx={{ fontFamily: 'Inter, sans-serif' }}
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
              value={currentAddress.postal_code || ''}
              onChange={onInputChange}
              sx={{ fontSize: '85%' }}
              size="small"
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div className="flex justify-end gap-3 mb-4 mr-4">
          <button
            onClick={onClose}
            className="text-sm tracking-wider bg-primaryBackground text-primaryText py-2 px-4 rounded-full hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="text-sm tracking-wider bg-orangeAccent text-white py-2 px-4 rounded-full hover:opacity-55"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
