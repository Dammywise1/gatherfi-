import { useGatherFiProgram, useGatherFiProgramReadOnly, findEventPDA, findEscrowPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenType } from '@/utils/tokens';
import { useToast } from '@/contexts/ToastContext';
import { EventStatus } from '@/types/gatherfi';
import { cacheManager } from '@/utils/cache-manager';
import { withRetry } from '@/utils/retry';
import { BN } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

const CACHE_TTL = 45000;

function toAnchorTokenType(token: TokenType): any {
  switch (token) {
    case TokenType.SOL: return { sol: {} };
    case TokenType.USDC: return { usdc: {} };
    case TokenType.USDT: return { usdt: {} };
    default: return { sol: {} };
  }
}

export const useEvent = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { getProgram: getReadOnlyProgram } = useGatherFiProgramReadOnly();
  const { success, error } = useToast();
  const { publicKey, connected, wallet } = useWallet();

  const createEvent = async (
    eventId: number,
    name: string,
    description: string,
    targetAmount: number,
    ticketPrice: number,
    maxTickets: number,
    location: string,
    eventDate: number,
    acceptedTokens: TokenType[]
  ) => {
    try {
      if (!connected || !publicKey) {
        throw new Error('Please connect your wallet first');
      }

      console.log('Creating event with wallet:', wallet?.adapter?.name);
      
      const program = getProgramWithSigner();
      const [eventPda] = findEventPDA(publicKey, eventId);
      const [escrowPda] = findEscrowPDA(eventPda);

      const targetAmountLamports = Math.floor(targetAmount * 1e9);
      const ticketPriceLamports = Math.floor(ticketPrice * 1e9);
      const anchorTokens = acceptedTokens.map(t => toAnchorTokenType(t));

      // For mobile wallets, we need to ensure the transaction is built properly
      const tx = await program.methods
        .createEvent(
          new BN(eventId),
          name,
          description,
          new BN(targetAmountLamports),
          new BN(ticketPriceLamports),
          maxTickets,
          location,
          new BN(eventDate),
          anchorTokens
        )
        .accounts({
          organizer: publicKey,
          event: eventPda,
          escrow: escrowPda,
          systemProgram: PublicKey.default
        })
        .rpc()
        .catch((err) => {
          console.error('Transaction error:', err);
          if (err.message?.includes('signature') || err.message?.includes('Missing signature')) {
            throw new Error('Please open your wallet app and approve the transaction');
          }
          throw err;
        });

      console.log('Transaction successful:', tx);
      cacheManager.clear();
      success('Event created successfully!');
      return { tx, eventPda, escrowPda };
    } catch (err: any) {
      console.error('Create event error:', err);
      
      // User-friendly error messages for mobile
      if (err.message?.includes('signature') || err.message?.includes('Missing signature')) {
        error('Please open your wallet app and approve the transaction');
      } else if (err.message?.includes('connected')) {
        error('Please connect your wallet');
      } else if (err.message?.includes('Network') || err.message?.includes('429')) {
        error('Network error. Please try again');
      } else {
        error(err.message || 'Failed to create event');
      }
      throw err;
    }
  };

  const getEvent = async (eventPda: PublicKey) => {
    const cacheKey = `event_${eventPda.toBase58()}`;
    const cached = await cacheManager.get(cacheKey, CACHE_TTL);
    if (cached) return cached;
    try {
      const program = getReadOnlyProgram();
      const event = await withRetry(() => program.account.event.fetch(eventPda));
      cacheManager.set(cacheKey, event);
      return event;
    } catch (err) {
      console.error('Error fetching event:', err);
      throw err;
    }
  };

  const getAllEvents = async () => {
    const cacheKey = 'all_events';
    const cached = await cacheManager.get(cacheKey, CACHE_TTL);
    if (cached) return cached;
    try {
      const program = getReadOnlyProgram();
      const events = await withRetry(() => program.account.event.all());
      const sorted = events.sort((a, b) => Number(b.account.eventId) - Number(a.account.eventId));
      cacheManager.set(cacheKey, sorted);
      return sorted;
    } catch (err) {
      console.error('Error fetching events:', err);
      return [];
    }
  };

  const getEventsByOrganizer = async (organizer: PublicKey) => {
    const cacheKey = `organizer_${organizer.toBase58()}`;
    const cached = await cacheManager.get(cacheKey, CACHE_TTL);
    if (cached) return cached;
    try {
      const program = getReadOnlyProgram();
      const events = await withRetry(() => program.account.event.all([
        { memcmp: { offset: 8, bytes: organizer.toBase58() } }
      ]));
      cacheManager.set(cacheKey, events);
      return events;
    } catch (err) {
      console.error('Error fetching organizer events:', err);
      return [];
    }
  };

  const getEventsByStatus = async (status: EventStatus) => {
    const cacheKey = `status_${status}`;
    const cached = await cacheManager.get(cacheKey, CACHE_TTL);
    if (cached) return cached;
    try {
      const program = getReadOnlyProgram();
      const events = await withRetry(() => program.account.event.all());
      const filtered = events.filter(e => e.account.status === status);
      cacheManager.set(cacheKey, filtered);
      return filtered;
    } catch (err) {
      console.error('Error fetching events by status:', err);
      return [];
    }
  };

  return {
    createEvent,
    getEvent,
    getAllEvents,
    getEventsByOrganizer,
    getEventsByStatus,
  };
};
