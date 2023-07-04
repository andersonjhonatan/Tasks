import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '@/src/components/Header/Header';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />

      <Component {...pageProps} />
    </SessionProvider>
  );
}
