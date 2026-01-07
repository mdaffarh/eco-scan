'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUser } from './authUtils';

/**
 * Hook untuk protect routes yang memerlukan authentication
 * Redirect ke /login jika user belum login dengan notifikasi
 */
export const useRequireAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const hasAlerted = useRef(false);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Tampilkan alert hanya sekali
        if (!hasAlerted.current) {
          hasAlerted.current = true;
          alert('Silakan login terlebih dahulu untuk mengakses halaman ini!');
        }
        // Redirect ke login jika belum login
        router.push('/login');
      } else {
        // Set user data jika sudah login
        setUser(getUser());
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { user, isLoading };
};
