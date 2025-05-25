'use client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { green } from '@mui/material/colors';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Store = {
  id: string;
  name: string;
};

export const columns: ColumnDef<Store>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return (
        <div
          className="truncate max-w-[200px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none"
          title={name}
        >
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return <div className="">Store Type</div>;
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div
          className="truncate max-w-[100px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none"
          title={status}
        >
          <p
            className={`${status === 'CENTRAL' ? 'bg-blue-200' : 'bg-green-200'} rounded-full py-2 text-center w-[80px] text-xs`}
          >
            {status}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: ({ column }) => {
      return <div className="-ml-2">Actions</div>;
    },
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/dashboard/stores/${row.original.id}/edit`}>
                Edit store details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
