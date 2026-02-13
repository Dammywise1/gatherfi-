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

function bnToLeBuffer(bn: BN, length: number): Buffer {
  const buf = Buffer.alloc(length);
  const bnStr = bn.toString(16).padStart(length * 2, '0');
  for (let i = 0; i < length; i++) {
    buf[i] = parseInt(bnStr.substr(i * 2, 2), 16);
  }
  return buf;
}

export function findEventPDA(organizer: PublicKey, eventId: BN): [PublicKey, number] {
  const eventIdBuffer = bnToLeBuffer(eventId, 8);
  return PublicKey.findProgramAddressSync(
    [Buffer.from('event'), organizer.toBuffer(), eventIdBuffer],
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

export function findPlatformConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('platform')],
    PROGRAM_ID
  );
}
