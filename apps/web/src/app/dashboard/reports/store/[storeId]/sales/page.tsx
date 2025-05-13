'use client';
import { IGetStores } from '@/interface/store/store.interface';
import { LocationCard } from '@/components/dashboard/inventories/LocationCard';
import { ReportTypeCard } from '@/components/dashboard/reports/ReportTypeCard';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/helpers/api';
import { ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

type Props = {
  params: {
    storeId: string;
  };
};

function Page({ params: { storeId } }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Select Report
      </div>
      <Input />
      <div className="flex gap-4 flex-wrap">
        <ReportTypeCard
          title="By Categories"
          link={`/dashboard/reports/store/${storeId}/sales/category`}
          description="View your monthly revenue."
        />
      </div>
      <div className="flex gap-4 flex-wrap">
        <ReportTypeCard
          title="By Products"
          link={`/dashboard/reports/store/${storeId}/sales/product`}
          description="Track your stock changes."
        />
      </div>
    </div>
  );
}

export default Page;
