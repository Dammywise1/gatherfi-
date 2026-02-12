'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import WalletButton from '@/components/wallet/WalletButton';
import { CalendarDays, Users, Ticket, Shield, TrendingUp, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function Home() {
  const { connected } = useWallet();

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Driven",
      description: "Backers vote on budgets and milestones, ensuring transparent fund management."
    },
    {
      icon: <Ticket className="h-6 w-6" />,
      title: "Multi-Currency",
      description: "Accept contributions and ticket payments in SOL, USDC, and USDT."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Escrow",
      description: "Funds are held in escrow and released only when milestones are met."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Profit Sharing",
      description: "Event profits are automatically distributed to backers and organizers."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Nigerian Focus",
      description: "Specifically designed for events in major Nigerian cities."
    },
    {
      icon: <CalendarDays className="h-6 w-6" />,
      title: "Complete Lifecycle",
      description: "From funding to final profit distribution, manage everything in one place."
    }
  ];

  const steps = [
    "Connect your wallet",
    "Create your event",
    "Set funding goal and ticket price",
    "Launch and collect contributions",
    "Submit budget for approval",
    "Release funds via milestones"
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Fund Events with{' '}
              <span className="text-primary">Multi-Currency</span>{' '}
              Support on Solana
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              GatherFi enables event organizers to raise funds in SOL, USDC, and USDT.
              From ticket sales to milestone-based funding, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!connected ? (
                <div className="w-full sm:w-auto">
                  <WalletButton />
                </div>
              ) : (
                <>
                  <Link
                    href={ROUTES.CREATE_EVENT}
                    className="btn-primary px-8 py-3 text-base w-full sm:w-auto"
                  >
                    Create Event
                  </Link>
                  <Link
                    href={ROUTES.EVENTS}
                    className="btn-outline px-8 py-3 text-base w-full sm:w-auto"
                  >
                    Browse Events
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">$0+</div>
              <div className="text-sm text-muted-foreground mt-1">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground mt-1">Events Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground mt-1">Active Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground mt-1">Contributors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Choose GatherFi?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            The first decentralized event crowdfunding platform built specifically for the Nigerian market
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-custom p-6 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get started with GatherFi in just a few simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <p className="text-foreground font-medium pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Event?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join the future of event funding on Solana. Create your event in minutes and start raising funds today.
          </p>
          {!connected ? (
            <div className="inline-block">
              <WalletButton />
            </div>
          ) : (
            <Link
              href={ROUTES.CREATE_EVENT}
              className="inline-flex items-center justify-center bg-white text-primary px-8 py-3 rounded-md font-medium hover:bg-white/90 transition-colors"
            >
              Create Your First Event
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <CalendarDays className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">GatherFi</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Decentralized event crowdfunding platform built on Solana. 
                Empowering event organizers and backers in Nigeria and beyond.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href={ROUTES.EVENTS} className="hover:text-primary transition-colors">Browse Events</Link></li>
                <li><Link href={ROUTES.CREATE_EVENT} className="hover:text-primary transition-colors">Create Event</Link></li>
                <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 GatherFi. Built on Solana. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
