'use client';
import { useEffect, useState } from 'react';

//import { getProvinces, getCities, getDistricts } from "@/lib/rajaongkir";

export default function LocationPickerModal({
  open,
  onClose,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  userId?: string;
}) {
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Jawa Barat' },
  ]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Kota Bandung' },
  ]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Rancasari' },
  ]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadProvinces = async () => {
      // const data = await getProvinces();
      // setProvinces(data);
    };
    loadProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const loadCities = async () => {
        // const data = await getCities(selectedProvince);
        // setCities(data);
      };
      loadCities();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      const loadDistricts = async () => {
        // const data = await getDistricts(selectedCity);
        // setDistricts(data);
      };
      loadDistricts();
    }
  }, [selectedCity]);

  //   const handleSubmit = async () => {
  //     // Get coordinates using Geocoding API
  //     // const coords = await fetchCoordinates(`${address}, ${selectedDistrict}, ${selectedCity}, ${selectedProvince}`);
  //     // Save to backend
  //     //     const res = await fetch("/api/user/address", {
  //     //       method: "POST",
  //     //       body: JSON.stringify({
  //     //         userId,
  //     //         recipient_name: "User", // Customize as needed
  //     //         recipient_phone_number: "", // Add input field for this
  //     //         address,
  //     //         province: selectedProvince,
  //     //         city: selectedCity,
  //     //         district: selectedDistrict,
  //     //         latitude: coords.lat,
  //     //         longitude: coords.lng,
  //     //       }),
  //     //     });
  //     //    if (res.ok)
  //     onClose();
  //   };

  return (
    open && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div
          className="flex min-h-full items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
            <div className="bg-primaryGreen px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                Pilih Lokasi Anda
              </h3>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provinsi
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  disabled={isLoading}
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kota/Kabupaten
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 "
                  disabled={!selectedProvince || isLoading}
                >
                  <option value="">Pilih Kota</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kecamatan
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  disabled={!selectedCity || isLoading}
                >
                  <option value="">Pilih Kecamatan</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Contoh: Jl. Sudirman No. 123, Gedung ABC"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={onClose}
                //disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={onClose}
                // disabled={!selectedDistrict || !address || isLoading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                  !selectedDistrict || !address
                    ? 'bg-orange-300 cursor-not-allowed'
                    : 'bg-orangeAccent hover:bg-orange-600'
                }`}
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Lokasi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
