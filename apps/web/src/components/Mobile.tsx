'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Search } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { LocationModal } from './LocationModal';

interface MobileProps {
  isSticky: boolean;
}

const Mobile = ({ isSticky }: MobileProps) => {
  const router = useRouter();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (!savedLocation) {
      setShowLocationModal(true);
    } else {
      setUserLocation(savedLocation);
    }
  }, []);

  const handleLocationSelect = (location: string) => {
    setUserLocation(location);
  };
  return (
    <div
      className={`md:hidden ${isSticky ? 'fixed top-0 left-0 right-0 z-50 h-20 bg-primaryBackground shadow-md transition-all ' : ''}`}
    >
      {!isSticky && (
        <div className="pt-20 pb-4 space-y-1 max-w-[350px]">
          <button
            className="ml-4 pt-4 flex items-center justify-start gap-1"
            onClick={() => setShowLocationModal(true)}
          >
            <Image
              src="/location-icon.png"
              alt="Location Icon"
              width={24}
              height={8}
              className="h-4 w-auto "
            />
            <div className="text-[#1495e6] text-sm break-words  overflow-hidden text-ellipsis line-clamp-1">
              {userLocation || 'Select your location'}
            </div>
          </button>
        </div>
      )}
      <div
        className={`px-4 ${isSticky ? 'pt-3 flex items-center justify-between' : 'pt-2 pb-4'}`}
      >
        <div className={`relative ${isSticky ? 'w-[80%]' : ''} `}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (
                e.currentTarget.elements.namedItem('search') as HTMLInputElement
              ).value;
              router.push(`/products?q=${input}`);
            }}
            className="hidden md:flex flex-1 max-w-md md:max-w-full"
          >
            {' '}
            <input
              type="text"
              name="search"
              placeholder="Cari produk daging, kategori..."
              className="w-full text-sm rounded-full h-[48px] text-primaryText bg-white border border-gray-200 py-2 px-4 pl-10 focus:outline-none "
            />
          </form>

          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search />
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
      <LocationModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default Mobile;
