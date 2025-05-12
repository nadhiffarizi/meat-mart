'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ICard } from '../interfaces/card.interface';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Plus } from 'lucide-react';

export function Card(props: ICard) {
  const { data: session } = useSession();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!session) {
      setOpenSnackbar(true);
    }

    // Add to cart logic here
    console.log('Added to cart:', props.name);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          onClose={handleCloseSnackbar}
          sx={{ width: '100%' }}
        >
          Silahkan Masuk untuk menambahkan produk ke keranjang!
        </Alert>
      </Snackbar>

      <Link href={'/'} passHref>
        <div className="w-full max-w-[230px] bg-primaryIcon rounded-lg shadow-xl relative">
          <div className="w-full">
            <div className="w-full px-2 py-2 rounded-xl">
              <div className="relative">
                <Image
                  width={216}
                  height={100}
                  className="w-full rounded-lg h-[150px] lg:h-[150px] object-cover"
                  src={'/templateproduct.png'}
                  alt="product-image"
                />
                <Image
                  width={60}
                  height={60}
                  alt=""
                  className={`w-[45px] h-[45px] absolute right-[15%] top-[10%] 
                    ${!(props.stock == 0) ? 'hidden' : 'block'}`}
                  src="/sold-icon.png"
                />
              </div>
            </div>

            <div className="px-2 md:px-5 mt-4 flex flex-col text-sm md:text-[16px]">
              <b className="h-4 md:h-6 w-full">{props.name}</b>
              <p className="mt-1 md:mt-0 h-4 md:h-6 mb-2 w-full overflow-hidden text-xs md:text-sm text-gray-500">
                /pack
              </p>
              <div className="flex justify-between items-center mb-4 md:mb-4">
                <b className="text-[#159953] overflow-hidden">
                  {props.price == 0
                    ? 'Free'
                    : `IDR ${Number(props.price).toLocaleString('id-ID')}`}
                </b>
                <button
                  onClick={handleAddToCart}
                  // disabled={!session || props.stock === 0}
                  className={`h-8 w-8 md:h-8 md:w-8 font-semibold rounded-full text-xl md:text-2xl flex items-center justify-center
                    ${
                      !session || props.stock === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orangeAccent hover:text-white hover:bg-orange-600'
                    }`}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
