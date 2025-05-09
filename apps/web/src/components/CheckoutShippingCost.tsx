'use client';
import { useState, useEffect } from 'react';
import { useShipping } from '@/hooks/useShipping';
import { useSession } from 'next-auth/react';
import { getUserAddresses } from '@/helpers/handlers/auth';
import { getAvailableCouriers, getProvinces } from '@/helpers/biteship';

export default function CheckoutShipping() {
  const { data: session } = useSession();
  const [couriers, setCouriers] = useState<any[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<any>(null);
  const [weight, setWeight] = useState(1000);
  const { shippingOptions, isLoading, error, calculateShipping } =
    useShipping();
  const [selectedCourierName, setSelectedCourierName] = useState<any>(null);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');

  const availableCouriers = [
    { id: 1, name: 'Gojek' },
    { id: 2, name: 'Grab' },
    { id: 3, name: 'Paxel' },
  ];

  useEffect(() => {
    const fetchCouriers = async () => {
      if (session?.user.email) {
        const data = await getAvailableCouriers();
        console.log('APAKAH ADA DATAA BITESHIP', data);

        const acceptedData = data.filter(
          (courier: any) =>
            courier.shipment_duration_unit === 'hours' &&
            (courier.courier_name === 'Gojek' ||
              courier.courier_name === 'Grab' ||
              courier.courier_name === 'Paxel'),
        );
        console.log('COURIERS', acceptedData);
        setCouriers(acceptedData);
      }
    };
    fetchCouriers();
  }, [session]);

  useEffect(() => {
    if (selectedCourierName && couriers.length > 0) {
      const services = couriers.filter(
        (courier) => courier.courier_name === selectedCourierName,
      );
      console.log('SELECTED Courier name', selectedCourierName, services);
      setFilteredServices(services);
      console.log('SELECTED FILTER SERVICE', filteredServices);
      setSelectedCourier(null);
    }
  }, [selectedCourierName, couriers]);

  const handleCourierNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourierName(e.target.value);
    setSelectedService('');
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedService = filteredServices.find(
      (service) => service.courier_service_name === e.target.value,
    );
    setSelectedService(selectedService.courier_service_name);
  };

  const handleCalculateShipping = () => {
    if (selectedCourier?.city_id) {
      calculateShipping('151', '501', weight);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Options</h2>

      <div className="flex gap-4">
        <select
          value={selectedCourierName || ''}
          onChange={handleCourierNameChange}
          className="border p-2 rounded-lg text-sm"
        >
          <option value="" className="text-sm">
            Select Courier
          </option>
          {availableCouriers.map((courier) => (
            <option key={courier.id} value={courier.name}>
              {courier.name}
            </option>
          ))}
        </select>

        <select
          value={selectedService}
          onChange={handleServiceChange}
          className="border p-2 rounded-lg text-sm"
          disabled={!selectedCourierName}
        >
          <option value="" className="text-sm">
            Select Service
          </option>
          {filteredServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.courier_service_name}
            </option>
          ))}
        </select>

        <div>Harga</div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
