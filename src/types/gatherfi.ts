import { PublicKey } from '@solana/web3.js';

export enum EventStatus {
  Draft = 'Draft',
  Funding = 'Funding',
  BudgetVoting = 'BudgetVoting',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunding = 'Refunding',
  Failed = 'Failed'
}

export interface PlatformConfig {
  admin: PublicKey;
  treasury: PublicKey;
  feePercentage: number;
  royaltyPercentage: number;
  totalFeesCollected: bigint;
  totalVolume: bigint;
  paused: boolean;
  usdcMint: PublicKey;
  usdtMint: PublicKey;
  bump: number;
}
