// components/SlidingCategories.tsx
'use client'; // Required for Swiper since it uses client-side features

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import type SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import Image from 'next/image';

const meatCategories = [
  { id: 1, name: 'All Meats', icon: '/categories/all_meat.png' },
  { id: 2, name: 'Beef', icon: '/categories/beef.png' },
  { id: 3, name: 'Chicken', icon: '/categories/chicken.png' },
  { id: 4, name: 'Lamb', icon: '/categories/lamb.png' },
  { id: 5, name: 'Seafood', icon: '/categories/seafood.png' },
  { id: 6, name: 'Processed', icon: '/categories/processed.png' },
  { id: 7, name: 'Organic', icon: '/categories/organic.png' },
  { id: 8, name: 'Exotic', icon: '/categories/exotic.png' },
  { id: 9, name: 'Pork', icon: '/categories/pork.png' },
  { id: 10, name: 'Special Offers', icon: '/categories/special_offer.png' },
];

export default function Categories() {
  const swiperRef = useRef<SwiperCore>();

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
            {meatCategories.map((category) => (
              <SwiperSlide key={category.id} className="!w-auto">
                <button
                  className={`flex gap-2 items-center justify-center pr-6 pl-1  py-1 rounded-full transition-all duration-200 bg-white
                    hover:bg-primaryGreen hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                    min-w-[120px]`}
                >
                  <span className="text-2xl md:text-4xl pt-2 rounded-full w-12 h-12 md:w-16 md:h-16 bg-primaryBackground">
                    <Image
                      src={category.icon}
                      alt={'icon'}
                      height={360}
                      width={120}
                      className="h-full w-full object-cover p-1 mb-1"
                    />
                  </span>
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
            &lt;
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Next categories"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
