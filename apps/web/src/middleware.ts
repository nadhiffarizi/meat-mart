'use client';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { useEffect, useState } from 'react';
import { IGetStores } from './interface/store/store.interface';
import { api } from './helper/api';

export async function middleware(req: NextRequest) {
  const session = await auth();
  const url = req.nextUrl;
  const path = url.pathname;
  const role = session?.user?.role;

  if (session?.user && (path === '/register' || path === '/login')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!session?.user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (role === 'CUSTOMER' && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if ((role === 'ADMIN' || role === 'SUPER_ADMIN') && path === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (path.startsWith('/dashboard/users') && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (path.startsWith('/dashboard/discounts') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (
    path !== '/dashboard/products' &&
    path.startsWith('/dashboard/products') &&
    role !== 'SUPER_ADMIN'
  ) {
    // Let layout or page fetch correct store for redirection
    return NextResponse.redirect(new URL('/dashboard/products', req.url));
  }

  if (
    path !== '/dashboard/categories' &&
    path.startsWith('/dashboard/categories') &&
    role !== 'SUPER_ADMIN'
  ) {
    // Let layout or page fetch correct store for redirection
    return NextResponse.redirect(new URL('/dashboard/products', req.url));
  }
}
