import Image from 'next/image';
import Link from 'next/link';

export function Card() {
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
                //   !(stock == 0) ? 'hidden' : 'block'
                
                 `}
                src="/sold-icon.png"
              />
            </div>
          </div>

          <div className="px-2 md:px-5 mt-4 flex flex-col text-sm md:text-xl">
            <b className="h-6 md:h-8 w-full overflow-hidden ">Ayam Kampung</b>
            <p className="h-6 md:h-8 mb-2 w-full overflow-hidden text-xs md:text-sm text-gray-500">
              /pack
            </p>
            <div className="flex justify-between items-center mb-4 md:mb-4">
              <b className="text-[#159953] overflow-hidden">
                {/* {props.price == 0
                ? 'Free'
                : `IDR ${Number(props.price).toLocaleString('id-ID')}`} */}
                Rp {Number(70000.0).toLocaleString('id-ID')}
              </b>{' '}
              <button className="h-6 w-6 md:h-8 md:w-8 font-semibold bg-orangeAccent rounded-full mr-2">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
