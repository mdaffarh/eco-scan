import './globals.css';
import { LocationProvider } from '@/context/LocationContext';

export const metadata = {
  title: 'EcoScan - AI Waste Classification',
  description: 'Aplikasi klasifikasi sampah menggunakan AI untuk kampus UPI',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <LocationProvider>
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
