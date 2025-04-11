'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = [
  '/carousel/carousel1.png',
  '/carousel/carousel1.png',
  '/carousel/carousel1.png',
  '/carousel/carousel1.png',
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-7xl lg:w-[70%] h-40 md:h-52 lg:h-80 overflow-hidden rounded-lg mx-4 md:mx-8 lg:mx-auto">
      <div
        className="flex items-center transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full  flex-shrink-0">
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-44 rounded-lg md:h-52 lg:h-80 object-cover"
              width={1200}
              height={300}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
