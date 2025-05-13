import { Alert } from '@/components/ui/alert';
import { CircleCheckBig } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function EditProductFormAlert({ status }: { status: string | null }) {
  return (
    <div>
      {status == 'successful' && (
        <Alert variant={'affirmative'}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Changes Saved</div>
              <div className="text-sm">
                Click{' '}
                <Link href={'/dashboard/products'} className="underline">
                  here to return to dashboard.
                </Link>{' '}
              </div>
            </div>
            <CircleCheckBig className="w-8 h-8" />
          </div>
        </Alert>
      )}
      {status == 'deleted' && (
        <Alert variant={'destructive'}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Product Deleted</div>
              <div className="text-sm">
                Click{' '}
                <Link href={`/dashboard/products`} className="underline">
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

export default EditProductFormAlert;
