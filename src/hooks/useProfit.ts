import { useGatherFiProgram, findProfitDistributionPDA, findContributorPDA, findEscrowPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenType, getTokenAccount } from '@/utils/tokens';
import { useToast } from '@/contexts/ToastContext';
import { TOKEN_MINTS } from '@/utils/tokens';

export const useProfit = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { success, error } = useToast();

  const finalizeEvent = async (eventPda: PublicKey, totalRevenue: number) => {
    try {
      const program = getProgramWithSigner();
      const [escrowPda] = findEscrowPDA(eventPda);
      const [profitPda] = findProfitDistributionPDA(eventPda);
      const [platformConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      const tx = await program.methods
        .finalizeEvent(totalRevenue)
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          escrow: escrowPda,
          profitDistribution: profitPda,
          platformConfig: platformConfigPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Event finalized! Profits calculated.');
      return { tx, profitPda };
    } catch (err: any) {
      error(err.message || 'Failed to finalize event');
      throw err;
    }
  };

  const claimProfit = async (
    eventPda: PublicKey,
    contributorPda: PublicKey,
    tokenType: TokenType
  ) => {
    try {
      const program = getProgramWithSigner();
      const [profitPda] = findProfitDistributionPDA(eventPda);
      const [escrowPda] = findEscrowPDA(eventPda);
      const [platformConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      let accounts: any = {
        backer: program.provider.publicKey,
        event: eventPda,
        profitDistribution: profitPda,
        contributorAccount: contributorPda,
        escrow: escrowPda,
        platformConfig: platformConfigPda,
        systemProgram: PublicKey.default
      };

      if (tokenType !== TokenType.SOL) {
        const mint = TOKEN_MINTS[tokenType];
        const backerTokenAccount = await getTokenAccount(mint, program.provider.publicKey);
        const escrowTokenAccount = await getTokenAccount(mint, escrowPda);
        
        accounts = {
          ...accounts,
          tokenMint: mint,
          backerTokenAccount,
          escrowTokenAccount,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        };
      }

      const tx = await program.methods
        .claimProfit()
        .accounts(accounts)
        .rpc();

      success('Profit claimed successfully!');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to claim profit');
      throw err;
    }
  };

  const claimOrganizerProfit = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const [profitPda] = findProfitDistributionPDA(eventPda);
      const [escrowPda] = findEscrowPDA(eventPda);
      const [platformConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      const tx = await program.methods
        .claimOrganizerProfit()
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          profitDistribution: profitPda,
          escrow: escrowPda,
          platformConfig: platformConfigPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Organizer profit claimed successfully!');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to claim organizer profit');
      throw err;
    }
  };

  const getProfitDistribution = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const [profitPda] = findProfitDistributionPDA(eventPda);
      return await program.account.profitDistribution.fetch(profitPda);
    } catch {
      return null;
    }
  };

  return {
    finalizeEvent,
    claimProfit,
    claimOrganizerProfit,
    getProfitDistribution
  };
};
