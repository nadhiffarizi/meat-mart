import Image from 'next/image';
import styles from './page.module.css';
import Carousel from '@/components/Hero';
import { ProductList } from '@/components/ProductList';
import Categories from '@/components/CategoryMenu';

export default function Home() {
  return (
    <div>
      <div className="mt-0 mb-6">
        <div className="md:pt-10 lg:pt-24">
          <Categories />
        </div>

        <Carousel />
        <div className="my-5">
          <ProductList />
        </div>
      </div>
    </div>
  );
}
