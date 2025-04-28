import FeaturedProducts from '@/components/FeaturedSection.component';
import { Header } from '@/components/Header';
import Navbar from '@/components/Navbar';
import NavBar from '@/components/Navbar/Navbar.component';

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Header />
      <FeaturedProducts />
    </div>
  );
}
