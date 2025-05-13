'use client';
import { usePathname } from 'next/navigation';
import Mobile from './Mobile';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pathname = usePathname();
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    setIsDashboard(pathname.startsWith('/dashboard'));
  }, [pathname]);

  return (
    <div className="lg:mb-0 md:mb-24 ">
      {!isDashboard && <Navbar isFixed={false} />}

      {!isDashboard && <Mobile isSticky={isScrolled} />}
      {isScrolled && <div className="h-[0px] bg-red-700"></div>}
    </div>
  );
};
