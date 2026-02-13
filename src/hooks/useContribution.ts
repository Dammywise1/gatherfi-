import { useGatherFiProgram, findEventPDA, findEscrowPDA, findContributorPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenType, getTokenAccount } from '@/utils/tokens';
import { useToast } from '@/contexts/ToastContext';
import { TOKEN_MINTS } from '@/utils/tokens';

export const useContribution = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { success, error } = useToast();

  const contribute = async (
    eventPda: PublicKey,
    amount: number,
    tokenType: TokenType
  ) => {
    try {
      const program = getProgramWithSigner();
      const [escrowPda] = findEscrowPDA(eventPda);
      const [contributorPda] = findContributorPDA(eventPda, program.provider.publicKey);
      const [platformConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      let accounts: any = {
        contributor: program.provider.publicKey,
        event: eventPda,
        escrow: escrowPda,
        contributorAccount: contributorPda,
        platformConfig: platformConfigPda,
        systemProgram: PublicKey.default
      };

      if (tokenType !== TokenType.SOL) {
        const mint = TOKEN_MINTS[tokenType];
        if (!mint) throw new Error('Invalid token mint');
        
        const contributorTokenAccount = await getTokenAccount(mint, program.provider.publicKey);
        const escrowTokenAccount = await getTokenAccount(mint, escrowPda);
        
        accounts = {
          ...accounts,
          tokenMint: mint,
          contributorTokenAccount,
          escrowTokenAccount,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        };
      }

      const tx = await program.methods
        .contribute(amount, tokenType)
        .accounts(accounts)
        .rpc();

      success(`Contributed successfully!`);
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to contribute');
      throw err;
    }
  };

  const getContributor = async (eventPda: PublicKey, contributor: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const [contributorPda] = findContributorPDA(eventPda, contributor);
      return await program.account.contributor.fetch(contributorPda);
    } catch {
      return null;
    }
  };

  const claimRefund = async (
    eventPda: PublicKey,
    contributorPda: PublicKey,
    tokenType: TokenType
  ) => {
    try {
      const program = getProgramWithSigner();
      const [escrowPda] = findEscrowPDA(eventPda);
      const [platformConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      let accounts: any = {
        contributor: program.provider.publicKey,
        event: eventPda,
        escrow: escrowPda,
        contributorAccount: contributorPda,
        platformConfig: platformConfigPda,
        systemProgram: PublicKey.default
      };

      if (tokenType !== TokenType.SOL) {
        const mint = TOKEN_MINTS[tokenType];
        const contributorTokenAccount = await getTokenAccount(mint, program.provider.publicKey);
        const escrowTokenAccount = await getTokenAccount(mint, escrowPda);
        
        accounts = {
          ...accounts,
          tokenMint: mint,
          contributorTokenAccount,
          escrowTokenAccount,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        };
      }

      const tx = await program.methods
        .claimRefund()
        .accounts(accounts)
        .rpc();

      success('Refund claimed successfully!');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to claim refund');
      throw err;
    }
  };

  return {
    contribute,
    getContributor,
    claimRefund
  };
};
