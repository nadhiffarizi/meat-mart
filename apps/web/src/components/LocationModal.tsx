'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { openCageApiKey } from '@/helper/config';
import { Search } from '@mui/icons-material';
import { Address } from '@/interface/user/address.interface';
import { useSession } from 'next-auth/react';

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onLocationSelect: (
    location: string,
    coords?: { lat: number; lng: number },
  ) => void;
}

export const LocationModal = ({
  open,
  onClose,
  onLocationSelect,
}: LocationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [watchId, setWatchId] = useState<number | null>(null);
  const { data: session, update } = useSession();
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
    const checkPermission = async () => {
      const permission = await navigator.permissions?.query({
        name: 'geolocation',
      });
      permission.onchange = () => {
        setError(null);
      };
    };
    checkPermission();
  }, []);

  const detectLocation = async () => {
    setIsLoading(true);
    setError(null);
    setManualLocation('');
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          try {
            // Using OpenCage for reverse geocoding
            const timestamp = Date.now();
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${openCageApiKey}&language=en&countrycode=id&no_annotations=1&no_dedupe=1&timestamp=${timestamp}`,
            );

            if (!response.ok) {
              throw new Error('Failed to fetch address');
            }

            const data = await response.json();

            if (data.results?.length > 0) {
              const components = data.results[0].components;

              const address = [
                components.road,
                components.village || components.suburb,
                components.city || components.town,
                components.state,
                components.postcode,
              ]
                .filter(Boolean)
                .join(', ');

              // Store in localStorage
              localStorage.setItem('userLocation', address);
              localStorage.setItem(
                'lastCoords',
                JSON.stringify({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                  timestamp: Date.now(),
                }),
              );

              onLocationSelect(address, {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              onClose();
            } else {
              throw new Error('No address found for this location');
            }
          } catch (err) {
            setError('Failed to get address information');
            console.error('Reverse geocoding error:', err);
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          setError(
            err.message.includes('denied')
              ? 'Location access was denied'
              : 'Failed to get your location',
          );
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 15000,
        },
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualLocation.trim()) return;
    setIsLoading(true);
    setError(null);
    console.log('manualLocation', manualLocation);
    try {
      // await addUserAddress(
      //   session.user.email,
      //   currentAddress as Omit<Address, 'id'>,
      // );

      // Forward geocoding for manual address input
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(manualLocation)},Indonesia&key=${openCageApiKey}&countrycode=id`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch location coordinates');
      }
      const data = await response.json();
      console.log('ALAMAT MANUAL', data);

      if (data.results?.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        const formattedAddress = data.results[0].formatted || manualLocation;
        localStorage.setItem('userLocation', formattedAddress);
        localStorage.setItem(
          'lastCoords',
          JSON.stringify({
            lat: lat,
            lng: lng,
            timestamp: Date.now(),
          }),
        );
        onLocationSelect(formattedAddress, { lat, lng });

        onClose();
      } else {
        throw new Error('Address not found');
      }
    } catch (err) {
      setError(
        'Could not find this location. Please try a more specific address.',
      );
      console.error('Geocoding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  if (
    session?.user.role &&
    (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN')
  )
    return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Welcome to MeatMart!</h2>
        <p className="mb-4 text-xs text-red-400">
          Pastikan deteksi lokasi sesuai sekitar alamatmu/ bisa masukkan alamat
          manual
        </p>

        <div className="space-y-4">
          <button
            onClick={detectLocation}
            disabled={isLoading}
            className="w-full bg-orangeAccent text-white py-2 rounded-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Detecting...
              </>
            ) : (
              <>
                <p>Gunakan Lokasi terkini</p>
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search />
            </div>
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="Jalan, Kecamatan, Kabupaten, Provinsi"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleManualSubmit}
            disabled={!manualLocation.trim()}
            className={`w-full py-2 rounded-md ${
              !manualLocation.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primaryGreen text-white'
            }`}
          >
            Confirm Location
          </button>
        </div>

        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};
