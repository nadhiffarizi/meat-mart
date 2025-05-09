'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { E_Role } from '@prisma/client';
import { toast, Toaster } from 'sonner';
import { StoreWithAdmin } from '@/app/interfaces/store.interface';
import StoreForm from '@/components/dashboard/store/store-form';
import {
  deleteStore,
  getListStore,
  getStoreAdmin,
} from '@/helpers/handlers/store';
import {
  DeleteIcon,
  EditIcon,
  Pen,
  Pencil,
  PencilIcon,
  Plus,
  Trash,
} from 'lucide-react';
import { EditNotificationsOutlined } from '@mui/icons-material';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';

export default function StorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stores, setStores] = useState<StoreWithAdmin[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreWithAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (session?.user.email == E_Role.SUPER_ADMIN) {
      toast.error('Cannot Access the stores, Super Admin only', {
        duration: 3000,
        onAutoClose: () => setShouldRedirect(true),
      });
      return;
    }
    fetchStores();
    fetchAdminUsers();
  }, [session]);

  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, router]);

  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const data = await getListStore(session?.user.email);
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const response = await getStoreAdmin(session?.user.email);

      setAdminUsers(response);
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

  const handleEdit = (store: StoreWithAdmin) => {
    setEditingStore(store);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingStore(null);
    fetchStores();
    toast.success(`Store ${editingStore ? 'updated' : 'created'} successfully`);
  };
  const handleDelete = async (id: string) => {
    try {
      setStores((prev) => prev.filter((store) => store.id !== id));
      const response = await deleteStore(session?.user.email, id);
      console.log('DELETED STORE', response);
      toast.success('Store deleted successfully');
      fetchStores();
      //setStores(response);
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error('Failed to delete store');
    }
  };

  if (session?.user.role !== E_Role.SUPER_ADMIN) {
    return (
      <>
        <Toaster
          position="top-center"
          richColors
          theme="light"
          toastOptions={{
            style: {
              background: '#fee2e2',
              color: '##b91c1c',
              border: '1px solid ##fca5a5',
              fontSize: '14px',
            },
            classNames: {
              error: 'bg-red-100 text-red-800 border-red-200',
              success: 'bg-green-100 text-green-800 border-green-200',
            },
          }}
        />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Store Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primaryGreen hover:opacity-55 text-white px-4 py-2 rounded-full flex items-center"
        >
          <span className="mr-2">
            <Plus size={15} />
          </span>{' '}
          Add Store
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orangeAccent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100 ">
              <tr className=" ">
                <th className="py-3 px-4 text-left font-semibold ">
                  Nama Toko
                </th>
                <th className="py-3 px-4 text-left font-semibold">Tipe</th>
                <th className="py-3 px-4 text-left font-semibold">Lokasi</th>
                <th className="py-3 px-4 text-left font-semibold">Admin</th>
                <th className="py-3 px-4 text-left font-semibold">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50 text-sm">
                  <td className="py-3 px-4">{store.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        store.status === 'CENTRAL'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{store.address}</div>
                      <div className="text-sm text-gray-500">
                        {store.district}, {store.city}, {store.province}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {store.storeadmin.first_name
                      ? `${store.storeadmin.first_name} ${store.storeadmin.last_name}`
                      : store.storeadmin.email}
                  </td>
                  <td className="py-3 px-4 flex gap-2 items-center mt-2">
                    <button
                      onClick={() => handleEdit(store)}
                      className="text-orangeAccent  hover:opacity-55"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      className="text-orangeAccent  hover:opacity-55"
                    >
                      <Delete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StoreForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingStore(null);
        }}
        storeData={editingStore}
        onSuccess={handleFormSuccess}
        users={adminUsers}
        email={session?.user.email || ''}
      />
    </div>
  );
}
