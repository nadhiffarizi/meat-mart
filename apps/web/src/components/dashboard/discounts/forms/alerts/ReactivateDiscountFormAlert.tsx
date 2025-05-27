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
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { api } from '@/helper/api';
import { useSession } from 'next-auth/react';

async function reactivateDiscount(
  discountCode: string,
  storeId: string,
  router: any,
  token: string | undefined,
  setDisabled: any,
  setOpenDiscountRecovery: any,
) {
  try {
    const response = await api(
      `dashboard/discount?restore=true`,
      'POST',
      {
        body: {
          discount_code: discountCode,
        },
        contentType: 'application/json',
      },
      token,
    );

    if (response) {
      setDisabled(true);
      setOpenDiscountRecovery(false);
      toast.success(response.message || 'Discount successfully restored!');
      router.push(`/dashboard/discounts/store/${storeId}/new?status=restored`);
    } else {
      setOpenDiscountRecovery(false);
      setDisabled(false);
      toast.error(response.message || 'Something went wrong!');
    }
  } catch (error: any) {
    setOpenDiscountRecovery(false);
    setDisabled(false);
    toast.error(error.message || 'Something went wrong!');
  }
}

function ReactivateDiscountFormAlert({
  setDisabled,
  discountCode,
  storeId,
  setOpenDiscountRecovery,
  openDiscountRecovery,
}: {
  setDisabled: Dispatch<SetStateAction<boolean>>;
  discountCode: string;
  storeId: string;
  setOpenDiscountRecovery: Dispatch<SetStateAction<boolean>>;
  openDiscountRecovery: boolean;
}) {
  const { data: session, update } = useSession();
  const router = useRouter();
  return (
    <>
      <AlertDialog
        open={openDiscountRecovery}
        onOpenChange={setOpenDiscountRecovery}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate this discount?</AlertDialogTitle>
            <AlertDialogDescription>
              This discount has been deactivated. Reactivate this discount to
              use this discount again. All details associated with this discount
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
                reactivateDiscount(
                  discountCode,

                  storeId,
                  router,
                  session?.user.access_token,
                  setDisabled,
                  setOpenDiscountRecovery,
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

export default ReactivateDiscountFormAlert;
