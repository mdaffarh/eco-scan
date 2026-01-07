'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated, logout } from '@/utils/authUtils';

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check auth status on mount and when pathname changes
    setIsLoggedIn(isAuthenticated());
  }, [pathname]);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Logout
      logout();
      setIsLoggedIn(false);
      router.push('/welcome');
    } else {
      // Navigate to login
      router.push('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="bg-[#1e293b] shadow-[0_2px_10px_rgba(0,0,0,0.1)] sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto py-3 px-4 md:py-4 md:px-5 flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/home" 
          className="flex items-center gap-2 no-underline transition-transform duration-300 hover:scale-105"
        >
          <img 
            src="/Logo.png" 
            alt="EcoScan Logo" 
            className="h-8 md:h-10 w-auto"
          />
          <span className="text-2xl md:text-3xl font-bold text-white">EcoScan</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex list-none gap-2.5 m-0 p-0">
          <li className="m-0">
            <Link 
              href="/home" 
              className={`no-underline py-2.5 px-6 rounded-full text-lg font-medium transition-all duration-300 block ${
                isActive('/home') 
                  ? 'bg-[#10b981] text-white font-semibold shadow-md' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>
          </li>
          <li className="m-0">
            <Link 
              href="/scan" 
              className={`no-underline py-2.5 px-6 rounded-full text-lg font-medium transition-all duration-300 block ${
                isActive('/scan') 
                  ? 'bg-[#10b981] text-white font-semibold shadow-md' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Scan
            </Link>
          </li>
          <li className="m-0">
            <Link 
              href="/profile" 
              className={`no-underline py-2.5 px-6 rounded-full text-lg font-medium transition-all duration-300 block ${
                isActive('/profile') 
                  ? 'bg-[#10b981] text-white font-semibold shadow-md' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Profile
            </Link>
          </li>
          <li className="m-0">
            <button
              onClick={handleAuthClick}
              className={`no-underline py-2.5 px-6 rounded-full text-lg font-medium transition-all duration-300 block border-none cursor-pointer bg-transparent ${
                isActive('/login') 
                  ? 'bg-[#10b981] text-white font-semibold shadow-md' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1e293b] border-t border-white/10">
          <ul className="flex flex-col list-none gap-1 m-0 p-4">
            <li className="m-0">
              <Link 
                href="/home"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`no-underline py-3 px-4 rounded-lg text-base font-medium transition-all duration-300 block ${
                  isActive('/home') 
                    ? 'bg-[#10b981] text-white font-semibold' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Home
              </Link>
            </li>
            <li className="m-0">
              <Link 
                href="/scan"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`no-underline py-3 px-4 rounded-lg text-base font-medium transition-all duration-300 block ${
                  isActive('/scan') 
                    ? 'bg-[#10b981] text-white font-semibold' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Scan
              </Link>
            </li>
            <li className="m-0">
              <Link 
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`no-underline py-3 px-4 rounded-lg text-base font-medium transition-all duration-300 block ${
                  isActive('/profile') 
                    ? 'bg-[#10b981] text-white font-semibold' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Profile
              </Link>
            </li>
            <li className="m-0">
              <button
                onClick={handleAuthClick}
                className={`w-full text-left no-underline py-3 px-4 rounded-lg text-base font-medium transition-all duration-300 block border-none cursor-pointer ${
                  isActive('/login') 
                    ? 'bg-[#10b981] text-white font-semibold' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
