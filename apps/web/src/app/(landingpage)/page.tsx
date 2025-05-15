import Image from 'next/image';
import styles from './page.module.css';
import Carousel from '@/components/Hero';
import { ProductList } from '@/components/ProductList';
import Categories from '@/components/CategoryMenu';

export default function Home() {
  return (
    <div>
      <div className="">
        <div className="md:pt-0 lg:pt-0">
          <Categories />
        </div>
        <div className="mt-4">
          <Carousel />
        </div>

        <div className="my-5">
          <ProductList />
        </div>
      </div>
    </div>
  );
}
