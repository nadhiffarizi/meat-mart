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

export function ReportTypeCard({
  store_id,
  reportType,
  description,
}: {
  store_id: string;
  reportType: string;
  description: string;
}) {
  return (
    <Link href={`/dashboard/reports/store/${store_id}/${reportType}`}>
      <Card className="flex flex-col justify-between w-[200px] md:w-[350px] break-words ">
        <CardHeader>
          <CardTitle>{reportType.toUpperCase()}</CardTitle>
          <CardDescription className="whitespace-nowrap truncate">
            {description}
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
