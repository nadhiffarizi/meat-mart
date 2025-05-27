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

export type User = {
  id: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
  email: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      return (
        <div
          className="truncate max-w-[200px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none"
          title={email}
        >
          {email}
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <div className="hidden sm:table-cell">Role</div>,
    cell: ({ row }) => (
      <div className="hidden sm:table-cell">{row.getValue('role')}</div>
    ),
  },
  {
    id: 'actions',
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.email)}
            >
              Copy user Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/users/${row.original.id}`}>
                View user details
              </Link>
            </DropdownMenuItem>
            {payment.role === 'ADMIN' && (
              <DropdownMenuItem>
                <Link href={`/dashboard/users/${row.original.id}/edit`}>
                  Edit user details
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
