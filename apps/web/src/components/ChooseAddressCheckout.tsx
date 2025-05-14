'use client';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import AddressListModal from './AddressListModal';
import { useSession } from 'next-auth/react';
import { getUserAddresses } from '@/helper/auth/auth';
import AddAddressModal from './AddAddressModal';
import CheckoutShipping from './CheckoutShippingCost';
import { MapPin } from 'lucide-react';

interface Address {
  id: string;
  recipient_name: string;
  address: string;
  city: string;
  postal_code: string;
  is_selected: boolean;
  longitude: string;
  latitude: string;
}

export default function ChooseAddressCheckout() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: string;
    lng: string;
  } | null>(null);

  const selectedAddress =
    addresses.find((addr) => addr.is_selected) || addresses[0];

  useEffect(() => {
    console.log('Selected address changed:', selectedAddress);
    if (selectedAddress) {
      setSelectedCoordinates({
        lat: selectedAddress.latitude,
        lng: selectedAddress.longitude,
      });
    } else {
      setSelectedCoordinates(null);
    }
  }, [selectedAddress]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (session?.user?.email) {
        try {
          const data = await getUserAddresses(session.user.email);
          setAddresses(data);

          if (data.length > 0) {
            const defaultSelected =
              data.find((addr) => addr.is_selected) || data[0];
            setSelectedCoordinates({
              lat: defaultSelected.latitude,
              lng: defaultSelected.longitude,
            });
          }
        } catch (error) {
          console.error('Failed to fetch addresses:', error);
        }
      }
    };
    fetchAddresses();
  }, [session]);

  const handleAddAddress = (newAddress: Address) => {
    setAddresses([...addresses, newAddress]);
    setShowAddModal(false);
  };

  const handleSelectAddress = (addressId: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      is_selected: addr.id === addressId,
    }));
    setAddresses(updatedAddresses);

    const newSelected = updatedAddresses.find((addr) => addr.id === addressId);
    if (newSelected) {
      setSelectedCoordinates({
        lat: newSelected.latitude,
        lng: newSelected.longitude,
      });
    }

    setShowListModal(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="h-1/3 w-full flex items-center">
        <h1 className="text-xl text-black font-semibold">Delivery Address</h1>
      </div>

      <div className="h-2/3 min-h-[60px] w-full grid grid-cols-2 gap-2 rounded-lg border border-gray-300 py-3 px-3 hover:border-primaryGreen">
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {selectedAddress ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />{' '}
              <div className="truncate">
                <p className="font-medium">{selectedAddress.recipient_name}</p>
                <p className="text-sm text-gray-600">
                  {selectedAddress.address}, {selectedAddress.city}{' '}
                  {selectedAddress.postal_code}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-primaryText text-sm">No address selected</div>
          )}
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <button
            onClick={() =>
              addresses.length > 0
                ? setShowListModal(true)
                : setShowAddModal(true)
            }
            style={{ textTransform: 'none' }}
            className="!text-xs !text-red-400 !bg-transparent !hover:bg-transparent !font-semibold"
          >
            {addresses.length > 0 ? 'Change Address' : 'Add Address'}
          </button>
        </Box>
      </div>

      <AddAddressModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddAddress}
        user={session?.user.email}
      />

      <AddressListModal
        open={showListModal}
        onClose={() => setShowListModal(false)}
        addresses={addresses}
        onSelect={handleSelectAddress}
        onAddNew={() => {
          setShowListModal(false);
          setShowAddModal(true);
        }}
      />

      {selectedCoordinates && (
        <CheckoutShipping
          destination_latitude={selectedCoordinates.lat}
          destination_longitude={selectedCoordinates.lng}
        />
      )}
    </div>
  );
}
