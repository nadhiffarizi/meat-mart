'use client';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Backdrop, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function InitialState({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    setLoading(false);
  }, [session]);

  if (isLoading) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return <div>{children}</div>;
}
