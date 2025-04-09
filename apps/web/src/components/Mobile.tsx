import Image from 'next/image';
import React from 'react';
import SearchIcon from './svg/SearchIcon';
import Link from 'next/link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface MobileProps {
  isSticky: boolean;
}

const Mobile = ({ isSticky }: MobileProps) => {
  return (
    <div
      className={`md:hidden ${isSticky ? 'fixed top-0 left-0 right-0 z-50 h-20 bg-primaryBackground shadow-md transition-all ' : ''}`}
    >
      {!isSticky && (
        <div className="pt-20 pb-4 space-y-1 max-w-[350px]">
          <button className="ml-4 pt-4 flex items-center justify-start gap-1">
            <Image
              src="/location-icon.png"
              alt="Location Icon"
              width={24}
              height={8}
              className="h-4 w-auto "
            />
            <div className="text-[#1495e6] text-sm break-words  overflow-hidden text-ellipsis line-clamp-1">
              Masjid Agung Sunda Kelapa kelurahannnsdj jkijwjqlkwjekqlwjekwjek
            </div>
          </button>
        </div>
      )}
      <div
        className={`px-4 ${isSticky ? 'pt-3 flex items-center justify-between' : 'pt-2 pb-4'}`}
      >
        <div className={`relative ${isSticky ? 'w-[80%]' : ''} `}>
          <input
            type="text"
            placeholder="Cari produk daging, kategori..."
            className="w-full rounded-full border border-gray-300 py-2 px-4 pl-10 focus:outline-none "
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
        </div>
        {isSticky ? (
          <>
            <Link
              href={'/cart'}
              className="flex items-center gap-2 w-[26] bg-primaryBackground py-3 px-4 rounded-full hover:bg-slate-300"
            >
              <ShoppingCartIcon
                width={14}
                height={14}
                className=" text-orangeAccent cursor-pointer "
              ></ShoppingCartIcon>
              <div className="text-sm">0</div>
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Mobile;
