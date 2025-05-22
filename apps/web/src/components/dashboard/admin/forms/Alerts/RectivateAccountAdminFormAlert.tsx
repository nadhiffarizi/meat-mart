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
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { api } from '@/helper/api';
import { useSession } from 'next-auth/react';

async function reactivateAccount(
  email: string,
  router: any,
  token: string | undefined,
  setDisabled: any,
  setOpenAccountRecovery: any,
) {
  try {
    const response = await api(
      `admin/users?restore=true`,
      'POST',
      {
        body: {
          email: email,
        },
        contentType: 'application/json',
      },
      token,
    );

    if (response) {
      setDisabled(true);
      setOpenAccountRecovery(false);
      toast.success(response.message || 'User successfully restored!');
      router.push(`/dashboard/users/new?status=restored`);
    } else {
      setOpenAccountRecovery(false);
      setDisabled(false);
      toast.error(response.message || 'Something went wrong!');
    }
  } catch (error: any) {
    setOpenAccountRecovery(false);
    setDisabled(false);
    toast.error(error.message || 'Something went wrong!');
  }
}

function ReactivateAccountAdminFormAlert({
  setDisabled,
  email,
  setOpenAccountRecovery,
  openAccountRecovery,
}: {
  setDisabled: Dispatch<SetStateAction<boolean>>;
  email: string;
  setOpenAccountRecovery: Dispatch<SetStateAction<boolean>>;
  openAccountRecovery: boolean;
}) {
  const { data: session, update } = useSession();
  const router = useRouter();
  return (
    <>
      <AlertDialog
        open={openAccountRecovery}
        onOpenChange={setOpenAccountRecovery}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This user has been deactivated. Reactivate this user to use this
              account again. All personal details associated with this account
              will be restored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDisabled(false);
              }}
            >
              Cancel
            </AlertDialogCancel>

            <button
              onClick={() => {
                reactivateAccount(
                  email,
                  router,
                  session?.user.access_token,
                  setDisabled,
                  setOpenAccountRecovery,
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

export default ReactivateAccountAdminFormAlert;
