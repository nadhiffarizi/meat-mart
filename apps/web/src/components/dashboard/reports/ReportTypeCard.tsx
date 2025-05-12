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
  title,
  link,
  description,
}: {
  title: string;
  link: string;
  description: string;
}) {
  return (
    // /dashboard/reports/store/${store_id}/${reportType}
    <Link href={link}>
      <Card className="flex flex-col justify-between w-[200px] md:w-[350px] break-words ">
        <CardHeader>
          <CardTitle>{title.toUpperCase()}</CardTitle>
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
