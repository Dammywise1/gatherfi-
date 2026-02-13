import { Program, AnchorProvider, Idl, setProvider } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Commitment } from '@solana/web3.js';
import idl from '@/idl/gatherfi.json';

export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);

// Read-only version - doesn't need wallet
export function useGatherFiProgramReadOnly() {
  const { connection } = useConnection();

  const getProgram = () => {
    const provider = new AnchorProvider(
      connection,
      {} as any,
      {
        commitment: 'confirmed' as Commitment,
        preflightCommitment: 'confirmed' as Commitment,
      }
    );
    
    setProvider(provider);
    return new Program(idl as Idl, PROGRAM_ID, provider);
  };

  return { getProgram, PROGRAM_ID };
}

// Write version - needs wallet for transactions
export function useGatherFiProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getProgram = () => {
    if (!wallet.publicKey) throw new Error('Wallet not connected');
    
    const provider = new AnchorProvider(
      connection,
      wallet as any,
      {
        commitment: 'confirmed' as Commitment,
        preflightCommitment: 'confirmed' as Commitment,
      }
    );
    
    setProvider(provider);
    return new Program(idl as Idl, PROGRAM_ID, provider);
  };

  const getProgramWithSigner = () => {
    const program = getProgram();
    if (!program.provider.publicKey) throw new Error('No public key');
    return program;
  };

  return { getProgram, getProgramWithSigner, PROGRAM_ID };
}

// PDA finders
export function findEventPDA(organizer: PublicKey, eventId: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('event'), organizer.toBuffer(), Buffer.from(eventId.toString())],
    PROGRAM_ID
  );
}

export function findEscrowPDA(event: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), event.toBuffer()],
    PROGRAM_ID
  );
}

export function findContributorPDA(event: PublicKey, contributor: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('contributor'), event.toBuffer(), contributor.toBuffer()],
    PROGRAM_ID
  );
}

export function findTicketPDA(event: PublicKey, ticketNumber: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('ticket'), event.toBuffer(), Buffer.from(ticketNumber.toString())],
    PROGRAM_ID
  );
}

export function findBudgetPDA(event: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('budget'), event.toBuffer()],
    PROGRAM_ID
  );
}

export function findMilestonePDA(event: PublicKey, index: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('milestone'), event.toBuffer(), Buffer.from(index.toString())],
    PROGRAM_ID
  );
}

export function findVotePDA(event: PublicKey, voter: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vote'), event.toBuffer(), voter.toBuffer()],
    PROGRAM_ID
  );
}

export function findProfitDistributionPDA(event: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('profit'), event.toBuffer()],
    PROGRAM_ID
  );
}

export function findPlatformConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('platform')],
    PROGRAM_ID
  );
}
