// components/LocationModal.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
}

export const LocationModal = ({
  open,
  onClose,
  onLocationSelect,
}: LocationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState('');

  const detectLocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
            );
            const data = await response.json();
            const address = data.display_name || 'Your current location';
            localStorage.setItem('userLocation', address);
            onLocationSelect(address);
            onClose();
          } catch (err) {
            setError('Failed to get address information');
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          setError('Location access denied');
          setIsLoading(false);
        },
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (manualLocation.trim()) {
      localStorage.setItem('userLocation', manualLocation);
      onLocationSelect(manualLocation);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Welcome to MeatMart!</h2>
        <p className="mb-4">Pilih lokasimu ya</p>

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
                <Image
                  src="/location-icon.png"
                  alt="Location icon"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                Gunakan Lokasi terkini
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Image
                src="/search-icon.png"
                alt="Search icon"
                width={16}
                height={16}
                className="h-4 w-4 text-gray-400"
              />
            </div>
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="Enter your location manually"
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
