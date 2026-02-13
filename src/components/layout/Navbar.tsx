'use client';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePlatform } from '@/hooks/usePlatform';

export const Navbar = () => {
  const { publicKey } = useWallet();
  const pathname = usePathname();
  const { isAdmin } = usePlatform();
  const [adminStatus, setAdminStatus] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration: only render wallet button after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      if (publicKey) {
        const admin = await isAdmin();
        setAdminStatus(admin);
      }
    };
    checkAdmin();
  }, [publicKey, isAdmin]);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/event/create', label: 'Create Event' },
    ...(publicKey ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/my-tickets', label: 'My Tickets' },
      { href: '/my-contributions', label: 'My Contributions' }
    ] : []),
    ...(adminStatus ? [{ href: '/admin', label: 'Admin' }] : [])
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            GatherFi
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Only render wallet button after mount to prevent hydration mismatch */}
            {mounted && <WalletMultiButton />}
          </div>

          {/* Mobile: Wallet + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && <WalletMultiButton />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
