'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/helper/api';
import EditStoreFormDeleteAlert from './alerts/EditStoreFormDeleteAlert';
import EditStoreFormAlert from './alerts/EditStoreFormAlert';
import Image from 'next/image';
import Link from 'next/link';
import IGetDashboardProducts from '@/interface/dashboard/product.dashboard.interface';
import { StoreWithAdmin } from '@/interface/store/store.interface';
import {
  getStoreAdmin,
  getStoreById,
  updateStore,
} from '@/helper/store/store.helper';

const validationSchema = Yup.object({
  name: Yup.string().required('Please enter a name for this store.'),
  status: Yup.string().required(''),
  address: Yup.string().required('Please enter an address for this store.'),
  province: Yup.string().required('Please enter a province for this store.'),
  city: Yup.string().required('Please enter a city for this store.'),
  district: Yup.string().required('Please enter a district for this store.'),
  storeadmin_id: Yup.string().required('Please select a store admin'),
});

function EditStoreForm({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [storeDetails, setStoreDetails] = useState<StoreWithAdmin>();
  const [admin, setAdmin] = useState<any[]>([]);

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      const numericValue = value === '' ? '' : Math.max(0, Number(value));
      formik.setFieldValue('postal_code', numericValue.toString());
    }
  };

  useEffect(() => {
    if (session?.user.role === 'ADMIN') setDisabled(true);
  }, [session]);

  useEffect(() => {
    async function getAdmins() {
      // console.log('FETCH PRODUCT', session?.user.email);
      try {
        const data = await getStoreAdmin(session?.user.email);
        setAdmin(data);
      } catch (error: any) {
        console.log(error);
      }
    }
    getAdmins();
  }, [session?.user.email, session]);

  useEffect(() => {
    async function getStoreData() {
      try {
        const data = await getStoreById(session?.user.email, id);
        console.log(data);
        setStoreDetails(data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getStoreData();
  }, [id, session?.user.email]);

  const initialValues: Partial<StoreWithAdmin> = {
    name: storeDetails?.name,
    status: storeDetails?.status,
    address: storeDetails?.address,
    province: storeDetails?.province,
    city: storeDetails?.city,
    district: storeDetails?.district,
    postal_code: storeDetails?.postal_code,
    storeadmin_id: storeDetails?.storeadmin_id,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setDisabled(true);
        console.log('SEBELUM SUBMITTT', values as StoreWithAdmin);

        const response = await updateStore(
          session?.user.email,
          id,
          values as StoreWithAdmin,
        );
        if (response) {
          router.push(`/dashboard/stores/${id}/edit?status=successful`);
        } else {
          toast.error('Something went wrong!');
          setDisabled(false);
        }
      } catch (error: any) {
        toast.error(error.message || 'Something went wrong!');
        setDisabled(false);
      }
    },
  });
  return (
    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
      <EditStoreFormAlert status={status} />
      <div className="flex flex-col gap-2">
        <label htmlFor="name">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          placeholder=""
          value={formik.values.name}
          onChange={formik.handleChange}
          disabled={disabled}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status">
          Tipe Toko <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          id="status"
          value={formik.values.status}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
        >
          <option value="BRANCH">BRANCH</option>
          <option value="CENTRAL">CENTRAL</option>
        </select>
        {formik.touched.status && formik.errors.status && (
          <div className="text-red-500 text-sm">{formik.errors.status}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address">
          Alamat Toko <span className="text-red-500">*</span>
        </label>
        <input
          name="address"
          id="address"
          type="text"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.address && formik.errors.address && (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.address}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="province">
          Provinsi <span className="text-red-500">*</span>
        </label>
        <input
          name="province"
          id="province"
          type="text"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          value={formik.values.province}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.province && formik.errors.province && (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.province}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="city">
          Kota/Kabupaten <span className="text-red-500">*</span>
        </label>
        <input
          name="city"
          id="city"
          type="text"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.city && formik.errors.city && (
          <div className="text-red-500 text-xs mt-1">{formik.errors.city}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="district">
          Kecamatan <span className="text-red-500">*</span>
        </label>
        <input
          name="district"
          id="district"
          type="text"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          value={formik.values.district}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.district && formik.errors.district && (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.district}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="postal_code">
          Kode Pos <span className="text-red-500">*</span>
        </label>
        <input
          name="postal_code"
          id="postal_code"
          type="text"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          value={formik.values.postal_code}
          onChange={handlePostalChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.postal_code && formik.errors.postal_code && (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.postal_code}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="storeadmin_id">
          Store Admin <span className="text-red-500">*</span>
        </label>
        <select
          name="storeadmin_id"
          id="storeadmin_id"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
          value={formik.values.storeadmin_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select store admin</option>
          {admin &&
            admin.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name} (${user.email})`
                  : user.email}
              </option>
            ))}
        </select>
        {formik.touched.storeadmin_id && formik.errors.storeadmin_id && (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.storeadmin_id}
          </div>
        )}
      </div>

      <Button
        variant="default"
        size={'lg'}
        className={
          disabled
            ? ' bg-secondaryText px-4 py-2  text-base'
            : ' bg-orangeAccent  px-4 py-2  text-base'
        }
        disabled={disabled}
        type="submit"
      >
        {disabled ? 'Saving Changes' : 'Save Changes'}
      </Button>

      <EditStoreFormDeleteAlert
        id={id}
        disabled={disabled}
        setDisabled={setDisabled}
      />

      <Button
        variant="link"
        className=" text-primaryText px-4 py-2 text-base "
        onClick={() => {
          router.push('/dashboard/stores');
        }}
        type="button"
      >
        Cancel
      </Button>
      <Toaster richColors className=""></Toaster>
    </form>
  );
}

export default EditStoreForm;
