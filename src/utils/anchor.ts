import { Program, AnchorProvider, Idl, setProvider } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Commitment } from '@solana/web3.js';
import idl from '@/idl/gatherfi.json';
import { BN } from '@coral-xyz/anchor';

export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);

export function useGatherFiProgramReadOnly() {
  const { connection } = useConnection();
  const getProgram = () => {
    const provider = new AnchorProvider(connection, {} as any, {
      commitment: 'confirmed' as Commitment,
    });
    setProvider(provider);
    return new Program(idl as Idl, PROGRAM_ID, provider);
  };
  return { getProgram, PROGRAM_ID };
}

export function useGatherFiProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getProgram = () => {
    if (!wallet.publicKey) throw new Error('Wallet not connected');
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed' as Commitment,
    });
    setProvider(provider);
    return new Program(idl as Idl, PROGRAM_ID, provider);
  };

  const getProgramWithSigner = () => getProgram();
  return { getProgram, getProgramWithSigner, PROGRAM_ID };
}

// Helper to create Uint8Array from string (ASCII)
function stringToUint8Array(str: string): Uint8Array {
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}

// Helper to create Uint8Array from BN (little-endian)
function bnToUint8Array(bn: BN, length: number): Uint8Array {
  const arr = new Uint8Array(length);
  const bytes = bn.toArray('le', length);
  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes[i];
  }
  return arr;
}

export function findEventPDA(organizer: PublicKey, eventId: BN): [PublicKey, number] {
  // Convert seeds to Uint8Array
  const eventSeed = stringToUint8Array('event');
  const organizerBytes = organizer.toBytes();
  const eventIdBytes = bnToUint8Array(eventId, 8);
  
  console.log('🔍 PDA Calculation:');
  console.log('Event seed:', Array.from(eventSeed));
  console.log('Organizer:', organizer.toString());
  console.log('Event ID:', eventId.toString());
  console.log('Event ID bytes:', Array.from(eventIdBytes));
  
  const seeds = [
    eventSeed,
    organizerBytes,
    eventIdBytes
  ];
  
  const [pda, bump] = PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);
  console.log('✅ Calculated PDA:', pda.toString());
  console.log('Bump:', bump);
  
  return [pda, bump];
}

export function findEscrowPDA(event: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [stringToUint8Array('escrow'), event.toBytes()],
    PROGRAM_ID
  );
}

export function findContributorPDA(event: PublicKey, contributor: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [stringToUint8Array('contributor'), event.toBytes(), contributor.toBytes()],
    PROGRAM_ID
  );
}

export function findPlatformConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [stringToUint8Array('platform')],
    PROGRAM_ID
  );
}
