'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { CalendarDays, Menu, X } from 'lucide-react';
import WalletButton from '@/components/wallet/WalletButton';
import { useState } from 'react';
import { ROUTES } from '@/lib/constants';

export const Navigation = () => {
  const { connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link href={ROUTES.HOME} className="flex items-center space-x-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">GatherFi</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {connected && (
            <>
              <Link href={ROUTES.EVENTS} className="text-sm font-medium hover:text-primary transition-colors">
                Browse Events
              </Link>
              <Link href={ROUTES.ORGANIZER_DASHBOARD} className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href={ROUTES.CREATE_EVENT} className="text-sm font-medium hover:text-primary transition-colors">
                Create Event
              </Link>
            </>
          )}
          <WalletButton />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <div className="flex flex-col space-y-4">
            {connected && (
              <>
                <Link 
                  href={ROUTES.EVENTS} 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Events
                </Link>
                <Link 
                  href={ROUTES.ORGANIZER_DASHBOARD} 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href={ROUTES.CREATE_EVENT} 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Create Event
                </Link>
              </>
            )}
            <WalletButton />
          </div>
        </div>
      )}
    </nav>
  );
};
