'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Dot } from 'lucide-react';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { IGetDashboardProducts } from '@/interface/product/product.interface';
import dayjs from 'dayjs';

export type StockHistory = {
  id: string;
  quantity: number;
  status: 'ADD' | 'SUBTRACT' | 'SNAPSHOT';
  products: IGetDashboardProducts;
  created_at: string;
};

export const columns: ColumnDef<StockHistory>[] = [
  {
    id: 'productName',
    header: ({ column }) => {
      return <Button variant="ghost">Product Name</Button>;
    },
    accessorFn: (row) => row.products.name,
    cell: ({ row }) => {
      const name = row.original.products.name;
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
      const status = row.original.status as string;
      return (
        <div
          className="truncate max-w-[200px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none flex items-center"
          title={status}
        >
          {status === 'ADD' && <ChevronUp className="text-[#1ed760]" />}
          {status === 'SUBTRACT' && <ChevronDown className="text-[#cd1a2b]" />}
          {status === 'SNAPSHOT' && <Dot className="text-[#4687d6]" />}
          <span>{quantity}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Logged At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string;
      const formattedDate = dayjs(createdAt).format('D MMM');
      return (
        <div
          className="truncate max-w-[200px] whitespace-nowrap overflow-hidden sm:whitespace-normal sm:overflow-visible sm:max-w-none"
          title={formattedDate}
        >
          {formattedDate}
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
