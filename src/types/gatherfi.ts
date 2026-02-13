import { PublicKey } from '@solana/web3.js';

export enum TokenType {
  SOL = 'SOL',
  USDC = 'USDC',
  USDT = 'USDT'
}

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

export interface Event {
  organizer: PublicKey;
  eventId: bigint;
  name: string;
  description: string;
  targetAmount: bigint;
  amountRaised: bigint;
  ticketPrice: bigint;
  ticketsSold: number;
  maxTickets: number;
  location: string;
  eventDate: bigint;
  status: EventStatus;
  acceptedTokens: TokenType[];
  budgetApproved: boolean;
  fundingDeadline: bigint;
  totalVotes: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  platformFeeAmount: bigint;
  ticketMint: PublicKey | null;
  escrowBump: number;
  eventBump: number;
}

export interface Contributor {
  event: PublicKey;
  contributor: PublicKey;
  amount: bigint;
  votingPower: bigint;
  tokenType: TokenType;
  profitsClaimed: bigint;
  refundClaimed: boolean;
  bump: number;
}

export interface Ticket {
  mint: PublicKey;
  event: PublicKey;
  owner: PublicKey;
  ticketNumber: number;
  checkedIn: boolean;
  pricePaid: bigint;
  tokenType: TokenType;
  refunded: boolean;
  bump: number;
}

export interface Budget {
  event: PublicKey;
  totalAmount: bigint;
  approved: boolean;
  submittedAt: bigint;
  bump: number;
}

export interface Milestone {
  event: PublicKey;
  index: number;
  description: string;
  amount: bigint;
  dueDate: bigint;
  tokenType: TokenType;
  released: boolean;
  releaseDate: bigint | null;
  bump: number;
}

export interface ProfitDistribution {
  event: PublicKey;
  totalRevenue: bigint;
  expenses: bigint;
  netProfit: bigint;
  backersShare: bigint;
  organizerShare: bigint;
  platformShare: bigint;
  distributed: boolean;
  distributionDate: bigint;
  bump: number;
}

export interface Escrow {
  event: PublicKey;
  solBalance: bigint;
  usdcBalance: bigint;
  usdtBalance: bigint;
  totalBalance: bigint;
  isInitialized: boolean;
  bump: number;
}

export interface Vote {
  event: PublicKey;
  voter: PublicKey;
  amount: bigint;
  approve: boolean;
  votedAt: bigint;
  bump: number;
}
