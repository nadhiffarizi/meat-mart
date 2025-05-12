'use client';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { toast } from 'sonner';
import { useState } from 'react';
import { E_StoreStatus } from '@prisma/client';
import { createStore, updateStore } from '@/helpers/handlers/store';
import { StoreWithAdmin } from '@/app/interfaces/store.interface';
import { X } from 'lucide-react';
import { StoreFormSchema } from '@/models/auth.model';
import { useLocations } from '@/hooks/useLocations';

interface StoreFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeData?: StoreWithAdmin | null;
  onSuccess: () => void;
  users: any[];
  email: string;
}

export default function StoreForm({
  open,
  onOpenChange,
  storeData,
  onSuccess,
  users,
  email,
}: StoreFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    provinces,
    cities,
    districts,
    loadingTime,
    selectedProvince,
    selectedCity,
    setSelectedProvince,
    setSelectedCity,
  } = useLocations();

  const initialValues: Partial<StoreWithAdmin> = {
    name: storeData?.name || '',
    status: storeData?.status || E_StoreStatus.BRANCH,
    address: storeData?.address || '',
    province: storeData?.province || '',
    province_id: storeData?.province_id || '',
    city: storeData?.city || '',
    city_id: storeData?.city_id || '',
    district: storeData?.district || '',
    district_id: storeData?.district_id || '',
    postal_code: storeData?.postal_code || '',
    storeadmin_id: storeData?.storeadmin_id || '',
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: 'province' | 'city' | 'district',
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const { value } = e.target;

    if (type === 'province') {
      const selectedProvince = provinces.find((p) => p.code === value);
      setFieldValue('province', selectedProvince?.name || '');
      setFieldValue('province_id', value);
      setFieldValue('city', '');
      setFieldValue('city_id', '');
      setFieldValue('district', '');
      setFieldValue('district_id', '');
      setSelectedProvince(value);
      setSelectedCity('');
      console.log('PROVINSI', selectedProvince);
    } else if (type === 'city') {
      const selectedCity = cities.find((c) => c.code === value);
      setFieldValue('city', selectedCity?.name || '');
      setFieldValue('city_id', value);
      setFieldValue('district', '');
      setFieldValue('district_id', '');
      setSelectedCity(value);
      console.log('CITY', selectedCity);
    } else if (type === 'district') {
      const selectedDistrict = districts.find((d) => d.code === value);
      setFieldValue('district', selectedDistrict?.name || '');
      setFieldValue('district_id', value);
      console.log('KAB', setFieldValue);
    }
  };

  const handleSubmit = async (
    values: Partial<StoreWithAdmin>,
    { setSubmitting }: FormikHelpers<Partial<StoreWithAdmin>>,
  ) => {
    try {
      if (storeData) {
        await updateStore(email, storeData.id, values as StoreWithAdmin);
        toast.success('Store updated successfully');
      } else {
        await createStore(values as Omit<StoreWithAdmin, 'id'>, email);
        toast.success('Store created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving store:', error);
      toast.error('Failed to save store');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {storeData ? 'Edit Store' : 'Create New Store'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={15} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={StoreFormSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Store Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama Toko*
                  </label>
                  <Field
                    name="name"
                    id="name"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Store Type */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipe Toko*
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={values.status}
                    onChange={(e) => setFieldValue('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  >
                    {Object.values(E_StoreStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Alamat*
                </label>
                <Field
                  name="address"
                  id="address"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Province */}
                <div>
                  <label
                    htmlFor="province_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Provinsi*
                  </label>
                  <select
                    name="province_id"
                    id="province_id"
                    value={values.province_id}
                    onChange={(e) => {
                      const value = e.target.value;
                      const selectedProvince = provinces.find(
                        (p) => p.code === value,
                      );
                      setFieldValue('province_id', value);
                      setFieldValue('province', selectedProvince?.name || '');
                      setFieldValue('city_id', '');
                      setFieldValue('city', '');
                      setFieldValue('district_id', '');
                      setFieldValue('district', '');
                      setSelectedProvince(value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  <Field type="hidden" name="province" />
                  <ErrorMessage
                    name="province"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kabupaten/Kota*
                  </label>
                  <select
                    name="city_id"
                    id="city_id"
                    value={values.city_id}
                    onChange={(e) => {
                      const value = e.target.value;
                      const selectedCity = cities.find((c) => c.code === value);
                      setFieldValue('city_id', value);
                      setFieldValue('city', selectedCity?.name || '');
                      setFieldValue('district_id', '');
                      setFieldValue('district', '');
                      setSelectedCity(value);
                    }}
                    disabled={!values.province_id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
                  >
                    <option value="">Pilih Kabupaten/Kota</option>
                    {cities
                      .filter(
                        (city) => city.province_code === values.province_id,
                      )
                      .map((city) => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                  </select>
                  <Field type="hidden" name="city" />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* District */}
                <div>
                  <label
                    htmlFor="district_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kecamatan*
                  </label>
                  <select
                    name="district_id"
                    id="district_id"
                    value={values.district_id}
                    onChange={(e) => {
                      const value = e.target.value;
                      const selectedDistrict = districts.find(
                        (d) => d.code === value,
                      );
                      setFieldValue('district_id', value);
                      setFieldValue('district', selectedDistrict?.name || '');
                    }}
                    disabled={!values.city_id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50"
                  >
                    <option value="">Pilih Kecamatan</option>
                    {districts
                      .filter(
                        (district) => district.city_code === values.city_id,
                      )
                      .map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                  </select>
                  <Field type="hidden" name="district" />
                  <ErrorMessage
                    name="district"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="postal_code"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kode Pos*
                  </label>
                  <Field
                    name="postal_code"
                    id="postal_code"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  />
                  <ErrorMessage
                    name="postal_code"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Store Admin */}
              <div>
                <label
                  htmlFor="storeadmin_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Store Admin*
                </label>
                <select
                  name="storeadmin_id"
                  id="storeadmin_id"
                  value={values.storeadmin_id}
                  onChange={(e) =>
                    setFieldValue('storeadmin_id', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="">Select store admin</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name} (${user.email})`
                        : user.email}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  name="storeadmin_id"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="text-sm px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-sm px-4 py-2 bg-orangeAccent text-white rounded-full hover:opacity-55 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {storeData ? 'Update Store' : 'Create Store'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
