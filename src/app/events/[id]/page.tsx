'use client';

import { useParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Navigation } from '@/components/layout/Navigation';
import { EventDetails } from '@/components/events/EventDetails';
import { PublicKey } from '@solana/web3.js';

export default function EventDetailsPage() {
  const params = useParams();
  const { connected } = useWallet();
  const eventPda = params.id as string;

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container-custom py-12">
        <EventDetails eventPda={new PublicKey(eventPda)} />
      </div>
    </main>
  );
}
