/**
 * Auth Utilities untuk manajemen authentication
 * Menggunakan localStorage sebagai temporary solution sebelum backend API ready
 */

/**
 * Check apakah user sudah login
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const user = localStorage.getItem('user');
  return !!user;
};

/**
 * Get user data dari localStorage
 */
export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Set user data ke localStorage (saat login/register)
 */
export const setUser = (userData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(userData));
};

/**
 * Logout user (hapus data dari localStorage)
 */
export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};
