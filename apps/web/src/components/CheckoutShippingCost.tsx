'use client';
import { useState, useEffect } from 'react';
import { getShippingCost } from '@/helpers/handlers/biteship';
import { Dialog } from '@headlessui/react';

interface ShippingOption {
  courier_name: string;
  courier_service_name: string;
  price: number;
  duration: string;
  description: string;
  [key: string]: any;
}

interface CheckoutShippingProps {
  destination_latitude: string;
  destination_longitude: string;
}

export default function CheckoutShipping({
  destination_latitude,
  destination_longitude,
}: CheckoutShippingProps) {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchShippingCost = async () => {
      if (!destination_latitude || !destination_longitude) {
        setShippingOptions([]);
        setSelectedOption(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const originLat = '-6.9556657';
        const originLng = '107.6736216';

        const params = {
          origin_latitude: originLat,
          origin_longitude: originLng,
          destination_latitude,
          destination_longitude,
          couriers: 'grab,gojek,paxel',
          items: [
            {
              name: 'Sample Product',
              description: '',
              length: 10,
              width: 10,
              height: 10,
              weight: 1000,
              value: 100000,
              quantity: 1,
            },
          ],
        };

        const response = await getShippingCost(params);
        if (response.success && response.pricing) {
          setShippingOptions(response.pricing);
          setSelectedOption(response.pricing[0] || null);
        }
      } catch (error) {
        console.error('Error fetching shipping rates:', error);
        setError('Failed to load shipping options. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShippingCost();
  }, [destination_latitude, destination_longitude]);

  const handleOptionSelect = (option: ShippingOption) => {
    setSelectedOption(option);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-semibold mb-4">Shipping Options</h2>

      {isLoading ? (
        <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      ) : selectedOption ? (
        <>
          <div
            className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primaryGreen transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">
                  {selectedOption.courier_name} -{' '}
                  {selectedOption.courier_service_name}
                </h3>
                <p className="text-sm text-gray-600 ">
                  {selectedOption.duration} • Rp{' '}
                  {selectedOption.price.toLocaleString('id-ID')}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold mb-4">
                  Select Shipping Method
                </h2>

                <div className="space-y-3 max-h-[60vh]  overflow-y-auto">
                  {shippingOptions.map((option) => (
                    <div
                      key={`${option.courier_code}-${option.courier_service_code}`}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors  ${
                        selectedOption?.courier_service_code ===
                        option.courier_service_code
                          ? ' bg-green-100'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      <div className="flex justify-between items-start ">
                        <div>
                          <h3 className="font-medium">
                            {option.courier_name} -{' '}
                            {option.courier_service_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {option.description}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Estimated delivery: {option.duration}
                          </p>
                        </div>
                        <div className="font-semibold min-w-[90px]">
                          Rp {option.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Dialog>
        </>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p>No shipping options available. Please select a valid address.</p>
        </div>
      )}
    </div>
  );
}
