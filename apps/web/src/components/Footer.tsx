// components/Footer.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export const Footer = () => {
  const pathname = usePathname();
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    setIsDashboard(pathname.startsWith('/dashboard'));
  }, [pathname]);

  return (
    <footer
      className={
        isDashboard ? 'hidden' : 'bg-primaryGreen text-white pt-12 pb-6'
      }
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-orangeAccent">
              MeatMart
            </h3>
            <p className="text-gray-400">
              Penuhi kebutuhan daging harianmu dengan mudah, tinggal tunggu di
              rumah.
            </p>
            <div className="flex mt-4 space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition"
              >
                <FaFacebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition"
              >
                <FaTwitter size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition"
              >
                <FaInstagram size={20} />
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[16px] font-semibold mb-4">
              Tentang Meat Mart
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white transition"
                >
                  Produk Daging
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes"
                  className="text-gray-400 hover:text-white transition"
                >
                  Resep Panduan
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-white transition"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-[16px] font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition"
                >
                  Kebijakan
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-400 hover:text-white transition"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-6 ">
            <h3 className="text-[16px] font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to get updates on new products and special offers.
            </p>
            <form className="flex text-sm">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l focus:outline-none text-gray-900 "
                required
              />
              <button
                type="submit"
                className="bg-orangeAccent hover:bg-orange-600 px-4 py-2 rounded-r transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MeatMart. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
