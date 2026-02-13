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
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              GatherFi
            </Link>
            <div className="hidden md:flex space-x-4">
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
            </div>
          </div>
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
};
