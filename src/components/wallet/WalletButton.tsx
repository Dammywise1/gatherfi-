'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const WalletButton: FC = () => {
  return <WalletMultiButtonDynamic className="!bg-primary hover:!bg-primary/90" />;
};

export default WalletButton;
