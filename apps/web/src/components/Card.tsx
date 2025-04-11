import Image from 'next/image';
import Link from 'next/link';
import { ICard } from '../interfaces/card.interface';

export function Card(props: ICard) {
  return (
    <Link href={'/'}>
      <div className="w-full  max-w-[230px] bg-primaryIcon rounded-lg shadow-xl">
        <div className=" w-full ">
          <div className="w-full px-2 py-2 rounded-xl">
            <div className=" relative">
              <Image
                width={216}
                height={100}
                className=" w-full rounded-lg h-[150px] lg:h-[150px] object-cover"
                // src={props.image_src}
                src={'/templateproduct.png'}
                alt="product-image"
              />
              <Image
                width={60}
                height={60}
                alt=""
                className={`w-[45px] h-[45px] absolute right-[15%] top-[10%] 
                  ${!(props.stock == 0) ? 'hidden' : 'block'} `}
                src="/sold-icon.png"
              />
            </div>
          </div>

          <div className="px-2 md:px-5 mt-4 flex flex-col text-sm md:text-[16px]">
            <b className="h-4 md:h-6 w-full ">{props.name}</b>
            <p className="mt-1 md:mt-0 h-4 md:h-6 mb-2 w-full overflow-hidden text-xs md:text-sm text-gray-500">
              /pack
            </p>
            <div className="flex justify-between items-center mb-4 md:mb-4">
              <b className="text-[#159953] overflow-hidden">
                {props.price == 0
                  ? 'Free'
                  : `IDR ${Number(props.price).toLocaleString('id-ID')}`}
              </b>{' '}
              <button
                className={
                  'h-8 w-8 md:h-8 md:w-8 font-semibold bg-orangeAccent rounded-full text-xl md:text-2xl hover:text-white '
                }
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
