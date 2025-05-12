import { useState, useEffect } from 'react';
import { getProvinces, getCities, getDistricts } from '@/helpers/location';
import { ErrorMessage } from 'formik';

export function useLocations() {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingTime, setLoadingTime] = useState({
    provinces: false,
    cities: false,
    districts: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingTime((prev) => ({ ...prev, provinces: true }));
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load provinces',
        );
      } finally {
        setLoadingTime((prev) => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedProvince) return;

      setLoadingTime((prev) => ({ ...prev, cities: true }));
      setCities([]);
      setDistricts([]);
      setSelectedCity('');

      try {
        const data = await getCities(selectedProvince);

        setCities(data);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load cities',
        );
      } finally {
        setLoadingTime((prev) => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
  }, [selectedProvince]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedCity) return;

      setLoadingTime((prev) => ({ ...prev, districts: true }));

      setDistricts([]);

      try {
        console.log('SELECTED CITY', selectedCity);
        const data = await getDistricts(selectedCity);
        console.log('SETELAH FETCH', data);
        setDistricts(data);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to load districts',
        );
      } finally {
        setLoadingTime((prev) => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, [selectedCity]);

  return {
    provinces,
    cities,
    districts,
    loadingTime,
    errorMessage,
    setSelectedProvince,
    setSelectedCity,
    selectedProvince,
    selectedCity,
  };
}
