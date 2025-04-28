import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import NavBar from '@/components/Navbar/Navbar.component';
import { StoreProviderComponent } from '@/components/hoc/store.component';
import InitialState from '@/components/hoc/initialState.component';
import { useAppSelector } from '@/redux/store';

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
        <StoreProviderComponent>
          <InitialState>{children}</InitialState>
        </StoreProviderComponent>
      </body>
    </html>
  );
}
