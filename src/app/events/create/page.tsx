'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { CreateEventForm } from '@/components/events/CreateEventForm';
import { useEffect } from 'react';

export default function CreateEventPage() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  if (!connected) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
          <p className="text-muted-foreground mb-8">
            Fill in the details below to create your event and start raising funds.
          </p>
          <CreateEventForm />
        </div>
      </div>
    </main>
  );
}
