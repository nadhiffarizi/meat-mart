import { Dialog, ListItemButton } from '@mui/material';

interface Address {
  id: string;
  recipient_name: string;
  address: string;
  city: string;
  postal_code: string;
  is_selected: boolean;
}

interface AddressListModalProps {
  open: boolean;
  onClose: () => void;
  addresses: Address[];
  onSelect: (id: string) => void;
  onAddNew: () => void;
}

export default function AddressListModal({
  open,
  onClose,
  addresses,
  onSelect,
  onAddNew,
}: AddressListModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative z-50"
      sx={{
        // fontSize: '14px',
        fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-primaryIcon shadow-xl">
          <div className="px-8 pt-8 pb-4">
            <h2 className="font-semibold text-xl">Select Delivery Address</h2>
            <div className="flex flex-col items-start mb-2 w-full mt-4 max-h-[60vh] overflow-y-auto gap-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`w-full rounded-md border ${
                    address.is_selected ? ' bg-green-100' : 'border-gray-200'
                  } transition-colors duration-200`}
                >
                  <ListItemButton
                    onClick={() => onSelect(address.id)}
                    selected={address.is_selected}
                    className="w-full bg-transparent"
                    sx={{
                      borderRadius: '6px',
                      '&.Mui-selected': {
                        backgroundColor: 'transparent',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <div className="text-sm text-primaryText text-left p-2">
                      <p className="font-semibold text-[16px]">
                        {address.recipient_name}
                      </p>
                      <p>
                        {`${address.address}, ${address.city} ${address.postal_code}`}
                      </p>
                    </div>
                  </ListItemButton>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="text-sm tracking-wider bg-primaryBackground text-primaryText py-2 px-4 rounded-full hover:bg-gray-400 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={onAddNew}
                className="text-sm tracking-wider bg-orangeAccent text-white py-2 px-4 rounded-full hover:opacity-55 transition-opacity"
              >
                Tambah Alamat
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
