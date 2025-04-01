'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchIcon from './svg/SearchIcon';
import MenuIcon from './svg/MenuIcon';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="max-w-[95%] mx-auto">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 pb-1">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Meat Mart Logo"
                  width={210}
                  height={70}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}

            <div className="hidden md:ml-6 md:flex items-center justify-center md:gap-2">
              <Image
                src="/location-icon.png"
                alt="Location Icon"
                width={24}
                height={8}
                className="h-4 w-auto "
              />
              <span className="text-[#1495e6] text-sm">
                Masjid Agung Sunda Kelapa
              </span>
            </div>
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

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-primaryText  h-[48px] bg-primaryBackground hover:bg-gray-400 px-4 py-[14px] text-sm font-medium rounded-full "
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="bg-orangeAccent h-[48px] hover:bg-[rgb(194,99,36)] rounded-full  text-white px-4 py-[14px] text-sm font-medium transition-colors"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-primary-600 focus:outline-none"
              aria-expanded="false"
            >
              <MenuIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white">
          <div className="px-4 pt-2 pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk daging, kategori..."
                className="w-full rounded-full border border-gray-300 py-2 px-4 pl-10 focus:outline-none "
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="px-4 space-y-2">
              <div className="ml-6 flex items-center justify-start gap-2 pb-2">
                <Image
                  src="/location-icon.png"
                  alt="Location Icon"
                  width={24}
                  height={8}
                  className="h-4 w-auto "
                />
                <div className="text-[#1495e6] text-sm">
                  Masjid Agung Sunda Kelapa
                </div>
              </div>
              <div className="flex items-center space-x-4 w-full">
                <Link
                  href="/login"
                  className="text-primaryText w-[50%] text-center h-[48px] bg-primaryBackground hover:bg-gray-400 px-3 py-3 text-sm font-medium rounded-full "
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-orangeAccent w-1/2 h-[48px] text-center hover:bg-[rgb(194,99,36)] rounded-full  text-white px-3 py-3 text-sm font-medium transition-colors"
                >
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
