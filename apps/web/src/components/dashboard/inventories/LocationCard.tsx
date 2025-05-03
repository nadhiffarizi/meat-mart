import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function LocationCard({
  name,
  address,
  store_id,
}: {
  name: string;
  address: string;
  store_id: string;
}) {
  return (
    <Link href={`/dashboard/inventories/store/${store_id}`}>
      <Card className="flex flex-col justify-between w-[200px] md:w-[350px] break-words ">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription className="whitespace-nowrap truncate">
            {address}.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex md:justify-end">
          {' '}
          <ChevronRight />
        </CardFooter>
      </Card>
    </Link>
  );
}
