import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

export enum TokenType {
  SOL = 'SOL',
  USDC = 'USDC',
  USDT = 'USDT'
}

export const TOKEN_MINTS = {
  [TokenType.SOL]: null,
  [TokenType.USDC]: new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT!),
  [TokenType.USDT]: new PublicKey(process.env.NEXT_PUBLIC_USDT_MINT!)
};

export const TOKEN_DECIMALS = {
  [TokenType.SOL]: 9,
  [TokenType.USDC]: 6,
  [TokenType.USDT]: 6
};

// Helper function to convert Anchor token enum to string
export function getTokenTypeString(tokenEnum: any): string {
  if (typeof tokenEnum === 'string') {
    return tokenEnum;
  }
  if (tokenEnum && typeof tokenEnum === 'object') {
    const key = Object.keys(tokenEnum)[0];
    return key.toUpperCase();
  }
  return 'SOL';
}

export async function getTokenAccount(
  mint: PublicKey | null,
  owner: PublicKey
): Promise<PublicKey | null> {
  if (!mint) return null;
  return await getAssociatedTokenAddress(mint, owner);
}

export function formatTokenAmount(amount: number | bigint, tokenType: any): string {
  const tokenStr = getTokenTypeString(tokenType);
  const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  const decimals = TOKEN_DECIMALS[tokenStr as TokenType] || 9;
  return (numAmount / Math.pow(10, decimals)).toLocaleString();
}

export function parseTokenAmount(amount: string, tokenType: TokenType): number {
  return parseFloat(amount) * Math.pow(10, TOKEN_DECIMALS[tokenType]);
}
