import AddressManager from '@/components/AddressManager';
import ChooseAddressCheckout from '@/components/ChooseAddressCheckout';
import CheckoutShipping from '@/components/CheckoutShippingCost';

export default function Page() {
  return (
    <div className="max-w7-xl lg:w-[70%] m-auto px-4 md:px-6 lg:px-0 mb-5">
      Checkout
      <ChooseAddressCheckout />
      <div></div>
    </div>
  );
}
