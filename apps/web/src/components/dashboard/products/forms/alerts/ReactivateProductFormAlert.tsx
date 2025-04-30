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

async function reactivateProduct(
  name: string,
  router: any,
  token: string | undefined,
  setDisabled: any,
  setOpenCategoryRecovery: any,
) {
  try {
    const response = await api(
      `product?restore=true`,
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
      toast.success(response.message || 'Product successfully restored!');
      router.push(`/dashboard/products/new?status=restored`);
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

function ReactivateProductFormAlert({
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
            <AlertDialogTitle>Reactivate this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This product has been deactivated. Reactivate this product to use
              this product again. All details associated with this product will
              be restored.
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
                reactivateProduct(
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

export default ReactivateProductFormAlert;
