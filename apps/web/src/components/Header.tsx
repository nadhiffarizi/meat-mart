'use client';
import Mobile from './Mobile';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // Adjust this threshold as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="md:mb-24">
      <Navbar />

      <Mobile isSticky={isScrolled} />
      {/* {isScrolled && <div className="h-[0px] bg-red-700"></div>} */}
    </div>
  );
};
