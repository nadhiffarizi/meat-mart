import FeaturedProducts from '@/components/FeaturedSection.component';
import NavBar from '@/components/Navbar/Navbar.component';

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <NavBar />
      <FeaturedProducts />
    </div>
  );
}
