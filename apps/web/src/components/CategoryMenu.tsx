// components/SlidingCategories.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import type SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { IGetCategories } from '@/interface/product/category.interface';
import { useSession } from 'next-auth/react';
import { api } from '@/helper/api';

export default function SlidingCategories() {
  const router = useRouter();
  const pathname = usePathname();
  const swiperRef = useRef<SwiperCore>();
  const [allCategories, setAllCategories] = useState<IGetCategories[]>([]);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await api(`category/all`, 'GET', {});
        setAllCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };

  // Get current category slug from URL
  const currentCategoryId = pathname.split('/')[2];

  return (
    <div className="relative px-4 pb-6 bg-primaryBackground">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <Swiper
            modules={[Navigation, Scrollbar]}
            spaceBetween={16}
            slidesPerView={'auto'}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              640: {
                slidesPerView: 4,
              },
              768: {
                slidesPerView: 5,
              },
              1024: {
                slidesPerView: 7,
              },
            }}
            className="!py-2"
          >
            {allCategories.map((category) => (
              <SwiperSlide key={category.id} className="!w-auto">
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex gap-2 items-center justify-center px-4 py-2 rounded-full transition-all duration-200 min-w-[100px]
                    ${
                      currentCategoryId === category.id
                        ? 'bg-primaryGreen text-white'
                        : 'bg-white hover:bg-primaryGreen hover:text-white'
                    }`}
                >
                  <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Previous categories"
          >
            <span className="sr-only">Previous</span>
            &lt;
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Next categories"
          >
            <span className="sr-only">Next</span>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
