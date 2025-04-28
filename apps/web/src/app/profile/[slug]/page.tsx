'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { IProfile } from '@/interfaces/card.interface';
import {
  getProfile,
  updateProfileImage,
  updateUser,
} from '@/helpers/handlers/auth';
import Link from 'next/link';
import { Avatar } from '@mui/material';
import { CameraAltRounded } from '@mui/icons-material';
import Image from 'next/image';
import { Cloudinary } from '@cloudinary/url-gen';
import { usePathname, useRouter } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});

interface profileSlug {
  params: {
    slug: string;
  };
}

const subcategories = [
  { id: '1', name: 'Profil', slug: 'profil' },
  { id: '2', name: 'Alamat', slug: 'alamat' },
];

export default function ProfilePage({ params }: profileSlug) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const currentSlug = pathname.split('/')[2];
  const profileCat = subcategories.find((cat) => cat.slug === params.slug);

  useEffect(() => {
    async function loadProfile() {
      try {
        if (status === 'authenticated' && session.user?.email) {
          const data = await getProfile(session.user.email);
          console.log('GET PROFILE', data);
          setProfile(data);
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [status, session]);

  const handleCameraClick = () => {
    setShowModal(true);

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (
      !file.type.match('image/jpeg') &&
      !file.type.match('image/png') &&
      !file.type.match('image/gif') &&
      !file.type.match('image/jpg')
    ) {
      setError('Please upload a JPG or PNG or GIF image');
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      setError('File size should be less than 1MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      console.log('MENCOBA UPLOAD TO CL');
      setUploading(true);
      setError('');
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      console.log('cloudName', cloudName);

      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      console.log('cloudName', uploadPreset);
      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing');
      }
      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const cloudinaryResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      console.log('Uploading to:', uploadUrl);
      const cloudinaryData = await cloudinaryResponse.json();

      if (cloudinaryData.secure_url) {
        // Update profile image in database
        if (session?.user?.email) {
          const updatedProfile = await updateProfileImage(
            session.user.email,
            cloudinaryData.secure_url,
          );

          // Update local state
          setProfile(updatedProfile);
          setImagePreview(cloudinaryData.secure_url);

          window.location.reload();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setShowModal(false);
      // router.refresh();
    }
  };

  const handleSubmit = async (updatedData: any) => {
    console.log('APAKAH AKU DIPANGGIL?', updatedData);
    try {
      await updateUser(updatedData);
      // router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="text-center py-8 h-screen animate-pulse">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 screen">{error}</div>;
  }

  // if (!profile?.is_verified) {
  //   return (
  //     <div className="text-center py-8 h-screen">
  //       We've sent you a verification email. Please, verify your email
  //     </div>
  //   );
  // }

  return (
    <div className="w-[70%] mx-auto pb-4 bg-red rounded-sm ">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Upload Profile Image</h3>
            <p className="mb-4">
              Please select a max 1MB JPG, JPEG, GIF or PNG image
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png"
              className="hidden"
            />

            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-orangeAccent h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-orangeAccent text-white rounded-md hover:bg-primaryGreen"
                disabled={uploading}
              >
                Choose Image
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="text-left mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{`${currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1)} Saya`}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {` Kelola informasi ${currentSlug} Anda untuk mengontrol, melindungi dan
          mengamankan akun`}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <nav>
              <ul className="space-y-2">
                {subcategories.map((subcat) => (
                  <li key={subcat.id}>
                    <Link
                      href={`/profile/${subcat.slug}`}
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
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {currentSlug == 'profil' ? (
                <>
                  {' '}
                  <div className="px-6 py-8 sm:p-10">
                    <div className="flex flex-col items-center mb-8">
                      <div className="relative">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Profile"
                            height={80}
                            width={240}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <Avatar sx={{ width: 100, height: 100 }} />
                        )}
                        <button
                          type="button"
                          onClick={handleCameraClick}
                          className="absolute bottom-0 right-0 bg-orangeAccent rounded-full p-1 text-white hover:bg-primaryGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <CameraAltRounded />
                        </button>
                      </div>
                      {profile?.first_name && profile?.last_name && (
                        <h2 className="mt-4 text-xl font-semibold text-gray-900">
                          {`${profile?.first_name} ${profile?.last_name}`}
                        </h2>
                      )}
                      <h2 className="mt-4 text-xl font-semibold text-gray-900">
                        {' '}
                      </h2>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                      {profile && (
                        <ProfileForm
                          profile={profile}
                          onSubmit={handleSubmit}
                          onCancel={() => window.location.reload()}
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-6 py-8 sm:p-10">
                    <div className="flex flex-col items-center mb-8"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
