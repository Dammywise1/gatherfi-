import { useGatherFiProgram, findTicketPDA, findEscrowPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenType, getTokenAccount } from '@/utils/tokens';
import { useToast } from '@/contexts/ToastContext';
import { TOKEN_MINTS } from '@/utils/tokens';

export const useTicket = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { success, error } = useToast();

  const purchaseTicket = async (
    eventPda: PublicKey,
    ticketNumber: number,
    tokenType: TokenType
  ) => {
    try {
      const program = getProgramWithSigner();
      const [escrowPda] = findEscrowPDA(eventPda);
      const [ticketPda] = findTicketPDA(eventPda, ticketNumber);
      const [platformConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      let accounts: any = {
        buyer: program.provider.publicKey,
        event: eventPda,
        escrow: escrowPda,
        ticket: ticketPda,
        platformConfig: platformConfigPda,
        systemProgram: PublicKey.default
      };

      if (tokenType !== TokenType.SOL) {
        const mint = TOKEN_MINTS[tokenType];
        const buyerTokenAccount = await getTokenAccount(mint, program.provider.publicKey);
        const escrowTokenAccount = await getTokenAccount(mint, escrowPda);
        
        accounts = {
          ...accounts,
          tokenMint: mint,
          buyerTokenAccount,
          escrowTokenAccount,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        };
      }

      const tx = await program.methods
        .purchaseTicket(tokenType)
        .accounts(accounts)
        .rpc();

      success(`Ticket #${ticketNumber} purchased successfully!`);
      return { tx, ticketPda };
    } catch (err: any) {
      error(err.message || 'Failed to purchase ticket');
      throw err;
    }
  };

  const checkInTicket = async (eventPda: PublicKey, ticketNumber: number) => {
    try {
      const program = getProgramWithSigner();
      const [ticketPda] = findTicketPDA(eventPda, ticketNumber);

      const tx = await program.methods
        .checkInTicket()
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          ticket: ticketPda
        })
        .rpc();

      success(`Ticket #${ticketNumber} checked in successfully!`);
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to check in ticket');
      throw err;
    }
  };

  const getTicket = async (eventPda: PublicKey, ticketNumber: number) => {
    try {
      const program = getProgramWithSigner();
      const [ticketPda] = findTicketPDA(eventPda, ticketNumber);
      return await program.account.ticket.fetch(ticketPda);
    } catch {
      return null;
    }
  };

  const getUserTickets = async (user: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const tickets = await program.account.ticket.all([
        {
          memcmp: {
            offset: 8 + 32 + 32,
            bytes: user.toBase58()
          }
        }
      ]);
      return tickets;
    } catch (err) {
      console.error('Error fetching user tickets:', err);
      return [];
    }
  };

  const getEventTickets = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const tickets = await program.account.ticket.all([
        {
          memcmp: {
            offset: 8,
            bytes: eventPda.toBase58()
          }
        }
      ]);
      return tickets.sort((a, b) => a.account.ticketNumber - b.account.ticketNumber);
    } catch (err) {
      console.error('Error fetching event tickets:', err);
      return [];
    }
  };

  return {
    purchaseTicket,
    checkInTicket,
    getTicket,
    getUserTickets,
    getEventTickets
  };
};
