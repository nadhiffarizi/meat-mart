'use client';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { useEffect, useState } from 'react';
import { IGetStores } from './app/interfaces/store.interface';
import { api } from './helpers/api';

export async function middleware(req: NextRequest) {
  const session = await auth();
  const url = req.nextUrl;
  const path = url.pathname;
  const role = session?.user?.role;

  if (session?.user && (path === '/register' || path === '/login')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Block unauthenticated users from dashboard
  if (!session?.user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Customers can't access dashboard
  if (role === 'CUSTOMER' && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect ADMIN and SUPER_ADMIN from root to dashboard
  if ((role === 'ADMIN' || role === 'SUPER_ADMIN') && path === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Restrict /dashboard/users routes to SUPER_ADMIN only
  if (path.startsWith('/dashboard/users') && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Restrict /dashboard/products
  if (
    path !== '/dashboard/inventories' &&
    path.startsWith('/dashboard/inventories') &&
    (path.includes('/edit') || path.includes('/edit')) &&
    role !== 'ADMIN'
  ) {
    // Let layout or page fetch correct store for redirection
    return NextResponse.redirect(new URL('/dashboard/inventories', req.url));
  }

  // Restrict /dashboard/discount routes to SUPER_ADMIN only
  if (path.startsWith('/dashboard/discounts') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Restrict /dashboard/products
  if (
    path !== '/dashboard/products' &&
    path.startsWith('/dashboard/products') &&
    role !== 'SUPER_ADMIN'
  ) {
    // Let layout or page fetch correct store for redirection
    return NextResponse.redirect(new URL('/dashboard/products', req.url));
  }
}
