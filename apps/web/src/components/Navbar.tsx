'use client';
import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountMenu from './AccountMenu';
import { useAppSelector } from '@/redux/store';
import { countTotalInCart } from '@/helper/cart.helper';
import { Button, IconButton } from '@mui/material';
import CartButtonNavbar from './Cart/CartButton.component';
import { LocationModal } from './LocationModal';
import { Search } from '@mui/icons-material';
import { ShoppingBagIcon } from '@heroicons/react/16/solid';
import NavbarDropDown from './Navbar/NavbarDropdown.component';

const Navbar = ({ isFixed }: { isFixed?: boolean }) => {
  // global state cart
  const cartState = useAppSelector((state: any) => state.cartState);
  const adressState = useAppSelector((state: any) => state.addressState);

  const { data: session } = useSession();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState('');
  const [totalCartQtty, setCartQtty] = useState<number>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [cartDropdownEl, setCartDropdownEl] =
    React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (!savedLocation) {
      setShowLocationModal(true);
    } else {
      setUserLocation(savedLocation);
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const totalQtty = countTotalInCart(cartState);
    setCartQtty(totalQtty);
  }, [cartState]);

  const handleLocationSelect = (location: string) => {
    setUserLocation(location);
  };
  // ${isFixed ? 'fixed' : 'relative'}

  return (
    <div
      className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-primaryBackground shadow-md' : 'bg-primaryBackground'
      }`}
    >
      <div className="w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex justify-between gap-2 h-20  items-center">
          <div className="flex items-center justify-between md:gap-6 lg:gap-14">
            <div className="flex-shrink-0 pb-1">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Meat Mart Logo"
                  width={210}
                  height={70}
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}

            <button
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center justify-end md:gap-0 max-w-[200px] hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
            >
              <Image
                src="/location-icon.png"
                alt="Location Icon"
                width={24}
                height={8}
                className="h-4 w-auto flex-shrink-0"
              />
              <span className="text-[#1495e6] text-sm break-words overflow-hidden text-ellipsis line-clamp-1 mr-2">
                {userLocation || 'Select your location'}
              </span>
            </button>
          </div>

          <div className="hidden md:flex flex-1 max-w-md md:max-w-full">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari produk daging, kategori..."
                className="w-full text-sm rounded-full h-[48px] text-primaryText bg-white border border-gray-200 py-2 px-4 pl-10 focus:outline-none "
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end ml-4">
            {session?.user?.id ? (
              <>
                <CartButtonNavbar />
                <AccountMenu />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-primaryText  h-[48px] bg-primaryIcon hover:bg-gray-400 px-4 py-4 md:py-[14px] text-xs md:text-sm font-medium rounded-full "
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-orangeAccent h-[48px] hover:bg-[rgb(194,99,36)] rounded-full  text-white px-4 py-4 md:py-[14px] text-xs md:text-sm font-medium transition-colors ml-2"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <LocationModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default Navbar;
