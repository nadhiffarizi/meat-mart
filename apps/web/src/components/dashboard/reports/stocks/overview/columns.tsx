'use client';
import { ColumnDef } from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronUp,
  ChevronUpIcon,
  Dot,
  MoreHorizontal,
} from 'lucide-react';
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
import { IGetDashboardProducts } from '@/interface/product/product.interface';
import dayjs from 'dayjs';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StockSummary = {
  product_id: string;
  name: string;
  quantity: number;
  final_stock: number;
  store_id: string;
};

export const columns: ColumnDef<StockSummary>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <Button variant="ghost">Product Name</Button>;
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
    accessorKey: 'quantity',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as string;
      return (
        <div
          className="truncate max-w-[200px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none flex items-center"
          title={quantity}
        >
          {Number(quantity) > 0 && <ChevronUp className="text-[#1ed760]" />}
          {Number(quantity) < 0 && <ChevronDown className="text-[#cd1a2b]" />}
          {Number(quantity) === 0 && <Dot className="text-[#4687d6]" />}
          <span>{quantity}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'final_stock',
    header: ({ column }) => {
      return <Button variant="ghost">Final Stock</Button>;
    },
    cell: ({ row }) => {
      const finalStock = row.getValue('final_stock') as string;
      return (
        <div
          className="truncate max-w-[200px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none"
          title={finalStock}
        >
          {finalStock}
        </div>
      );
    },
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
            <DropdownMenuItem>
              <Link
                href={`/dashboard/reports/store/${row.original.store_id}/stocks/product/${row.original.product_id}`}
              >
                View stock details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
