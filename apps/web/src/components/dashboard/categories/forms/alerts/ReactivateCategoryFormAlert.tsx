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

async function reactivateCategory(
  name: string,
  router: any,
  token: string | undefined,
  setDisabled: any,
  setOpenCategoryRecovery: any,
) {
  try {
    const response = await api(
      `dashboard/category?restore=true`,
      'POST',
      {
        body: {
          name: name,
        },
        contentType: 'application/json',
      },
      token,
    );

    if (response) {
      setDisabled(true);
      setOpenCategoryRecovery(false);
      toast.success(response.message || 'Category successfully restored!');
      router.push(`/dashboard/categories/new?status=restored`);
    } else {
      setOpenCategoryRecovery(false);
      setDisabled(false);
      toast.error(response.message || 'Something went wrong!');
    }
  } catch (error: any) {
    setOpenCategoryRecovery(false);
    setDisabled(false);
    toast.error(error.message || 'Something went wrong!');
  }
}

function ReactivateCategoryFormAlert({
  setDisabled,
  name,
  setOpenCategoryRecovery,
  openCategoryRecovery,
}: {
  setDisabled: Dispatch<SetStateAction<boolean>>;
  name: string;
  setOpenCategoryRecovery: Dispatch<SetStateAction<boolean>>;
  openCategoryRecovery: boolean;
}) {
  const { data: session, update } = useSession();
  const router = useRouter();
  return (
    <>
      <AlertDialog
        open={openCategoryRecovery}
        onOpenChange={setOpenCategoryRecovery}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This category has been deactivated. Reactivate this category to
              use this category again. All details associated with this category
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
                reactivateCategory(
                  name,
                  router,
                  session?.user.access_token,
                  setDisabled,
                  setOpenCategoryRecovery,
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

export default ReactivateCategoryFormAlert;
