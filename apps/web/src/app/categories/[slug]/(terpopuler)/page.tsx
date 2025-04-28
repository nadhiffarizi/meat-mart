'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TerpopulerPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(window.location.pathname.replace('/terpopuler', ''));
  }, []);

  return null;
}
