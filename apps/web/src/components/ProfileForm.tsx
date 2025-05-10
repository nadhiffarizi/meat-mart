'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IProfile } from '@/interface/user/user.interface';
import { profile } from 'console';

interface ProfileFormProps {
  profil: IProfile;
}

export default function ProfileForm(profil: IProfile) {
  const { update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profil.first_name || '',
    lastName: profil.last_name || '',
    email: profil.email || '',
    phoneNumber: profil.phone_number || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({
        firstName: profil.first_name || '',
        lastName: profil.last_name || '',
        email: profil.email || '',
        phoneNumber: profil.phone_number || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("New passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      await update({
        ...profil,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* First Name */}
        <div className="sm:col-span-3">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {profil.first_name || 'Not provided'}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="sm:col-span-3">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {profil.last_name || 'Not provided'}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="sm:col-span-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <p className="mt-1 text-sm text-gray-900">{profil.email}</p>
          {isEditing && (
            <p className="mt-1 text-xs text-gray-500">
              To change your email, please contact support.
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="sm:col-span-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone number
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {profil.phone_number || 'Not provided'}
            </p>
          )}
        </div>

        {isEditing && (
          <>
            <div className="sm:col-span-4">
              <h3 className="text-sm font-medium text-gray-700">
                Change Password
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Leave blank to keep current password
              </p>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={toggleEditing}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={toggleEditing}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Edit Profile
          </button>
        )}
      </div>
    </form>
  );
}
