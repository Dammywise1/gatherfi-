import { useGatherFiProgram, findPlatformConfigPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { useToast } from '@/contexts/ToastContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { cacheManager } from '@/utils/cache-manager';
import { withRetry } from '@/utils/retry';

const CACHE_TTL = 45000;

export const usePlatform = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { success, error } = useToast();
  const { publicKey } = useWallet();

  const getPlatformConfig = async () => {
    const cacheKey = 'platform_config';
    const cached = await cacheManager.get(cacheKey, CACHE_TTL);
    if (cached) return cached;

    try {
      const program = getProgramWithSigner();
      const [configPda] = findPlatformConfigPDA();
      const config = await withRetry(() => program.account.platformConfig.fetch(configPda));
      cacheManager.set(cacheKey, config);
      return config;
    } catch (err) {
      console.error('Error fetching platform config:', err);
      throw err;
    }
  };

  const emergencyPause = async () => {
    try {
      const program = getProgramWithSigner();
      const [configPda] = findPlatformConfigPDA();
      
      const tx = await program.methods
        .emergencyPause()
        .accounts({
          admin: program.provider.publicKey,
          platformConfig: configPda
        })
        .rpc();
      
      cacheManager.clear();
      success('Platform pause toggled successfully');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to toggle pause');
      throw err;
    }
  };

  const updateTokenMints = async (usdcMint?: PublicKey, usdtMint?: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const [configPda] = findPlatformConfigPDA();
      
      const tx = await program.methods
        .updateTokenMints(usdcMint || null, usdtMint || null)
        .accounts({
          admin: program.provider.publicKey,
          platformConfig: configPda
        })
        .rpc();
      
      cacheManager.clear();
      success('Token mints updated successfully');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to update token mints');
      throw err;
    }
  };

  const withdrawFees = async (amount: number) => {
    try {
      const program = getProgramWithSigner();
      const [configPda] = findPlatformConfigPDA();
      
      const config = await program.account.platformConfig.fetch(configPda);
      
      const tx = await program.methods
        .withdrawFees(amount)
        .accounts({
          admin: program.provider.publicKey,
          platformConfig: configPda,
          treasury: config.treasury,
          systemProgram: PublicKey.default
        })
        .rpc();
      
      cacheManager.clear();
      success('Fees withdrawn successfully');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to withdraw fees');
      throw err;
    }
  };

  const isAdmin = async (): Promise<boolean> => {
    if (!publicKey) return false;
    try {
      const config = await getPlatformConfig();
      return config.admin.equals(publicKey);
    } catch {
      return false;
    }
  };

  return {
    getPlatformConfig,
    emergencyPause,
    updateTokenMints,
    withdrawFees,
    isAdmin
  };
};
