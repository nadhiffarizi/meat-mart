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
import { api } from '@/helpers/api';
import { useSession } from 'next-auth/react';

async function deleteAccount(
  id: string,
  router: any,
  token: string | undefined,
  setDisabled: any,
) {
  try {
    const response = await api(`admin/users/${id}`, 'DELETE', {}, token);

    if (response) {
      setDisabled(true);
      toast.success(response.message || 'User successfully deleted!');
      router.push(`/dashboard/users/${id}/edit?status=deleted`);
    } else {
      setDisabled(false);
      toast.error(response.message || 'Something went wrong!');
    }
  } catch (error: any) {
    setDisabled(false);
    toast.error(error.message || 'Something went wrong!');
  }
}

function EditAdminFormDeleteAlert({
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
            Delete User <Trash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              account and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <button
              onClick={() => {
                deleteAccount(
                  id,
                  router,
                  session?.user.access_token,
                  setDisabled,
                );
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

export default EditAdminFormDeleteAlert;
