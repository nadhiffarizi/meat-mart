'use client';
import React, { Dispatch, SetStateAction } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { api } from '@/helper/api';
import { useSession } from 'next-auth/react';
import { deleteStoreById } from '@/helper/store/store.helper';

async function deleteStore(
  id: string,
  router: any,
  email: string,
  setDisabled: any,
) {
  try {
    const response = await deleteStoreById(email, id);

    if (response) {
      setDisabled(true);
      toast.success(response.message || 'Store successfully deleted!');
      router.push(`/dashboard/stores/${id}/edit?status=deleted`);
    } else {
      setDisabled(false);
      toast.error(response.message || 'Something went wrong!');
    }
  } catch (error: any) {
    setDisabled(false);
    toast.error(error.message || 'Something went wrong!');
  }
}

function EditStoreFormDeleteAlert({
  disabled,
  setDisabled,
  id,
}: {
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  id: string;
}) {
  const { data: session, update } = useSession();
  const router = useRouter();
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size={'lg'}
            className={
              disabled
                ? ' bg-secondaryText px-4 py-2  text-base w-full'
                : 'text-red-500 hover:bg-red-500 hover:text-white  px-4 py-2  text-base w-full'
            }
            disabled={disabled}
            type="button"
          >
            Delete Store <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete this store and data
              associated with this store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <button
              onClick={() => {
                deleteStore(id, router, session?.user.email, setDisabled);
              }}
            >
              <AlertDialogAction className="bg-orangeAccent text-white">
                Continue
              </AlertDialogAction>
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </>
  );
}

export default EditStoreFormDeleteAlert;
