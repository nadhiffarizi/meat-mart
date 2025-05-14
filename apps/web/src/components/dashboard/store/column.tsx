import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StoreWithAdmin } from '@/interface/store/store.interface';

export const columns = (
  handleEdit: (store: StoreWithAdmin) => void,
): ColumnDef<StoreWithAdmin>[] => [
  {
    accessorKey: 'name',
    header: 'Store Name',
  },
  {
    accessorKey: 'status',
    header: 'Type',
    cell: ({ row }) => (
      <Badge
        variant={row.getValue('status') === 'CENTRAL' ? 'default' : 'secondary'}
      >
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    accessorKey: 'address',
    header: 'Location',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div>{row.original.address}</div>
        <div className="text-sm text-muted-foreground">
          {[
            row.original.district,
            row.original.city,
            row.original.province,
          ].join(', ')}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'storeadmin',
    header: 'Admin',
    cell: ({ row }) => (
      <div>
        {row.original.storeadmin.first_name
          ? `${row.original.storeadmin.first_name} ${row.original.storeadmin.last_name}`
          : row.original.storeadmin.email}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(row.original)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    ),
  },
];
