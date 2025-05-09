import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>Yakin hapus alamat ini?</DialogContent>
      <DialogActions>
        <button
          onClick={onClose}
          className="my-2 mr-2 py-2 px-4 rounded-full bg-primaryBackground text-primaryText hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="my-2 mr-2 py-2 px-4 rounded-full bg-orangeAccent text-white hover:opacity-55"
        >
          Delete
        </button>
      </DialogActions>
    </Dialog>
  );
}
