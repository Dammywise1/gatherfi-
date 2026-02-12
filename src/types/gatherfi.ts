import { PublicKey } from '@solana/web3.js';

// ===== ENUMS =====
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
  Refunding = 'Refunding'
}

// ===== ACCOUNT STRUCTURES =====
export interface PlatformConfig {
  admin: PublicKey;
  treasury: PublicKey;
  feePercentage: number;
  royaltyPercentage: number;
  totalFeesCollected: number;
  totalVolume: number;
  paused: boolean;
  bump: number;
  publicKey?: PublicKey;
}

export interface Event {
  organizer: PublicKey;
  eventId: number;
  name: string;
  description: string;
  targetAmount: number;
  amountRaised: number;
  ticketPrice: number;
  ticketsSold: number;
  maxTickets: number;
  location: string;
  eventDate: number;
  status: EventStatus;
  acceptedTokens: TokenType[];
  budgetApproved: boolean;
  fundingDeadline: number;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  platformFeeAmount: number;
  ticketMint: PublicKey | null;
  escrowBump: number;
  eventBump: number;
  publicKey?: PublicKey;
}

export interface Contributor {
  event: PublicKey;
  contributor: PublicKey;
  amount: number;
  votingPower: number;
  tokenType: TokenType;
  profitsClaimed: number;
  refundClaimed: boolean;
  bump: number;
  publicKey?: PublicKey;
}

export interface Ticket {
  mint: PublicKey;
  event: PublicKey;
  owner: PublicKey;
  ticketNumber: number;
  checkedIn: boolean;
  pricePaid: number;
  tokenType: TokenType;
  refunded: boolean;
  bump: number;
  publicKey?: PublicKey;
}

export interface Budget {
  event: PublicKey;
  totalAmount: number;
  approved: boolean;
  submittedAt: number;
  bump: number;
  publicKey?: PublicKey;
}

export interface Milestone {
  event: PublicKey;
  index: number;
  description: string;
  amount: number;
  dueDate: number;
  tokenType: TokenType;
  released: boolean;
  releaseDate: number | null;
  bump: number;
  publicKey?: PublicKey;
}

export interface Escrow {
  event: PublicKey;
  solBalance: number;
  usdcBalance: number;
  usdtBalance: number;
  totalBalance: number;
  isInitialized: boolean;
  bump: number;
  publicKey?: PublicKey;
}

export interface Vote {
  event: PublicKey;
  voter: PublicKey;
  amount: number;
  approve: boolean;
  votedAt: number;
  bump: number;
  publicKey?: PublicKey;
}

export interface ProfitDistribution {
  event: PublicKey;
  totalRevenue: number;
  expenses: number;
  netProfit: number;
  backersShare: number;
  organizerShare: number;
  platformShare: number;
  distributed: boolean;
  distributionDate: number;
  bump: number;
  publicKey?: PublicKey;
}

// ===== FORM DATA TYPES =====
export interface CreateEventFormData {
  eventId: number;
  name: string;
  description: string;
  targetAmount: number;
  ticketPrice: number;
  maxTickets: number;
  location: string;
  eventDate: Date;
  acceptedTokens: TokenType[];
}

export interface ContributeFormData {
  amount: number;
  tokenType: TokenType;
}

export interface PurchaseTicketFormData {
  tokenType: TokenType;
}

export interface MilestoneFormData {
  index: number;
  description: string;
  amount: number;
  dueDate: Date;
  tokenType: TokenType;
}

export interface BudgetFormData {
  totalAmount: number;
}

export interface VoteFormData {
  approve: boolean;
}

// ===== RESPONSE TYPES =====
export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
}

export interface EventsResponse {
  events: Event[];
  total: number;
}

export interface ContributorStats {
  totalContributed: number;
  votingPower: number;
  profitsClaimed: number;
  eventsParticipated: number;
}
