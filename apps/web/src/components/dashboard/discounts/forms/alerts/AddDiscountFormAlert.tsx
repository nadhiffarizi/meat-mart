import { Alert } from '@/components/ui/alert';
import { CircleCheckBig } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function AddDiscountFormAlert({
  status,
  storeId,
}: {
  status: string | null;
  storeId: string;
}) {
  return (
    <div>
      {status == 'successful' && (
        <Alert variant={'affirmative'}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Discount Created</div>
              <div className="text-sm">
                Click{' '}
                <Link
                  href={`/dashboard/discounts/store/${storeId}`}
                  className="underline"
                >
                  here to return to dashboard.
                </Link>{' '}
              </div>
            </div>
            <CircleCheckBig className="w-8 h-8" />
          </div>
        </Alert>
      )}
      {status == 'restored' && (
        <Alert variant={'affirmative'}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Discount Restored</div>
              <div className="text-sm">
                Click{' '}
                <Link
                  href={`/dashboard/discounts/store/${storeId}`}
                  className="underline"
                >
                  here to return to dashboard.
                </Link>{' '}
              </div>
            </div>
            <CircleCheckBig className="w-8 h-8" />
          </div>
        </Alert>
      )}
    </div>
  );
}

export default AddDiscountFormAlert;
