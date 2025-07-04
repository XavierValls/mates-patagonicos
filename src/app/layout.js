import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../app/context/AuthContext';
import { CartProvider } from '../app/context/CartContext';
import Navbar from '../app/components/Navbar';
import Footer from '../app/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mates Patagónicos',
  description: 'Tu tienda online de mates y accesorios de la Patagonia.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <CartProvider>
            <Navbar
              logoTransparentSrc="/images/logo-transparente.png"
            />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
