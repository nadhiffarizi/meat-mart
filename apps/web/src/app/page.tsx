import NavBar from '@/components/Navbar.component';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/20/solid';
import FeaturedProducts from '@/components/FeaturedSection.component';

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <FeaturedProducts />
    </div>
  );
}
