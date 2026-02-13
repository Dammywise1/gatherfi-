'use client';
import { useState, useEffect } from 'react';
import { usePlatform } from '@/hooks/usePlatform';
import { PublicKey } from '@solana/web3.js';
import { formatTokenAmount, TokenType } from '@/utils/tokens';

export const PlatformAdmin = () => {
  const { getPlatformConfig, emergencyPause, updateTokenMints, withdrawFees, isAdmin } = usePlatform();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [usdcMint, setUsdcMint] = useState('');
  const [usdtMint, setUsdtMint] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const adminStatus = await isAdmin();
      setIsUserAdmin(adminStatus);
      
      if (adminStatus) {
        const platformConfig = await getPlatformConfig();
        setConfig(platformConfig);
        setUsdcMint(platformConfig.usdcMint.toBase58());
        setUsdtMint(platformConfig.usdtMint.toBase58());
      }
    };
    fetchData();
  }, []);

  const handlePause = async () => {
    setLoading(true);
    try {
      await emergencyPause();
      const updated = await getPlatformConfig();
      setConfig(updated);
    } catch (error) {
      console.error('Failed to toggle pause:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMints = async () => {
    setLoading(true);
    try {
      await updateTokenMints(
        usdcMint ? new PublicKey(usdcMint) : undefined,
        usdtMint ? new PublicKey(usdtMint) : undefined
      );
      const updated = await getPlatformConfig();
      setConfig(updated);
    } catch (error) {
      console.error('Failed to update mints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      const amount = parseFloat(withdrawAmount) * 1e9;
      await withdrawFees(amount);
      const updated = await getPlatformConfig();
      setConfig(updated);
      setWithdrawAmount('');
    } catch (error) {
      console.error('Failed to withdraw fees:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isUserAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 text-center">You are not authorized to access this page</p>
      </div>
    );
  }

  if (!config) {
    return <div className="text-center py-12">Loading platform config...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Platform Administration</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Platform Status</p>
            <p className={`text-xl font-bold ${config.paused ? 'text-red-600' : 'text-green-600'}`}>
              {config.paused ? 'Paused' : 'Active'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Volume</p>
            <p className="text-xl font-bold text-gray-900">
              {formatTokenAmount(config.totalVolume, TokenType.SOL)} SOL
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Fees Collected</p>
            <p className="text-xl font-bold text-gray-900">
              {formatTokenAmount(config.totalFeesCollected, TokenType.SOL)} SOL
            </p>
          </div>
        </div>

        <div className="border-b pb-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Emergency Controls</h3>
          <button
            onClick={handlePause}
            disabled={loading}
            className={`px-6 py-3 rounded-md text-white ${
              config.paused 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } disabled:bg-gray-400`}
          >
            {loading ? 'Processing...' : config.paused ? 'Unpause Platform' : 'Pause Platform'}
          </button>
        </div>

        <div className="border-b pb-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Token Mint Addresses</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USDC Mint
              </label>
              <input
                type="text"
                value={usdcMint}
                onChange={(e) => setUsdcMint(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
                placeholder="USDC mint address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USDT Mint
              </label>
              <input
                type="text"
                value={usdtMint}
                onChange={(e) => setUsdtMint(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm"
                placeholder="USDT mint address"
              />
            </div>
            <button
              onClick={handleUpdateMints}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Token Mints'}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Withdraw Platform Fees</h3>
          <div className="flex gap-4">
            <input
              type="number"
              step="0.001"
              min="0"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md"
              placeholder="Amount in SOL"
            />
            <button
              onClick={handleWithdraw}
              disabled={loading || !withdrawAmount}
              className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Available: {formatTokenAmount(config.totalFeesCollected, TokenType.SOL)} SOL
          </p>
        </div>
      </div>
    </div>
  );
};
