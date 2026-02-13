# GatherFi - Decentralized Event Funding on Solana

GatherFi is a decentralized crowdfunding platform for events built on Solana. It enables event organizers to raise funds, sell tickets, and manage budgets through community voting.

## Features

- 🎫 **Event Creation** - Create events with funding goals, ticket prices, and accepted tokens (SOL/USDC/USDT)
- 💰 **Multi-Token Contributions** - Support for SOL, USDC, and USDT with configurable mints
- 🗳️ **Budget Voting** - Contributors vote on budget proposals with voting power = contribution amount
- 📊 **Milestone Management** - Organizers create milestones and release funds upon completion
- 🎟️ **NFT Tickets** - Purchase tickets with accepted tokens, QR code check-in
- 💸 **Profit Sharing** - 60% backers / 35% organizer / 5% platform profit distribution
- 🔄 **Refund System** - Automatic refunds for failed or cancelled events
- ⚙️ **Platform Admin** - Emergency pause, token mint updates, fee withdrawal

## Smart Contract

- **Program ID**: `D9QyTaZjihP9gfch2Ujfg5keKpEU3snAemvMg4mE9DYz`
- **Network**: Solana Devnet
- **Token Mints**:
  - USDC: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
  - USDT: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Phantom Wallet or Solflare

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with:
