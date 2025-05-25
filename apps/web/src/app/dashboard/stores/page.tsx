'use client';
import ViewCategories from '@/components/dashboard/categories/ViewCategories';
import ViewProducts from '@/components/dashboard/products/ViewProducts';
import ViewStores from '@/components/dashboard/store/ViewStore';
import { Alert } from '@/components/ui/alert';
import { PenOff } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

function Page() {
  const { data: session, update } = useSession();
  return (
    <div className="flex flex-col gap-8">
      {session?.user.role == 'ADMIN' && (
        <Alert variant={'affirmative'}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Read Only</div>
              <div className="text-sm">
                Click{' '}
                <Link href={'/dashboard'} className="underline">
                  here to return to dashboard.
                </Link>
              </div>
            </div>
            <PenOff className="w-8 h-8" />
          </div>
        </Alert>
      )}
      <div className="text-primaryText text-3xl font-semibold">
        Manage Stores
      </div>
      <div>
        <div>Manage Stores</div>
        <ViewStores />
      </div>
    </div>
  );
}

export default Page;

// 'use client';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { toast, Toaster } from 'sonner';
// import StoreForm from '@/components/dashboard/store/store-form';
// import {
//   deleteStore,
//   getListStore,
//   getStoreAdmin,
// } from '@/helper/store/store.helper';
// import { Plus } from 'lucide-react';
// import Edit from '@mui/icons-material/Edit';
// import Delete from '@mui/icons-material/Delete';
// import { StoreWithAdmin } from '@/interface/store/store.interface';

// export default function StorePage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [stores, setStores] = useState<StoreWithAdmin[]>([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingStore, setEditingStore] = useState<StoreWithAdmin | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [adminUsers, setAdminUsers] = useState<any[]>([]);
//   const [shouldRedirect, setShouldRedirect] = useState(false);

//   useEffect(() => {
//     console.log('AM I HERE', session?.user.email);
//     if (session?.user.role === 'SUPER_ADMIN') {
//       console.log('AM I HERE');
//       fetchStores();
//       fetchAdminUsers();
//     } else {
//       toast.error('Cannot Access the stores, Super Admin only', {
//         duration: 3000,
//         onAutoClose: () => setShouldRedirect(true),
//       });
//       return;
//     }
//   }, [session]);

//   useEffect(() => {
//     if (shouldRedirect) {
//       const timer = setTimeout(() => {
//         router.push('/dashboard');
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [shouldRedirect, router]);

//   const fetchStores = async () => {
//     console.log('MASUK FETCH STORE', session?.user.email);
//     setIsLoading(true);
//     try {
//   const data = await getListStore(session?.user.email);
//       console.log('Respon store', data);

//       setStores(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error fetching stores:', error);
//       toast.error('Failed to load stores');
//       setStores([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//

// const handleEdit = (store: StoreWithAdmin) => {
//   setEditingStore(store);
//   setIsFormOpen(true);
// };

//   const handleFormSuccess = () => {
//     setIsFormOpen(false);
//     setEditingStore(null);
//     fetchStores();
//     toast.success(`Store ${editingStore ? 'updated' : 'created'} successfully`);
//   };
//   const handleDelete = async (id: string) => {
//     console.log(
//       '===============================id store',
//       id,
//       session?.user.email,
//     );
//     try {
//       setStores((prev) => prev.filter((store) => store.id !== id));
//       const response = await deleteStore(session?.user.email, id);
//       console.log('DELETED STORE', response);
//       toast.success('Store deleted successfully');
//       fetchStores();
//     } catch (error) {
//       console.error('Error deleting store:', error);
//       toast.error('Failed to delete store');
//     }
//   };

//   if (session?.user.role !== 'SUPER_ADMIN') {
//     return (
//       <>
//         <Toaster
//           position="top-center"
//           richColors
//           theme="light"
//           toastOptions={{
//             style: {
//               background: '#fee2e2',
//               color: '##b91c1c',
//               border: '1px solid ##fca5a5',
//               fontSize: '14px',
//             },
//             classNames: {
//               error: 'bg-red-100 text-red-800 border-red-200',
//               success: 'bg-green-100 text-green-800 border-green-200',
//             },
//           }}
//         />
//         <div className="flex items-center justify-center h-screen">
//           <p className="text-gray-500">Redirecting to dashboard...</p>
//         </div>
//       </>
//     );
//   } else {
//     return (
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800">Store Management</h1>
//           <button
//             onClick={() => setIsFormOpen(true)}
//             className="bg-primaryGreen hover:opacity-55 text-white px-4 py-2 rounded-full flex items-center"
//           >
//             <span className="mr-2">
//               <Plus size={15} />
//             </span>{' '}
//             Add Store
//           </button>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orangeAccent"></div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             {stores.length === 0 ? (
//               <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg bg-gray-50">
//                 <p className="text-gray-500 mb-4">No stores available</p>
//                 <button
//                   onClick={() => setIsFormOpen(true)}
//                   className="bg-primaryGreen hover:opacity-55 text-white px-4 py-2 rounded-full flex items-center"
//                 >
//                   <span className="mr-2">
//                     <Plus size={15} />
//                   </span>{' '}
//                   Create Your First Store
//                 </button>
//               </div>
//             ) : (
//               <table className="min-w-full bg-white rounded-lg overflow-hidden">
//                 <thead className="bg-gray-100 ">
//                   <tr className=" ">
//                     <th className="py-3 px-4 text-left font-semibold ">
//                       Nama Toko
//                     </th>
//                     <th className="py-3 px-4 text-left font-semibold">Tipe</th>
//                     <th className="py-3 px-4 text-left font-semibold">
//                       Lokasi
//                     </th>
//                     <th className="py-3 px-4 text-left font-semibold">Admin</th>
//                     <th className="py-3 px-4 text-left font-semibold">
//                       Update
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {stores.map((store) => (
//                     <tr key={store.id} className="hover:bg-gray-50 text-sm">
//                       <td className="py-3 px-4">{store.name}</td>
//                       <td className="py-3 px-4">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             store.status === 'CENTRAL'
//                               ? 'bg-blue-100 text-blue-800'
//                               : 'bg-green-100 text-green-800'
//                           }`}
//                         >
//                           {store.status}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4">
//                         <div>
//                           <div className="font-medium">{store.address}</div>
//                           <div className="text-sm text-gray-500">
//                             {store.district}, {store.city}, {store.province}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4">
//                         {store.storeadmin.first_name
//                           ? `${store.storeadmin.first_name} ${store.storeadmin.last_name}`
//                           : store.storeadmin.email}
//                       </td>
//                       <td className="py-3 px-4 flex gap-2 items-center mt-2">
//                         <button
//                           onClick={() => handleEdit(store)}
//                           className="text-orangeAccent  hover:opacity-55"
//                         >
//                           <Edit />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(store.id)}
//                           className="text-orangeAccent  hover:opacity-55"
//                         >
//                           <Delete />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//  <StoreForm
//     open={isFormOpen}
//     onOpenChange={(open) => {
//       setIsFormOpen(open);
//       if (!open) setEditingStore(null);
//     }}
//     storeData={editingStore}
//     onSuccess={handleFormSuccess}
//     users={adminUsers}
//     email={session?.user.email || ''}
//   />
//       </div>
//     );
//   }
// }
