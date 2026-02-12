'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Navigation } from '@/components/layout/Navigation';
import { useEvents } from '@/hooks/queries/useEvents';
import { Wallet, TrendingUp, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function ContributorDashboard() {
  const { publicKey, connected } = useWallet();
  const { events } = useEvents();

  if (!connected) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Please connect your wallet</h1>
          <p className="text-muted-foreground">You need to connect your wallet to view your dashboard.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8">Contributor Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-custom p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Contributed</h3>
          </div>

          <div className="card-custom p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Voting Power</h3>
          </div>

          <div className="card-custom p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Award className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Profits Claimed</h3>
          </div>

          <div className="card-custom p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Events Participated</h3>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Events You've Supported</h2>
        <div className="card-custom p-12 text-center">
          <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No contributions yet</h3>
          <p className="text-muted-foreground mb-6">Start supporting events to see them here</p>
          <Link href={ROUTES.EVENTS} className="btn-primary">
            Browse Events
          </Link>
        </div>
      </div>
    </main>
  );
}
