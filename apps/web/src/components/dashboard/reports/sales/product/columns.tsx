'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronUp } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

export type TransactionDetailSummary = {
  product_id: string;
  product_name: string;
  quantity: number;
  revenue: number;
};

export const columns: ColumnDef<TransactionDetailSummary>[] = [
  {
    accessorKey: 'product_name',
    header: ({ column }) => {
      return <Button variant="ghost">Product Name</Button>;
    },
    cell: ({ row }) => {
      const product_name = row.getValue('product_name') as string;
      return (
        <div
          className="truncate max-w-[200px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none"
          title={product_name}
        >
          {product_name}
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
          className="hidden sm:flex"
        >
          Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as string;
      return (
        <div
          className="truncate max-w-[200px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none hidden sm:flex items-center"
          title={quantity}
        >
          {Number(quantity) > 0 && <ChevronUp className="text-[#1ed760]" />}
          <span>{quantity}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'revenue',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Revenue <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const revenue = row.getValue('revenue') as string;
      return (
        <div
          className="truncate max-w-[200px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none flex items-center"
          title={revenue}
        >
          {Number(revenue) > 0 && <ChevronUp className="text-[#1ed760]" />}
          <span>{revenue}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;
    },
  },
];
