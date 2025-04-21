import Image from 'next/image';
import styles from './page.module.css';
import Carousel from '@/components/Hero';
import Categories from '@/components/CategoryMenu';
import { ProductList } from '@/components/ProductList';

export default function Home() {
  return (
    <div>
      <div className="mt-0 mb-6">
        <Categories />
        <Carousel />
        <div className="my-5">
          <ProductList />
        </div>
      </div>
    </div>
  );
}
