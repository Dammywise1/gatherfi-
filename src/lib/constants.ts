import { PublicKey } from '@solana/web3.js';

// Program ID from your lib.rs
export const GATHERFI_PROGRAM_ID = new PublicKey('9eEhkngNxm4yc69dNan9L1Arc1YHCDcomQqguw5N8SbE');

// Devnet Token Mints
export const DEVNET_USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
export const DEVNET_USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');

// Nigerian Cities
export const NIGERIAN_CITIES = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano',
  'Benin City', 'Enugu', 'Aba', 'Jos', 'Ilorin'
];

// Network
export const NETWORK = 'devnet';
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Platform Constants
export const PLATFORM_FEE_PERCENTAGE = 5;
export const PLATFORM_ROYALTY_PERCENTAGE = 2;
export const PROFIT_DISTRIBUTION = {
  BACKERS: 60,
  ORGANIZER: 35,
  PLATFORM: 5
};

// Seeds
export const PLATFORM_SEED = 'platform';
export const EVENT_SEED = 'event';
export const ESCROW_SEED = 'escrow';
export const CONTRIBUTOR_SEED = 'contributor';
export const TICKET_SEED = 'ticket';
export const BUDGET_SEED = 'budget';
export const MILESTONE_SEED = 'milestone';
export const PROFIT_SEED = 'profit';
export const VOTE_SEED = 'vote';

// Date Constants
export const FUNDING_DURATION_DAYS = 30;
export const SECONDS_PER_DAY = 24 * 60 * 60;

// Token Decimals
export const SOL_DECIMALS = 9;
export const USDC_DECIMALS = 6;
export const USDT_DECIMALS = 6;

// Routes
export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  CREATE_EVENT: '/events/create',
  EVENT_DETAILS: (id: string) => `/events/${id}`,
  ORGANIZER_DASHBOARD: '/dashboard/organizer',
  CONTRIBUTOR_DASHBOARD: '/dashboard/contributor',
  ADMIN_PANEL: '/admin',
  PROFILE: '/profile',
} as const;
