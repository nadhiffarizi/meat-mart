import ProfileForm from '@/components/ProfileForm';
import { profileSideMenu } from '@/helper/user/user.helper';
import { IProfile } from '@/interface/user/user.interface';
import { Camera, CameraAltRounded } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import Link from 'next/link';
import React from 'react';

type Props = {};
const profile: IProfile = {
  id: 1,
  first_name: 'Ratih',
  last_name: 'Julistina',
  password: 'Ratih1212',
  email: 'ratih.julistina95@gmail.com',
  phone_number: '',
  is_verified: true,
};

const subcategories = profileSideMenu;
function page({}: Props) {
  return (
    <div className="w-[70%] mx-auto px-4 py-8 bg-red rounded-sm -mt-96">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <nav>
              <ul className="space-y-2">
                {subcategories.map((subcat) => (
                  <li key={subcat.id}>
                    <Link
                      href={`${subcat.slug}`}
                      className="block px-3 py-2 rounded hover:bg-gray-100 transition"
                    >
                      {subcat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900">
                Profil Saya
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Kelola informasi profil Anda untuk mengontrol, melindungi dan
                mengamankan akun
              </p>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-8 sm:p-10">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <Avatar sx={{ width: 100, height: 100 }} />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-orangeAccent rounded-full p-1 text-white hover:bg-primaryGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <CameraAltRounded />
                    </button>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    Ratih Julistina
                  </h2>
                  <p className="text-sm text-gray-500">ratih julistina</p>
                </div>
                {/* <ProfileForm  /> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default page;
