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
  const { publicKey, connected } = useWallet();

  const getNextEventId = async (organizer: PublicKey): Promise<BN> => {
    try {
      const program = getReadOnlyProgram();
      const events = await program.account.event.all([
        {
          memcmp: {
            offset: 8,
            bytes: organizer.toBase58()
          }
        }
      ]);
      
      console.log(`Found ${events.length} existing events for organizer`);
      
      let maxId = new BN(0);
      events.forEach(event => {
        const id = event.account.eventId;
        if (id.cmp(maxId) > 0) {
          maxId = id;
        }
      });
      
      const nextId = maxId.add(new BN(1));
      console.log('Next event ID:', nextId.toString());
      return nextId;
    } catch (err) {
      console.error('Error getting next event ID:', err);
      return new BN(1);
    }
  };

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

      const eventIdBN = await getNextEventId(publicKey);
      
      const targetAmountLamports = Math.floor(targetAmount * 1e9);
      const ticketPriceLamports = Math.floor(ticketPrice * 1e9);
      const targetAmountBN = new BN(targetAmountLamports);
      const ticketPriceBN = new BN(ticketPriceLamports);
      const eventDateBN = new BN(eventDate);
      
      const [eventPda, eventBump] = findEventPDA(publicKey, eventIdBN);
      const [escrowPda, escrowBump] = findEscrowPDA(eventPda);

      console.log('🚀 Creating event with sequential ID:', eventIdBN.toString());
      console.log('Event PDA:', eventPda.toString());
      console.log('Escrow PDA:', escrowPda.toString());

      const anchorTokens = acceptedTokens.map(t => toAnchorTokenType(t));

      const program = getProgramWithSigner();
      
      const tx = await program.methods
        .createEvent(
          eventIdBN,
          name,
          description,
          targetAmountBN,
          ticketPriceBN,
          maxTickets,
          location,
          eventDateBN,
          anchorTokens
        )
        .accounts({
          organizer: publicKey,
          event: eventPda,
          escrow: escrowPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      console.log('Transaction successful:', tx);
      cacheManager.clear();
      success(`Event #${eventIdBN.toString()} created successfully!`);
      return { tx, eventPda, escrowPda };
    } catch (err: any) {
      console.error('Create event error:', err);
      error(err.message || 'Failed to create event');
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
