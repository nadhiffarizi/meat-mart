'use client';
import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import SearchIcon from './svg/SearchIcon';
import MenuIcon from './svg/MenuIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountMenu from './AccountMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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

  return (
    <div
      className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="w-7xl px-2 md:px-6 lg:px-8">
        <div className="flex justify-between h-20  items-center">
          <div className="flex items-center justify-between md:gap-16">
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

            <button className="hidden md:flex items-center justify-center md:gap-0 max-w-[200px]">
              <Image
                src="/location-icon.png"
                alt="Location Icon"
                width={24}
                height={8}
                className="h-4 w-auto flex-shrink-0"
              />
              <span className="text-[#1495e6] text-sm break-words overflow-hidden text-ellipsis line-clamp-1">
                Masjid Agung Sunda Kelapa kelurahannnsdj jkijwjqlkwjekqlwjekwjek
              </span>
            </button>
          </div>

          <div className="hidden md:flex flex-1 max-w-md md:max-w-full mx-8  pl-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari produk daging, kategori..."
                className="w-full text-sm rounded-full h-[48px] border border-gray-300 py-2 px-4 pl-10 focus:outline-none "
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
            {isLogin ? (
              <>
                {' '}
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
                <AccountMenu />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-primaryText  h-[48px] bg-primaryBackground hover:bg-gray-400 px-4 py-4 md:py-[14px] text-xs md:text-sm font-medium rounded-full "
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-orangeAccent h-[48px] hover:bg-[rgb(194,99,36)] rounded-full  text-white px-4 py-4 md:py-[14px] text-xs md:text-sm font-medium transition-colors "
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
    </div>
  );
};

export default Navbar;
