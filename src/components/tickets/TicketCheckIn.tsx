'use client';
import { useState } from 'react';
import { useTicket } from '@/hooks/useTicket';
import { PublicKey } from '@solana/web3.js';

export const TicketCheckIn = ({ eventPda }: { eventPda: PublicKey }) => {
  const { checkInTicket } = useTicket();
  const [ticketNumber, setTicketNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCheckIn = async (number: number) => {
    setLoading(true);
    setResult(null);
    try {
      await checkInTicket(eventPda, number);
      setResult({ success: true, message: `Ticket #${number} checked in successfully!` });
      setTicketNumber('');
    } catch (error: any) {
      setResult({ success: false, message: error.message || 'Check-in failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Ticket Check-in</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Ticket Number
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md"
              placeholder="Ticket #"
            />
            <button
              onClick={() => handleCheckIn(parseInt(ticketNumber))}
              disabled={loading || !ticketNumber}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Check In
            </button>
          </div>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
};
