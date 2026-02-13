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

export const TOKEN_NAMES = {
  [TokenType.SOL]: 'SOL',
  [TokenType.USDC]: 'USD Coin',
  [TokenType.USDT]: 'Tether USD'
};

export async function getTokenAccount(
  mint: PublicKey | null,
  owner: PublicKey
): Promise<PublicKey | null> {
  if (!mint) return null;
  return await getAssociatedTokenAddress(mint, owner);
}

export function formatTokenAmount(amount: number | bigint, tokenType: TokenType): string {
  const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return (numAmount / Math.pow(10, TOKEN_DECIMALS[tokenType])).toLocaleString();
}

export function parseTokenAmount(amount: string, tokenType: TokenType): number {
  return parseFloat(amount) * Math.pow(10, TOKEN_DECIMALS[tokenType]);
}
