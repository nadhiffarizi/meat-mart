'use client';
import { Box, ThemeProvider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import AddressListModal from './AddressListModal';
import { useSession } from 'next-auth/react';
import { getUserAddresses } from '@/helpers/handlers/auth';
import AddAddressModal from './AddAddressModal';

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
  const [selectedCoorLat, setSelectedCoorLat] = useState<string>('');
  const [selectedCoorLong, setSelectedCoorLong] = useState<string>('');

  const selectedAddress =
    addresses.find((addr) => addr.is_selected) || addresses[0];

  useEffect(() => {
    if (selectedAddress?.latitude && selectedAddress?.longitude) {
      setSelectedCoorLat(selectedAddress.latitude);
      setSelectedCoorLong(selectedAddress.longitude);
      console.log(
        'Selected latitude updated:',
        selectedCoorLat,
        selectedCoorLong,
      );
    }
  }, [selectedAddress?.latitude]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (session) {
        const data = await getUserAddresses(session.user.email);
        console.log('APAKAH KEPANGGGIL', data);

        setAddresses(data);
        setSelectedCoorLat('');
        console.log('ADDRESSFETCH', addresses);
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

    // Find the newly selected address
    const newSelected = updatedAddresses.find((addr) => addr.id === addressId);
    if (newSelected?.latitude) {
      setSelectedCoorLat(newSelected.latitude);
    }

    setShowListModal(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="h-1/3 w-full flex items-center">
        <h1 className="text-xl text-black font-semibold">Delivery Address</h1>
      </div>

      <div className="h-2/3 min-h-[60px] w-full grid grid-cols-2 gap-2 rounded-sm border border-orangeAccent py-3 px-3">
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {selectedAddress ? (
            <div className="truncate">
              <p className="font-medium">{selectedAddress.recipient_name}</p>
              <p className="text-sm text-gray-600">
                {selectedAddress.address}, {selectedAddress.city}{' '}
                {selectedAddress.postal_code}
              </p>
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

      {/* Address List Modal */}

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
    </div>
  );
}
