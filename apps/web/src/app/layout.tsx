import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProviderComponent } from '@/components/hoc/store.component';
import InitialState from '@/components/hoc/initialState.component';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meat Mart',
  description: 'meat mart official web market',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-primaryBackground ${inter.className}`}>
        <SessionProvider>
          <StoreProviderComponent>
            <InitialState>{children}</InitialState>
          </StoreProviderComponent>
        </SessionProvider>
      </body>
    </html>
  );
}
