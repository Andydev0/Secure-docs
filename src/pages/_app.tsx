import { useEffect } from 'react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    // Importar e inicializar o módulo de segurança dinamicamente
    import('../utils/security').then(({ initSecurity }) => {
      initSecurity();
    });
  }, []);

  // Não envolver páginas de erro com o Layout
  if (Component.displayName === 'ErrorPage') {
    return <Component {...pageProps} />;
  }

  return (
    <SessionProvider session={session}>
      <Navbar />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </SessionProvider>
  );
}
