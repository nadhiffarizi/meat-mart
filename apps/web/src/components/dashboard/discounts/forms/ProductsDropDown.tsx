'use client';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IGetDashboardProducts } from '@/interface/product.interface';
import Link from 'next/link';

export function ProductDropDown({
  value,
  onChange,
  allProducts,
}: {
  value: string;
  onChange: (val: string) => void;
  allProducts: IGetDashboardProducts[];
}) {
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (triggerRef.current) {
      setMenuWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerRef.current]);

  const selectedProduct = allProducts.find((p) => p.id === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          ref={triggerRef}
          id="product_id"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
        >
          {selectedProduct ? selectedProduct.name : 'Select a product'}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        style={{ width: menuWidth ?? 'auto' }}
      >
        <DropdownMenuLabel>All Products</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(val) => onChange(val)}
        >
          {allProducts.length ? (
            allProducts.map((product) => (
              <DropdownMenuRadioItem key={product.id} value={product.id}>
                {product.name}
              </DropdownMenuRadioItem>
            ))
          ) : (
            <Link href={`/dashboard/products/new`}>
              <DropdownMenuRadioItem value="">
                Create a new product
              </DropdownMenuRadioItem>
            </Link>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
