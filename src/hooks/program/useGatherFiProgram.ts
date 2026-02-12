'use client';

import { useMemo } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '@/idl/gatherfi.json';
import { GATHERFI_PROGRAM_ID } from '@/lib/constants';

export const useGatherFiProgram = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const program = useMemo(() => {
    if (!wallet) return null;

    const provider = new AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );

    try {
      return new Program(idl as Idl, GATHERFI_PROGRAM_ID, provider);
    } catch (error) {
      console.error('Error initializing program:', error);
      return null;
    }
  }, [connection, wallet]);

  const getProgram = () => {
    if (!program) throw new Error('Program not initialized');
    return program;
  };

  return {
    program,
    getProgram,
    connection,
    wallet,
    provider: program?.provider as AnchorProvider,
  };
};
