'use client';
import { useState } from 'react';
import { useTicket } from '@/hooks/useTicket';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenType, formatTokenAmount, parseTokenAmount } from '@/utils/tokens';

interface TicketPurchaseProps {
  eventPda: PublicKey;
  event: any;
}

export const TicketPurchase = ({ eventPda, event }: TicketPurchaseProps) => {
  const { purchaseTicket } = useTicket();
  const { publicKey } = useWallet();
  const [selectedToken, setSelectedToken] = useState<TokenType>(event.acceptedTokens[0] || TokenType.SOL);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const totalPrice = event.ticketPrice * quantity;
  const formattedPrice = formatTokenAmount(event.ticketPrice, selectedToken);
  const formattedTotal = formatTokenAmount(totalPrice, selectedToken);
  const ticketsLeft = event.maxTickets - event.ticketsSold;

  const handlePurchase = async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      for (let i = 0; i < quantity; i++) {
        const ticketNumber = event.ticketsSold + i + 1;
        await purchaseTicket(eventPda, ticketNumber, selectedToken);
      }
    } catch (error) {
      console.error('Ticket purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Purchase Tickets</h3>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Ticket Price</p>
        <p className="text-2xl font-bold text-blue-600">{formattedPrice} {selectedToken}</p>
        <p className="text-sm text-gray-600 mt-2">
          {ticketsLeft} tickets available
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Token
          </label>
          <div className="flex gap-2">
            {event.acceptedTokens.map((token: TokenType) => (
              <button
                key={token}
                onClick={() => setSelectedToken(token)}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  selectedToken === token
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {token}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              -
            </button>
            <span className="text-xl font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(ticketsLeft, quantity + 1))}
              className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              disabled={quantity >= ticketsLeft}
            >
              +
            </button>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-bold text-blue-600">
              {formattedTotal} {selectedToken}
            </span>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading || !publicKey || ticketsLeft === 0}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Purchase Tickets'}
          </button>
        </div>
      </div>
    </div>
  );
};
