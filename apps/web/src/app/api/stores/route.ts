// import { NextRequest, NextResponse } from 'next/server';
// import StoreService from '@/services/store.service';

// export async function GET(req: NextRequest) {
//   try {
//     const stores = await StoreService.getList();
//     return NextResponse.json(stores);
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const storeData = await req.json();
//     const newStore = await StoreService.createStore(storeData);
//     return NextResponse.json(newStore);
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     );
//   }
// }
