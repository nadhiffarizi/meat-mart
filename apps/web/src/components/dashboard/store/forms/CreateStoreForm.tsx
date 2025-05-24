'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Toaster, toast } from 'sonner';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ReactivateStoreFormAlert from './alerts/ReactivateStoreFormAlert';
import { createStore, getStoreAdmin } from '@/helper/store/store.helper';
import { StoreWithAdmin } from '@/interface/store/store.interface';
import AddStoreFormAlert from './alerts/AddStoreFormAlert';

const validationSchema = Yup.object({
  name: Yup.string().required('Please enter a name for this store.'),
  status: Yup.string().required(''),
  address: Yup.string().required('Please enter an address for this store.'),
  province: Yup.string().required('Please enter a province for this store.'),
  city: Yup.string().required('Please enter a city for this store.'),
  district: Yup.string().required('Please enter a district for this store.'),
  storeadmin_id: Yup.string().required('Please select a store admin'),
});

function CreateStoreForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const { data: session, update } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [openCategoryRecovery, setOpenCategoryRecovery] = useState(false);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        if (status === 'loading') return;

        if (!session?.user?.email) {
          toast.error('No user email found in session');
          setLoading(false);
          return;
        }
        const response = await getStoreAdmin(session?.user.email);
        console.log('Respon ADMINUSER', response);
        setAdminUsers(response);
      } catch (error) {
        console.error('Error fetching admin users:', error);
        setAdminUsers([]);
      }
    };
    fetchAdminUsers();
  }, [session?.user.email]);

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      const numericValue = value === '' ? '' : Math.max(0, Number(value));
      formik.setFieldValue('postal_code', numericValue.toString());
    }
  };

  const initialValues: Partial<StoreWithAdmin> = {
    name: '',
    status: 'BRANCH',
    address: '',
    province: '',
    city: '',
    district: '',
    postal_code: '',
    storeadmin_id: '',
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setDisabled(true);

        await createStore(
          values as Omit<StoreWithAdmin, 'id'>,
          session?.user.email,
        );
        toast.success('Store created!');
        router.push('/dashboard/stores');
      } catch (error: any) {
        toast.error(error.message || 'Something went wrong!');
        setDisabled(false);
      }
    },
  });
  return (
    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
      <AddStoreFormAlert status={status} />
      <ReactivateStoreFormAlert
        name={formik.values.name as string}
        setDisabled={setDisabled}
        setOpenCategoryRecovery={setOpenCategoryRecovery}
        openCategoryRecovery={openCategoryRecovery}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="name">
          Nama Toko <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="bg-[#F7FBFF] w-full rounded-md py-2 px-4 border border-[#D4D7E3]"
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
          {adminUsers &&
            adminUsers.map((user) => (
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
          disabled || formik.isSubmitting
            ? ' bg-secondaryText px-4 py-2 mt-4 text-base'
            : ' bg-orangeAccent  px-4 py-2 mt-4 text-base'
        }
        disabled={disabled || formik.isSubmitting}
        type="submit"
        onClick={() => {}}
      >
        {disabled ? 'Adding Store' : 'Add Store'}
      </Button>
      <Button
        variant="link"
        className=" text-primaryText px-4 py-2 text-base "
        onClick={() => {
          router.push('/dashboard/stores');
        }}
      >
        Cancel
      </Button>
      <Toaster richColors className=""></Toaster>
    </form>
  );
}

export default CreateStoreForm;
