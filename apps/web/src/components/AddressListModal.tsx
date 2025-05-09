import {
  Modal,
  Box,
  Button,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { Inter } from 'next/font/google';

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
    <Modal open={open} onClose={onClose} className={`Inter`}>
      <div className="w-[70%] md:w-[50%] lg:w-[30%] inset-0  px-8 pt-8 pb-4 translate-y-[50%] translate-x-[25%] md:translate-x-[50%] lg:translate-x-[100%] bg-primaryIcon">
        <h2 className="font-semibold text-xl">Select Delivery Address</h2>

        <div className="flex flex-col items-start mb-2 w-full ">
          {addresses.map((address) => (
            <div key={address.id} className="w-full mt-2">
              <ListItemButton
                onClick={() => onSelect(address.id)}
                selected={address.is_selected}
              >
                <div className="text-sm text-primaryText text-left">
                  <p className="font-semibold ">{address.recipient_name}</p>
                  <p>
                    {`${address.address}, ${address.city} ${address.postal_code}`}
                  </p>
                </div>
              </ListItemButton>
              <Divider />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 my-4">
          <button
            onClick={onClose}
            className="text-xs tracking-wider  bg-primaryBackground text-primaryText  py-2 px-4 rounded-full hover:bg-gray-400"
          >
            Tutup
          </button>
          <button
            onClick={onAddNew}
            className="text-xs tracking-wider bg-orangeAccent text-white py-2 px-4 rounded-full hover:opacity-55"
          >
            Tambah Alamat
          </button>
        </div>
      </div>
    </Modal>
  );
}
