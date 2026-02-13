#!/bin/bash

# ============================================
# GATHERFI - COMPLETE FRONTEND SETUP SCRIPT
# FIXED VERSION - WITH ALL DEPENDENCY UPDATES
# ============================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     GATHERFI - COMPLETE FRONTEND GENERATOR (FIXED)          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"

# ============================================
# CONFIGURATION
# ============================================
PROGRAM_ID="D9QyTaZjihP9gfch2Ujfg5keKpEU3snAemvMg4mE9DYz"
USDC_MINT="4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
USDT_MINT="Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
RPC_ENDPOINT="https://api.devnet.solana.com"

# ============================================
# DELETE EVERYTHING AND START FRESH
# ============================================
echo -e "${YELLOW}⚠️  This will DELETE your current frontend and create a complete new one!${NC}"
echo -e "${YELLOW}⚠️  Press Ctrl+C to cancel, or Enter to continue...${NC}"
read

echo -e "${GREEN}1. Cleaning existing project...${NC}"
rm -rf src app components hooks utils contexts lib public node_modules package-lock.json
rm -f .env.local next.config.js tailwind.config.ts tsconfig.json package.json .eslintrc.json postcss.config.js

# ============================================
# INITIALIZE NEXT.JS PROJECT
# ============================================
echo -e "${GREEN}2. Creating fresh Next.js project...${NC}"
npx create-next-app@latest . --typescript --tailwind --app --use-npm --eslint --src-dir --import-alias "@/*" -y

# ============================================
# INSTALL DEPENDENCIES - FIXED VERSIONS
# ============================================
echo -e "${GREEN}3. Installing Solana/Anchor dependencies (fixed versions)...${NC}"
npm install --save \
  @solana/web3.js@1.91.0 \
  @solana/wallet-adapter-react@0.15.35 \
  @solana/wallet-adapter-wallets@0.19.32 \
  @solana/wallet-adapter-base@0.9.33 \
  @solana/wallet-adapter-react-ui@0.9.34 \
  @coral-xyz/anchor@0.29.0 \
  @solana/spl-token@0.4.6 \
  bs58@5.0.0 \
  react-qr-code@2.0.12 \
  react-hot-toast@2.4.1 \
  date-fns@2.30.0 \
  recharts@2.10.3

npm install --save-dev @types/node

# ============================================
# CREATE FOLDER STRUCTURE
# ============================================
echo -e "${GREEN}4. Creating folder structure...${NC}"
mkdir -p src/app/event/[address]
mkdir -p src/app/event/[address]/funding
mkdir -p src/app/event/[address]/budget
mkdir -p src/app/event/[address]/active
mkdir -p src/app/event/[address]/completed
mkdir -p src/app/event/[address]/failed
mkdir -p src/app/event/create
mkdir -p src/app/admin
mkdir -p src/app/dashboard
mkdir -p src/app/my-tickets
mkdir -p src/app/my-contributions
mkdir -p src/components/event
mkdir -p src/components/budget
mkdir -p src/components/milestone
mkdir -p src/components/tickets
mkdir -p src/components/admin
mkdir -p src/components/profit      # FIXED: Added missing directory
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/contexts
mkdir -p src/idl
mkdir -p src/types
mkdir -p src/lib
mkdir -p public/icons

# ============================================
# CREATE IDL FILE (FULL CONTENT)
# ============================================
echo -e "${GREEN}5. Creating IDL file...${NC}"
cat > src/idl/gatherfi.json << 'EOL'
{
  "version": "0.1.0",
  "name": "gatherfi",
  "instructions": [
    {
      "name": "initializePlatform",
      "accounts": [
        { "name": "admin", "isMut": true, "isSigner": true },
        { "name": "platformConfig", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "createEvent",
      "accounts": [
        { "name": "organizer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "eventId", "type": "u64" },
        { "name": "name", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "targetAmount", "type": "u64" },
        { "name": "ticketPrice", "type": "u64" },
        { "name": "maxTickets", "type": "u32" },
        { "name": "location", "type": "string" },
        { "name": "eventDate", "type": "i64" },
        { "name": "acceptedTokens", "type": { "vec": { "defined": "TokenType" } } }
      ]
    },
    {
      "name": "contribute",
      "accounts": [
        { "name": "contributor", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "contributorAccount", "isMut": true, "isSigner": false },
        { "name": "tokenMint", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "contributorTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "platformConfig", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false, "isOptional": true }
      ],
      "args": [
        { "name": "amount", "type": "u64" },
        { "name": "tokenType", "type": { "defined": "TokenType" } }
      ]
    },
    {
      "name": "purchaseTicket",
      "accounts": [
        { "name": "buyer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "ticket", "isMut": true, "isSigner": false },
        { "name": "tokenMint", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "buyerTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "platformConfig", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false, "isOptional": true }
      ],
      "args": [{ "name": "tokenType", "type": { "defined": "TokenType" } }]
    },
    {
      "name": "releaseMilestone",
      "accounts": [
        { "name": "organizer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "milestone", "isMut": true, "isSigner": false },
        { "name": "tokenMint", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "organizerTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "platformConfig", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false, "isOptional": true }
      ],
      "args": [{ "name": "milestoneIndex", "type": "u8" }]
    },
    {
      "name": "claimRefund",
      "accounts": [
        { "name": "contributor", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "contributorAccount", "isMut": true, "isSigner": false },
        { "name": "tokenMint", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "contributorTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "platformConfig", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false, "isOptional": true }
      ],
      "args": []
    },
    {
      "name": "finalizeFunding",
      "accounts": [
        { "name": "organizer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "finalizeFundingFailure",
      "accounts": [
        { "name": "caller", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "submitBudget",
      "accounts": [
        { "name": "organizer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "budget", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "totalAmount", "type": "u64" }]
    },
    {
      "name": "voteOnBudget",
      "accounts": [
        { "name": "voter", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "budget", "isMut": true, "isSigner": false },
        { "name": "contributor", "isMut": false, "isSigner": false },
        { "name": "vote", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "approve", "type": "bool" }]
    },
    {
      "name": "addMilestone",
      "accounts": [
        { "name": "organizer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "milestone", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "milestoneIndex", "type": "u8" },
        { "name": "description", "type": "string" },
        { "name": "amount", "type": "u64" },
        { "name": "dueDate", "type": "i64" },
        { "name": "tokenType", "type": { "defined": "TokenType" } }
      ]
    },
    {
      "name": "checkInTicket",
      "accounts": [
        { "name": "organizer", "isMut": false, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "ticket", "isMut": true, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "finalizeEvent",
      "accounts": [
        { "name": "organizer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "escrow", "isMut": false, "isSigner": false },
        { "name": "profitDistribution", "isMut": true, "isSigner": false },
        { "name": "platformConfig", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "totalRevenue", "type": "u64" }]
    },
    {
      "name": "updateEvent",
      "accounts": [
        { "name": "organizer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false }
      ],
      "args": [
        { "name": "name", "type": { "option": "string" } },
        { "name": "description", "type": { "option": "string" } },
        { "name": "location", "type": { "option": "string" } },
        { "name": "eventDate", "type": { "option": "i64" } }
      ]
    },
    {
      "name": "cancelEvent",
      "accounts": [
        { "name": "organizer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "emergencyPause",
      "accounts": [
        { "name": "admin", "isMut": true, "isSigner": true },
        { "name": "platformConfig", "isMut": true, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "claimProfit",
      "accounts": [
        { "name": "backer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "profitDistribution", "isMut": true, "isSigner": false },
        { "name": "contributorAccount", "isMut": true, "isSigner": false },
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "tokenMint", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "backerTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "platformConfig", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false, "isOptional": true }
      ],
      "args": []
    },
    {
      "name": "claimOrganizerProfit",
      "accounts": [
        { "name": "organizer", "isMut": true, "isSigner": true },
        { "name": "event", "isMut": true, "isSigner": false },
        { "name": "profitDistribution", "isMut": true, "isSigner": false },
        { "name": "escrow", "isMut": true, "isSigner": false },
        { "name": "tokenMint", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "escrowTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "organizerTokenAccount", "isMut": true, "isSigner": false, "isOptional": true },
        { "name": "platformConfig", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false },
        { "name": "tokenProgram", "isMut": false, "isSigner": false, "isOptional": true }
      ],
      "args": []
    },
    {
      "name": "withdrawFees",
      "accounts": [
        { "name": "admin", "isMut": true, "isSigner": true },
        { "name": "platformConfig", "isMut": true, "isSigner": false },
        { "name": "treasury", "isMut": true, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [{ "name": "amount", "type": "u64" }]
    },
    {
      "name": "updateTokenMints",
      "accounts": [
        { "name": "admin", "isMut": true, "isSigner": true },
        { "name": "platformConfig", "isMut": true, "isSigner": false }
      ],
      "args": [
        { "name": "usdcMint", "type": { "option": "publicKey" } },
        { "name": "usdtMint", "type": { "option": "publicKey" } }
      ]
    }
  ],
  "accounts": [
    {
      "name": "PlatformConfig",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "admin", "type": "publicKey" },
          { "name": "treasury", "type": "publicKey" },
          { "name": "feePercentage", "type": "u8" },
          { "name": "royaltyPercentage", "type": "u8" },
          { "name": "totalFeesCollected", "type": "u64" },
          { "name": "totalVolume", "type": "u64" },
          { "name": "paused", "type": "bool" },
          { "name": "usdcMint", "type": "publicKey" },
          { "name": "usdtMint", "type": "publicKey" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Event",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "organizer", "type": "publicKey" },
          { "name": "eventId", "type": "u64" },
          { "name": "name", "type": "string" },
          { "name": "description", "type": "string" },
          { "name": "targetAmount", "type": "u64" },
          { "name": "amountRaised", "type": "u64" },
          { "name": "ticketPrice", "type": "u64" },
          { "name": "ticketsSold", "type": "u32" },
          { "name": "maxTickets", "type": "u32" },
          { "name": "location", "type": "string" },
          { "name": "eventDate", "type": "i64" },
          { "name": "status", "type": { "defined": "EventStatus" } },
          { "name": "acceptedTokens", "type": { "vec": { "defined": "TokenType" } } },
          { "name": "budgetApproved", "type": "bool" },
          { "name": "fundingDeadline", "type": "i64" },
          { "name": "totalVotes", "type": "u64" },
          { "name": "yesVotes", "type": "u64" },
          { "name": "noVotes", "type": "u64" },
          { "name": "platformFeeAmount", "type": "u64" },
          { "name": "ticketMint", "type": { "option": "publicKey" } },
          { "name": "escrowBump", "type": "u8" },
          { "name": "eventBump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Contributor",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "event", "type": "publicKey" },
          { "name": "contributor", "type": "publicKey" },
          { "name": "amount", "type": "u64" },
          { "name": "votingPower", "type": "u64" },
          { "name": "tokenType", "type": { "defined": "TokenType" } },
          { "name": "profitsClaimed", "type": "u64" },
          { "name": "refundClaimed", "type": "bool" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Ticket",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "mint", "type": "publicKey" },
          { "name": "event", "type": "publicKey" },
          { "name": "owner", "type": "publicKey" },
          { "name": "ticketNumber", "type": "u32" },
          { "name": "checkedIn", "type": "bool" },
          { "name": "pricePaid", "type": "u64" },
          { "name": "tokenType", "type": { "defined": "TokenType" } },
          { "name": "refunded", "type": "bool" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Budget",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "event", "type": "publicKey" },
          { "name": "totalAmount", "type": "u64" },
          { "name": "approved", "type": "bool" },
          { "name": "submittedAt", "type": "i64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Milestone",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "event", "type": "publicKey" },
          { "name": "index", "type": "u8" },
          { "name": "description", "type": "string" },
          { "name": "amount", "type": "u64" },
          { "name": "dueDate", "type": "i64" },
          { "name": "tokenType", "type": { "defined": "TokenType" } },
          { "name": "released", "type": "bool" },
          { "name": "releaseDate", "type": { "option": "i64" } },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "ProfitDistribution",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "event", "type": "publicKey" },
          { "name": "totalRevenue", "type": "u64" },
          { "name": "expenses", "type": "u64" },
          { "name": "netProfit", "type": "u64" },
          { "name": "backersShare", "type": "u64" },
          { "name": "organizerShare", "type": "u64" },
          { "name": "platformShare", "type": "u64" },
          { "name": "distributed", "type": "bool" },
          { "name": "distributionDate", "type": "i64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Escrow",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "event", "type": "publicKey" },
          { "name": "solBalance", "type": "u64" },
          { "name": "usdcBalance", "type": "u64" },
          { "name": "usdtBalance", "type": "u64" },
          { "name": "totalBalance", "type": "u64" },
          { "name": "isInitialized", "type": "bool" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "Vote",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "event", "type": "publicKey" },
          { "name": "voter", "type": "publicKey" },
          { "name": "amount", "type": "u64" },
          { "name": "approve", "type": "bool" },
          { "name": "votedAt", "type": "i64" },
          { "name": "bump", "type": "u8" }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TokenType",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "SOL" },
          { "name": "USDC" },
          { "name": "USDT" }
        ]
      }
    },
    {
      "name": "EventStatus",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "Draft" },
          { "name": "Funding" },
          { "name": "BudgetVoting" },
          { "name": "Active" },
          { "name": "Completed" },
          { "name": "Cancelled" },
          { "name": "Refunding" },
          { "name": "Failed" }
        ]
      }
    }
  ],
  "errors": [
    { "code": 6000, "name": "PlatformPaused", "msg": "Platform is paused" },
    { "code": 6001, "name": "NotAuthorized", "msg": "Not authorized" },
    { "code": 6002, "name": "InvalidNigerianCity", "msg": "Invalid Nigerian city" },
    { "code": 6003, "name": "InsufficientFunds", "msg": "Insufficient funds" },
    { "code": 6004, "name": "EventNotFound", "msg": "Event not found" },
    { "code": 6005, "name": "InvalidEventStatus", "msg": "Invalid event status" },
    { "code": 6006, "name": "FundingTargetNotReached", "msg": "Funding target not reached" },
    { "code": 6007, "name": "FundingDeadlinePassed", "msg": "Funding deadline passed" },
    { "code": 6008, "name": "TicketAlreadyCheckedIn", "msg": "Ticket already checked in" },
    { "code": 6009, "name": "TicketAlreadyRefunded", "msg": "Ticket already refunded" },
    { "code": 6010, "name": "BudgetNotSubmitted", "msg": "Budget not submitted" },
    { "code": 6011, "name": "BudgetNotApproved", "msg": "Budget not approved" },
    { "code": 6012, "name": "MaxTicketsExceeded", "msg": "Max tickets exceeded" },
    { "code": 6013, "name": "ProfitsAlreadyDistributed", "msg": "Profits already distributed" },
    { "code": 6014, "name": "NoProfitsToClaim", "msg": "No profits to claim" },
    { "code": 6015, "name": "AlreadyVoted", "msg": "Already voted" },
    { "code": 6016, "name": "InvalidTokenType", "msg": "Invalid token type" },
    { "code": 6017, "name": "TokenNotAccepted", "msg": "Token not accepted for this event" },
    { "code": 6018, "name": "InvalidMint", "msg": "Invalid mint address" },
    { "code": 6019, "name": "InvalidTokenAccount", "msg": "Invalid token account" },
    { "code": 6020, "name": "ProfitAlreadyClaimed", "msg": "Profit already claimed" },
    { "code": 6021, "name": "NoFeesToWithdraw", "msg": "No fees to withdraw" },
    { "code": 6022, "name": "EventNotFailed", "msg": "Event not failed" }
  ]
}
EOL

# ============================================
# CREATE ENVIRONMENT VARIABLES
# ============================================
echo -e "${GREEN}6. Creating environment variables...${NC}"
cat > .env.local << EOL
NEXT_PUBLIC_PROGRAM_ID=$PROGRAM_ID
NEXT_PUBLIC_USDC_MINT=$USDC_MINT
NEXT_PUBLIC_USDT_MINT=$USDT_MINT
NEXT_PUBLIC_RPC_ENDPOINT=$RPC_ENDPOINT
NEXT_PUBLIC_SOLANA_NETWORK=devnet
EOL

# ============================================
# CREATE UTILITY FILES
# ============================================
echo -e "${GREEN}7. Creating utility files...${NC}"

# Token Types
cat > src/utils/tokens.ts << 'EOL'
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
EOL

# Nigerian Cities Validator
cat > src/utils/location.ts << 'EOL'
export const NIGERIAN_CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Benin City",
  "Enugu",
  "Aba",
  "Jos",
  "Ilorin"
];

export const validateNigerianCity = (location: string): boolean => {
  return NIGERIAN_CITIES.some(city => 
    location.toLowerCase().includes(city.toLowerCase())
  );
};

export const getCityFromLocation = (location: string): string | null => {
  const matched = NIGERIAN_CITIES.find(city => 
    location.toLowerCase().includes(city.toLowerCase())
  );
  return matched || null;
};
EOL

# Event Status
cat > src/utils/status.ts << 'EOL'
import { EventStatus } from '@/types/gatherfi';

export const EVENT_STATUS_LABELS: Record<keyof typeof EventStatus, string> = {
  Draft: 'Draft',
  Funding: 'Funding',
  BudgetVoting: 'Budget Voting',
  Active: 'Active',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Refunding: 'Refunding',
  Failed: 'Failed'
};

export const EVENT_STATUS_COLORS: Record<keyof typeof EventStatus, string> = {
  Draft: 'bg-gray-500',
  Funding: 'bg-blue-500',
  BudgetVoting: 'bg-yellow-500',
  Active: 'bg-green-500',
  Completed: 'bg-purple-500',
  Cancelled: 'bg-red-500',
  Refunding: 'bg-orange-500',
  Failed: 'bg-red-700'
};

export const EVENT_STATUS_STEPS = [
  'Funding',
  'BudgetVoting',
  'Active',
  'Completed'
];

export function getNextStatus(current: EventStatus): EventStatus | null {
  switch (current) {
    case EventStatus.Funding:
      return EventStatus.BudgetVoting;
    case EventStatus.BudgetVoting:
      return EventStatus.Active;
    case EventStatus.Active:
      return EventStatus.Completed;
    default:
      return null;
  }
}
EOL

# Anchor Setup - FIXED with @coral-xyz/anchor
cat > src/utils/anchor.ts << 'EOL'
import { Program, AnchorProvider, Idl, setProvider } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Commitment } from '@solana/web3.js';
import idl from '@/idl/gatherfi.json';

export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);

export function useGatherFiProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getProgram = () => {
    if (!wallet.publicKey) throw new Error('Wallet not connected');
    
    const provider = new AnchorProvider(
      connection,
      wallet as any,
      {
        commitment: 'confirmed' as Commitment,
        preflightCommitment: 'confirmed' as Commitment,
      }
    );
    
    setProvider(provider);
    
    return new Program(idl as Idl, PROGRAM_ID, provider);
  };

  const getProgramWithSigner = () => {
    const program = getProgram();
    if (!program.provider.publicKey) throw new Error('No public key');
    return program;
  };

  return { 
    getProgram, 
    getProgramWithSigner,
    PROGRAM_ID 
  };
}

export function findEventPDA(organizer: PublicKey, eventId: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('event'), organizer.toBuffer(), Buffer.from(eventId.toString())],
    PROGRAM_ID
  );
}

export function findEscrowPDA(event: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), event.toBuffer()],
    PROGRAM_ID
  );
}

export function findContributorPDA(event: PublicKey, contributor: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('contributor'), event.toBuffer(), contributor.toBuffer()],
    PROGRAM_ID
  );
}

export function findTicketPDA(event: PublicKey, ticketNumber: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('ticket'), event.toBuffer(), Buffer.from(ticketNumber.toString())],
    PROGRAM_ID
  );
}

export function findBudgetPDA(event: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('budget'), event.toBuffer()],
    PROGRAM_ID
  );
}

export function findMilestonePDA(event: PublicKey, index: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('milestone'), event.toBuffer(), Buffer.from(index.toString())],
    PROGRAM_ID
  );
}

export function findVotePDA(event: PublicKey, voter: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vote'), event.toBuffer(), voter.toBuffer()],
    PROGRAM_ID
  );
}

export function findProfitDistributionPDA(event: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('profit'), event.toBuffer()],
    PROGRAM_ID
  );
}

export function findPlatformConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('platform')],
    PROGRAM_ID
  );
}
EOL

# Date Utils
cat > src/utils/date.ts << 'EOL'
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

export function formatTimestamp(timestamp: number): string {
  return format(fromUnixTime(timestamp), 'PPP p');
}

export function formatDate(timestamp: number): string {
  return format(fromUnixTime(timestamp), 'PPP');
}

export function formatTime(timestamp: number): string {
  return format(fromUnixTime(timestamp), 'p');
}

export function timeAgo(timestamp: number): string {
  return formatDistanceToNow(fromUnixTime(timestamp), { addSuffix: true });
}

export function isDeadlinePassed(timestamp: number): boolean {
  return Date.now() / 1000 > timestamp;
}

export function daysRemaining(timestamp: number): number {
  const now = Date.now() / 1000;
  if (now > timestamp) return 0;
  return Math.ceil((timestamp - now) / (24 * 60 * 60));
}
EOL

# ============================================
# CREATE CONTEXTS
# ============================================
echo -e "${GREEN}8. Creating context providers...${NC}"

# Wallet Context
cat > src/contexts/WalletContextProvider.tsx << 'EOL'
'use client';
import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter,
  TorusWalletAdapter 
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter()
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
EOL

# Toast Context
cat > src/contexts/ToastContext.tsx << 'EOL'
'use client';
import { createContext, useContext, ReactNode, FC } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  loading: (message: string) => void;
  dismiss: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const success = (message: string) => toast.success(message);
  const error = (message: string) => toast.error(message);
  const loading = (message: string) => toast.loading(message);
  const dismiss = () => toast.dismiss();

  return (
    <ToastContext.Provider value={{ success, error, loading, dismiss }}>
      {children}
      <Toaster position="top-right" />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
EOL

# ============================================
# CREATE HOOKS (ALL 7 HOOKS)
# ============================================
echo -e "${GREEN}9. Creating all custom hooks...${NC}"

# usePlatform Hook
cat > src/hooks/usePlatform.ts << 'EOL'
import { useGatherFiProgram, findPlatformConfigPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { useToast } from '@/contexts/ToastContext';
import { useWallet } from '@solana/wallet-adapter-react';

export const usePlatform = () => {
  const { getProgramWithSigner, PROGRAM_ID } = useGatherFiProgram();
  const { success, error } = useToast();
  const { publicKey } = useWallet();

  const getPlatformConfig = async () => {
    try {
      const program = getProgramWithSigner();
      const [configPda] = findPlatformConfigPDA();
      return await program.account.platformConfig.fetch(configPda);
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
EOL

# useEvent Hook
cat > src/hooks/useEvent.ts << 'EOL'
import { useGatherFiProgram, findEventPDA, findEscrowPDA, findBudgetPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenType } from '@/utils/tokens';
import { useToast } from '@/contexts/ToastContext';
import { EventStatus } from '@/types/gatherfi';

export const useEvent = () => {
  const { getProgramWithSigner, PROGRAM_ID } = useGatherFiProgram();
  const { success, error } = useToast();

  const createEvent = async (
    eventId: number,
    name: string,
    description: string,
    targetAmount: number,
    ticketPrice: number,
    maxTickets: number,
    location: string,
    eventDate: number,
    acceptedTokens: TokenType[]
  ) => {
    try {
      const program = getProgramWithSigner();
      const [eventPda] = findEventPDA(program.provider.publicKey, eventId);
      const [escrowPda] = findEscrowPDA(eventPda);

      const tx = await program.methods
        .createEvent(
          eventId,
          name,
          description,
          targetAmount,
          ticketPrice,
          maxTickets,
          location,
          eventDate,
          acceptedTokens
        )
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          escrow: escrowPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Event created successfully!');
      return { tx, eventPda, escrowPda };
    } catch (err: any) {
      error(err.message || 'Failed to create event');
      throw err;
    }
  };

  const getEvent = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      return await program.account.event.fetch(eventPda);
    } catch (err) {
      console.error('Error fetching event:', err);
      throw err;
    }
  };

  const updateEvent = async (
    eventPda: PublicKey,
    name?: string,
    description?: string,
    location?: string,
    eventDate?: number
  ) => {
    try {
      const program = getProgramWithSigner();
      
      const tx = await program.methods
        .updateEvent(
          name ? name : null,
          description ? description : null,
          location ? location : null,
          eventDate ? eventDate : null
        )
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda
        })
        .rpc();

      success('Event updated successfully');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to update event');
      throw err;
    }
  };

  const cancelEvent = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      
      const tx = await program.methods
        .cancelEvent()
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda
        })
        .rpc();

      success('Event cancelled successfully');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to cancel event');
      throw err;
    }
  };

  const finalizeFunding = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      
      const tx = await program.methods
        .finalizeFunding()
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Funding finalized! Moving to budget voting.');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to finalize funding');
      throw err;
    }
  };

  const finalizeFundingFailure = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      
      const tx = await program.methods
        .finalizeFundingFailure()
        .accounts({
          caller: program.provider.publicKey,
          event: eventPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Event marked as failed');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to mark event as failed');
      throw err;
    }
  };

  const getAllEvents = async () => {
    try {
      const program = getProgramWithSigner();
      const events = await program.account.event.all();
      return events.sort((a, b) => b.account.eventId.cmp(a.account.eventId));
    } catch (err) {
      console.error('Error fetching events:', err);
      return [];
    }
  };

  const getEventsByOrganizer = async (organizer: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const events = await program.account.event.all([
        {
          memcmp: {
            offset: 8,
            bytes: organizer.toBase58()
          }
        }
      ]);
      return events;
    } catch (err) {
      console.error('Error fetching organizer events:', err);
      return [];
    }
  };

  const getEventsByStatus = async (status: EventStatus) => {
    try {
      const program = getProgramWithSigner();
      const events = await program.account.event.all();
      return events.filter(e => e.account.status === status);
    } catch (err) {
      console.error('Error fetching events by status:', err);
      return [];
    }
  };

  return {
    createEvent,
    getEvent,
    updateEvent,
    cancelEvent,
    finalizeFunding,
    finalizeFundingFailure,
    getAllEvents,
    getEventsByOrganizer,
    getEventsByStatus
  };
};
EOL

# useContribution Hook
cat > src/hooks/useContribution.ts << 'EOL'
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
EOL

# useBudget Hook
cat > src/hooks/useBudget.ts << 'EOL'
import { useGatherFiProgram, findBudgetPDA, findContributorPDA, findVotePDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { useToast } from '@/contexts/ToastContext';

export const useBudget = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { success, error } = useToast();

  const submitBudget = async (eventPda: PublicKey, totalAmount: number) => {
    try {
      const program = getProgramWithSigner();
      const [budgetPda] = findBudgetPDA(eventPda);

      const tx = await program.methods
        .submitBudget(totalAmount)
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          budget: budgetPda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Budget submitted successfully!');
      return { tx, budgetPda };
    } catch (err: any) {
      error(err.message || 'Failed to submit budget');
      throw err;
    }
  };

  const getBudget = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const [budgetPda] = findBudgetPDA(eventPda);
      return await program.account.budget.fetch(budgetPda);
    } catch {
      return null;
    }
  };

  const voteOnBudget = async (eventPda: PublicKey, approve: boolean) => {
    try {
      const program = getProgramWithSigner();
      const [budgetPda] = findBudgetPDA(eventPda);
      const [contributorPda] = findContributorPDA(eventPda, program.provider.publicKey);
      const [votePda] = findVotePDA(eventPda, program.provider.publicKey);

      const tx = await program.methods
        .voteOnBudget(approve)
        .accounts({
          voter: program.provider.publicKey,
          event: eventPda,
          budget: budgetPda,
          contributor: contributorPda,
          vote: votePda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success(`Voted ${approve ? 'YES' : 'NO'} on budget!`);
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to vote');
      throw err;
    }
  };

  const getVote = async (eventPda: PublicKey, voter: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const [votePda] = findVotePDA(eventPda, voter);
      return await program.account.vote.fetch(votePda);
    } catch {
      return null;
    }
  };

  return {
    submitBudget,
    getBudget,
    voteOnBudget,
    getVote
  };
};
EOL

# useMilestone Hook
cat > src/hooks/useMilestone.ts << 'EOL'
import { useGatherFiProgram, findMilestonePDA, findEscrowPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenType, getTokenAccount } from '@/utils/tokens';
import { useToast } from '@/contexts/ToastContext';
import { TOKEN_MINTS } from '@/utils/tokens';

export const useMilestone = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { success, error } = useToast();

  const addMilestone = async (
    eventPda: PublicKey,
    milestoneIndex: number,
    description: string,
    amount: number,
    dueDate: number,
    tokenType: TokenType
  ) => {
    try {
      const program = getProgramWithSigner();
      const [milestonePda] = findMilestonePDA(eventPda, milestoneIndex);

      const tx = await program.methods
        .addMilestone(
          milestoneIndex,
          description,
          amount,
          dueDate,
          tokenType
        )
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          milestone: milestonePda,
          systemProgram: PublicKey.default
        })
        .rpc();

      success('Milestone added successfully!');
      return { tx, milestonePda };
    } catch (err: any) {
      error(err.message || 'Failed to add milestone');
      throw err;
    }
  };

  const releaseMilestone = async (
    eventPda: PublicKey,
    milestoneIndex: number,
    tokenType: TokenType
  ) => {
    try {
      const program = getProgramWithSigner();
      const [escrowPda] = findEscrowPDA(eventPda);
      const [milestonePda] = findMilestonePDA(eventPda, milestoneIndex);
      const [platformConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      let accounts: any = {
        organizer: program.provider.publicKey,
        event: eventPda,
        escrow: escrowPda,
        milestone: milestonePda,
        platformConfig: platformConfigPda,
        systemProgram: PublicKey.default
      };

      if (tokenType !== TokenType.SOL) {
        const mint = TOKEN_MINTS[tokenType];
        const escrowTokenAccount = await getTokenAccount(mint, escrowPda);
        const organizerTokenAccount = await getTokenAccount(mint, program.provider.publicKey);
        
        accounts = {
          ...accounts,
          tokenMint: mint,
          escrowTokenAccount,
          organizerTokenAccount,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        };
      }

      const tx = await program.methods
        .releaseMilestone(milestoneIndex)
        .accounts(accounts)
        .rpc();

      success('Milestone released successfully!');
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to release milestone');
      throw err;
    }
  };

  const getMilestone = async (eventPda: PublicKey, milestoneIndex: number) => {
    try {
      const program = getProgramWithSigner();
      const [milestonePda] = findMilestonePDA(eventPda, milestoneIndex);
      return await program.account.milestone.fetch(milestonePda);
    } catch {
      return null;
    }
  };

  const getAllMilestones = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const milestones = await program.account.milestone.all([
        {
          memcmp: {
            offset: 8,
            bytes: eventPda.toBase58()
          }
        }
      ]);
      return milestones.sort((a, b) => a.account.index - b.account.index);
    } catch (err) {
      console.error('Error fetching milestones:', err);
      return [];
    }
  };

  return {
    addMilestone,
    releaseMilestone,
    getMilestone,
    getAllMilestones
  };
};
EOL

# useTicket Hook
cat > src/hooks/useTicket.ts << 'EOL'
import { useGatherFiProgram, findTicketPDA, findEscrowPDA } from '@/utils/anchor';
import { PublicKey } from '@solana/web3.js';
import { TokenType, getTokenAccount } from '@/utils/tokens';
import { useToast } from '@/contexts/ToastContext';
import { TOKEN_MINTS } from '@/utils/tokens';

export const useTicket = () => {
  const { getProgramWithSigner } = useGatherFiProgram();
  const { success, error } = useToast();

  const purchaseTicket = async (
    eventPda: PublicKey,
    ticketNumber: number,
    tokenType: TokenType
  ) => {
    try {
      const program = getProgramWithSigner();
      const [escrowPda] = findEscrowPDA(eventPda);
      const [ticketPda] = findTicketPDA(eventPda, ticketNumber);
      const [platformConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('platform')],
        program.programId
      );

      let accounts: any = {
        buyer: program.provider.publicKey,
        event: eventPda,
        escrow: escrowPda,
        ticket: ticketPda,
        platformConfig: platformConfigPda,
        systemProgram: PublicKey.default
      };

      if (tokenType !== TokenType.SOL) {
        const mint = TOKEN_MINTS[tokenType];
        const buyerTokenAccount = await getTokenAccount(mint, program.provider.publicKey);
        const escrowTokenAccount = await getTokenAccount(mint, escrowPda);
        
        accounts = {
          ...accounts,
          tokenMint: mint,
          buyerTokenAccount,
          escrowTokenAccount,
          tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        };
      }

      const tx = await program.methods
        .purchaseTicket(tokenType)
        .accounts(accounts)
        .rpc();

      success(`Ticket #${ticketNumber} purchased successfully!`);
      return { tx, ticketPda };
    } catch (err: any) {
      error(err.message || 'Failed to purchase ticket');
      throw err;
    }
  };

  const checkInTicket = async (eventPda: PublicKey, ticketNumber: number) => {
    try {
      const program = getProgramWithSigner();
      const [ticketPda] = findTicketPDA(eventPda, ticketNumber);

      const tx = await program.methods
        .checkInTicket()
        .accounts({
          organizer: program.provider.publicKey,
          event: eventPda,
          ticket: ticketPda
        })
        .rpc();

      success(`Ticket #${ticketNumber} checked in successfully!`);
      return tx;
    } catch (err: any) {
      error(err.message || 'Failed to check in ticket');
      throw err;
    }
  };

  const getTicket = async (eventPda: PublicKey, ticketNumber: number) => {
    try {
      const program = getProgramWithSigner();
      const [ticketPda] = findTicketPDA(eventPda, ticketNumber);
      return await program.account.ticket.fetch(ticketPda);
    } catch {
      return null;
    }
  };

  const getUserTickets = async (user: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const tickets = await program.account.ticket.all([
        {
          memcmp: {
            offset: 8 + 32 + 32,
            bytes: user.toBase58()
          }
        }
      ]);
      return tickets;
    } catch (err) {
      console.error('Error fetching user tickets:', err);
      return [];
    }
  };

  const getEventTickets = async (eventPda: PublicKey) => {
    try {
      const program = getProgramWithSigner();
      const tickets = await program.account.ticket.all([
        {
          memcmp: {
            offset: 8,
            bytes: eventPda.toBase58()
          }
        }
      ]);
      return tickets.sort((a, b) => a.account.ticketNumber - b.account.ticketNumber);
    } catch (err) {
      console.error('Error fetching event tickets:', err);
      return [];
    }
  };

  return {
    purchaseTicket,
    checkInTicket,
    getTicket,
    getUserTickets,
    getEventTickets
  };
};
EOL

# useProfit Hook
cat > src/hooks/useProfit.ts << 'EOL'
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
EOL

# ============================================
# CREATE COMPONENTS (ALL UI COMPONENTS)
# ============================================
echo -e "${GREEN}10. Creating all React components...${NC}"

# Layout Components
cat > src/components/layout/Navbar.tsx << 'EOL'
'use client';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePlatform } from '@/hooks/usePlatform';

export const Navbar = () => {
  const { publicKey } = useWallet();
  const pathname = usePathname();
  const { isAdmin } = usePlatform();
  const [adminStatus, setAdminStatus] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (publicKey) {
        const admin = await isAdmin();
        setAdminStatus(admin);
      }
    };
    checkAdmin();
  }, [publicKey, isAdmin]);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/event/create', label: 'Create Event' },
    ...(publicKey ? [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/my-tickets', label: 'My Tickets' },
      { href: '/my-contributions', label: 'My Contributions' }
    ] : []),
    ...(adminStatus ? [{ href: '/admin', label: 'Admin' }] : [])
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              GatherFi
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
};
EOL

cat > src/components/layout/Footer.tsx << 'EOL'
export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <p className="text-center text-gray-500 text-sm">
          © 2026 GatherFi - Decentralized Event Funding on Solana
        </p>
      </div>
    </footer>
  );
};
EOL

# UI Components
cat > src/components/ui/LoadingSpinner.tsx << 'EOL'
export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-blue-200 border-t-blue-600`} />
    </div>
  );
};
EOL

cat > src/components/ui/StatusBadge.tsx << 'EOL'
import { EventStatus } from '@/types/gatherfi';
import { EVENT_STATUS_LABELS, EVENT_STATUS_COLORS } from '@/utils/status';

export const StatusBadge = ({ status }: { status: EventStatus }) => {
  const label = EVENT_STATUS_LABELS[status as keyof typeof EVENT_STATUS_LABELS] || status;
  const color = EVENT_STATUS_COLORS[status as keyof typeof EVENT_STATUS_COLORS] || 'bg-gray-500';

  return (
    <span className={`${color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
      {label}
    </span>
  );
};
EOL

cat > src/components/ui/ProgressBar.tsx << 'EOL'
export const ProgressBar = ({ 
  current, 
  total, 
  label 
}: { 
  current: number; 
  total: number; 
  label?: string;
}) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="w-full">
      {label && <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{percentage.toFixed(1)}%</span>
      </div>}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
EOL

# Event Components
cat > src/components/event/EventCard.tsx << 'EOL'
'use client';
import { Event } from '@/types/gatherfi';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatTokenAmount } from '@/utils/tokens';
import { formatDate, daysRemaining } from '@/utils/date';
import Link from 'next/link';
import { PublicKey } from '@solana/web3.js';

interface EventCardProps {
  event: Event;
  eventPda: PublicKey;
}

export const EventCard = ({ event, eventPda }: EventCardProps) => {
  const progress = (event.amountRaised / event.targetAmount) * 100;
  const daysLeft = daysRemaining(event.fundingDeadline);

  return (
    <Link href={`/event/${eventPda.toBase58()}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
          <StatusBadge status={event.status} />
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-3">
          <ProgressBar
            current={event.amountRaised}
            total={event.targetAmount}
            label={`${formatTokenAmount(event.amountRaised, event.acceptedTokens[0])} / ${formatTokenAmount(event.targetAmount, event.acceptedTokens[0])} raised`}
          />
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {event.ticketsSold} / {event.maxTickets} tickets sold
            </span>
            <span className="text-gray-500">
              {daysLeft} days left
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-500">
              📍 {event.location}
            </span>
            <span className="text-sm text-gray-500">
              📅 {formatDate(event.eventDate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
EOL

cat > src/components/event/EventList.tsx << 'EOL'
'use client';
import { useEffect, useState } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { EventCard } from './EventCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EventStatus } from '@/types/gatherfi';

export const EventList = ({ statusFilter }: { statusFilter?: EventStatus }) => {
  const { getAllEvents, getEventsByStatus } = useEvent();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = statusFilter 
          ? await getEventsByStatus(statusFilter)
          : await getAllEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [statusFilter]);

  if (loading) return <LoadingSpinner />;

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No events found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(({ pubkey, account }) => (
        <EventCard key={pubkey.toBase58()} event={account} eventPda={pubkey} />
      ))}
    </div>
  );
};
EOL

# Event Creation Form
cat > src/components/event/EventCreationForm.tsx << 'EOL'
'use client';
import { useState } from 'react';
import { useEvent } from '@/hooks/useEvent';
import { TokenType } from '@/utils/tokens';
import { validateNigerianCity, NIGERIAN_CITIES } from '@/utils/location';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export const EventCreationForm = () => {
  const { createEvent } = useEvent();
  const { publicKey } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    ticketPrice: '',
    maxTickets: '',
    location: '',
    eventDate: '',
    acceptedTokens: [] as TokenType[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }

    if (!validateNigerianCity(formData.location)) {
      alert(`Location must be a Nigerian city: ${NIGERIAN_CITIES.join(', ')}`);
      return;
    }

    if (formData.acceptedTokens.length === 0) {
      alert('Please select at least one accepted token');
      return;
    }

    setLoading(true);
    try {
      const eventId = Date.now();
      const { eventPda } = await createEvent(
        eventId,
        formData.name,
        formData.description,
        Number(formData.targetAmount),
        Number(formData.ticketPrice),
        Number(formData.maxTickets),
        formData.location,
        new Date(formData.eventDate).getTime() / 1000,
        formData.acceptedTokens
      );
      
      alert('Event created successfully!');
      router.push(`/event/${eventPda.toBase58()}`);
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(error.message || 'Error creating event');
    } finally {
      setLoading(false);
    }
  };

  const toggleToken = (token: TokenType) => {
    setFormData(prev => ({
      ...prev,
      acceptedTokens: prev.acceptedTokens.includes(token)
        ? prev.acceptedTokens.filter(t => t !== token)
        : [...prev.acceptedTokens, token]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Solana Lagos Meetup 2026"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your event, its purpose, and why people should fund it..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Amount (lamports) *
            </label>
            <input
              type="number"
              min="0"
              value={formData.targetAmount}
              onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="1000000000"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              1 SOL = 1,000,000,000 lamports
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Price (lamports) *
            </label>
            <input
              type="number"
              min="0"
              value={formData.ticketPrice}
              onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="10000000"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Tickets *
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxTickets}
              onChange={(e) => setFormData({...formData, maxTickets: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.eventDate}
              onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Nigerian City) *
          </label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a city</option>
            {NIGERIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accepted Tokens * (Select at least one)
          </label>
          <div className="grid grid-cols-3 gap-4">
            {Object.values(TokenType).map((token) => (
              <label
                key={token}
                className={`
                  flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${formData.acceptedTokens.includes(token) 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.acceptedTokens.includes(token)}
                  onChange={() => toggleToken(token)}
                />
                <span className="font-medium">{token}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={loading || !publicKey}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>

        {!publicKey && (
          <p className="text-center text-yellow-600 text-sm">
            Please connect your wallet to create an event
          </p>
        )}
      </form>
    </div>
  );
};
EOL

# Contribution Form
cat > src/components/event/ContributionForm.tsx << 'EOL'
'use client';
import { useState } from 'react';
import { TokenType, parseTokenAmount, formatTokenAmount } from '@/utils/tokens';
import { useContribution } from '@/hooks/useContribution';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface ContributionFormProps {
  eventPda: PublicKey;
  acceptedTokens: TokenType[];
  targetAmount: number;
  amountRaised: number;
}

export const ContributionForm = ({ 
  eventPda, 
  acceptedTokens, 
  targetAmount, 
  amountRaised 
}: ContributionFormProps) => {
  const { contribute } = useContribution();
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenType>(acceptedTokens[0] || TokenType.SOL);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }

    setLoading(true);
    try {
      const parsedAmount = parseTokenAmount(amount, selectedToken);
      await contribute(eventPda, parsedAmount, selectedToken);
      setAmount('');
    } catch (error) {
      console.error('Contribution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const remainingAmount = targetAmount - amountRaised;
  const remainingFormatted = formatTokenAmount(remainingAmount, selectedToken);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Contribute to this Event</h3>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Funding Goal Remaining</p>
        <p className="text-2xl font-bold text-blue-600">{remainingFormatted} {selectedToken}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Token
          </label>
          <div className="flex gap-2">
            {acceptedTokens.map((token) => (
              <button
                key={token}
                type="button"
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
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder={`0.00 ${selectedToken}`}
              required
            />
            <span className="absolute right-3 top-3 text-gray-500">
              {selectedToken}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : `Contribute ${selectedToken}`}
        </button>
      </form>
    </div>
  );
};
EOL

# Budget Voting Component
cat > src/components/budget/BudgetVoting.tsx << 'EOL'
'use client';
import { useState, useEffect } from 'react';
import { useBudget } from '@/hooks/useBudget';
import { useContribution } from '@/hooks/useContribution';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatTokenAmount } from '@/utils/tokens';

interface BudgetVotingProps {
  eventPda: PublicKey;
  event: any;
}

export const BudgetVoting = ({ eventPda, event }: BudgetVotingProps) => {
  const { voteOnBudget, getVote, getBudget } = useBudget();
  const { getContributor } = useContribution();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteDirection, setVoteDirection] = useState<boolean | null>(null);
  const [votingPower, setVotingPower] = useState(0);
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!publicKey) return;
      
      const contributor = await getContributor(eventPda, publicKey);
      if (contributor) {
        setVotingPower(contributor.votingPower);
      }

      const vote = await getVote(eventPda, publicKey);
      if (vote) {
        setHasVoted(true);
        setVoteDirection(vote.approve);
      }

      const budgetData = await getBudget(eventPda);
      setBudget(budgetData);
    };
    fetchData();
  }, [eventPda, publicKey]);

  const handleVote = async (approve: boolean) => {
    if (!publicKey) return;
    setLoading(true);
    try {
      await voteOnBudget(eventPda, approve);
      setHasVoted(true);
      setVoteDirection(approve);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const yesPercentage = event.totalVotes > 0 
    ? (event.yesVotes / event.totalVotes) * 100 
    : 0;

  const formattedVotingPower = formatTokenAmount(votingPower, event.acceptedTokens[0]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Budget Voting</h3>
      
      {budget && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Proposed Budget</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatTokenAmount(budget.totalAmount, event.acceptedTokens[0])} {event.acceptedTokens[0]}
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Current Votes</span>
          <span className="text-sm font-medium text-gray-700">
            {yesPercentage.toFixed(1)}% Yes
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${yesPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>✅ Yes: {formatTokenAmount(event.yesVotes, event.acceptedTokens[0])}</span>
          <span>❌ No: {formatTokenAmount(event.noVotes, event.acceptedTokens[0])}</span>
        </div>
      </div>

      {publicKey && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Your Voting Power</p>
          <p className="text-xl font-semibold text-blue-600">{formattedVotingPower} {event.acceptedTokens[0]}</p>
        </div>
      )}

      {!hasVoted ? (
        <div className="space-y-3">
          <button
            onClick={() => handleVote(true)}
            disabled={loading || !publicKey || votingPower === 0}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Voting...' : 'Vote YES'}
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={loading || !publicKey || votingPower === 0}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? 'Voting...' : 'Vote NO'}
          </button>
          {votingPower === 0 && publicKey && (
            <p className="text-sm text-gray-500 text-center">
              You need to contribute to vote
            </p>
          )}
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            You voted <span className="font-semibold">{voteDirection ? 'YES' : 'NO'}</span>
          </p>
        </div>
      )}
    </div>
  );
};
EOL

# Milestone Components
cat > src/components/milestone/MilestoneList.tsx << 'EOL'
'use client';
import { useState, useEffect } from 'react';
import { useMilestone } from '@/hooks/useMilestone';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatTokenAmount } from '@/utils/tokens';
import { formatDate, isDeadlinePassed } from '@/utils/date';

interface MilestoneListProps {
  eventPda: PublicKey;
  event: any;
  isOrganizer: boolean;
}

export const MilestoneList = ({ eventPda, event, isOrganizer }: MilestoneListProps) => {
  const { getAllMilestones, releaseMilestone } = useMilestone();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMilestones = async () => {
      const fetched = await getAllMilestones(eventPda);
      setMilestones(fetched);
    };
    fetchMilestones();
  }, [eventPda]);

  const handleRelease = async (milestoneIndex: number, tokenType: any) => {
    setLoading(true);
    try {
      await releaseMilestone(eventPda, milestoneIndex, tokenType);
      const updated = await getAllMilestones(eventPda);
      setMilestones(updated);
    } catch (error) {
      console.error('Failed to release milestone:', error);
    } finally {
      setLoading(false);
    }
  };

  if (milestones.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No milestones added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Milestones</h3>
      <div className="space-y-4">
        {milestones.map(({ account: milestone }) => (
          <div
            key={milestone.index}
            className={`border rounded-lg p-4 ${
              milestone.released ? 'bg-gray-50 border-gray-200' : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">
                  Milestone {milestone.index + 1}: {milestone.description}
                </h4>
                <p className="text-sm text-gray-600">
                  Amount: {formatTokenAmount(milestone.amount, milestone.tokenType)} {milestone.tokenType}
                </p>
                <p className="text-sm text-gray-600">
                  Due: {formatDate(milestone.dueDate)}
                </p>
                {milestone.released && milestone.releaseDate && (
                  <p className="text-sm text-green-600">
                    Released: {formatDate(milestone.releaseDate)}
                  </p>
                )}
              </div>
              {isOrganizer && !milestone.released && (
                <button
                  onClick={() => handleRelease(milestone.index, milestone.tokenType)}
                  disabled={loading || !isDeadlinePassed(milestone.dueDate)}
                  className={`px-4 py-2 rounded-md text-white ${
                    isDeadlinePassed(milestone.dueDate)
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Releasing...' : 'Release'}
                </button>
              )}
              {milestone.released && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Released
                </span>
              )}
            </div>
            {!isDeadlinePassed(milestone.dueDate) && !milestone.released && (
              <p className="text-sm text-yellow-600 mt-2">
                ⏳ Available to release on {formatDate(milestone.dueDate)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
EOL

cat > src/components/milestone/AddMilestoneForm.tsx << 'EOL'
'use client';
import { useState } from 'react';
import { useMilestone } from '@/hooks/useMilestone';
import { PublicKey } from '@solana/web3.js';
import { TokenType, parseTokenAmount } from '@/utils/tokens';

interface AddMilestoneFormProps {
  eventPda: PublicKey;
  acceptedTokens: TokenType[];
  onSuccess?: () => void;
}

export const AddMilestoneForm = ({ eventPda, acceptedTokens, onSuccess }: AddMilestoneFormProps) => {
  const { addMilestone } = useMilestone();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    dueDate: '',
    tokenType: acceptedTokens[0] || TokenType.SOL
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const milestoneIndex = Date.now();
      const parsedAmount = parseTokenAmount(formData.amount, formData.tokenType);
      const dueDateTimestamp = new Date(formData.dueDate).getTime() / 1000;
      
      await addMilestone(
        eventPda,
        milestoneIndex,
        formData.description,
        parsedAmount,
        dueDateTimestamp,
        formData.tokenType
      );
      
      setFormData({
        description: '',
        amount: '',
        dueDate: '',
        tokenType: acceptedTokens[0] || TokenType.SOL
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to add milestone:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Add Milestone</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="e.g., Venue booking completed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-md"
              placeholder="0.00"
              required
            />
            <select
              value={formData.tokenType}
              onChange={(e) => setFormData({ ...formData, tokenType: e.target.value as TokenType })}
              className="w-32 p-3 border border-gray-300 rounded-md"
            >
              {acceptedTokens.map((token) => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Milestone'}
        </button>
      </form>
    </div>
  );
};
EOL

# Ticket Components
cat > src/components/tickets/TicketPurchase.tsx << 'EOL'
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
EOL

cat > src/components/tickets/TicketCheckIn.tsx << 'EOL'
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
EOL

# ProfitClaim Component - FIXED with correct imports
cat > src/components/profit/ProfitClaim.tsx << 'EOL'
'use client';
import { useState, useEffect } from 'react';
import { useProfit } from '@/hooks/useProfit';
import { useContribution } from '@/hooks/useContribution';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatTokenAmount, TokenType } from '@/utils/tokens';
import { Cell, Pie, PieChart, Tooltip, Legend } from 'recharts';

interface ProfitClaimProps {
  eventPda: PublicKey;
  event: any;
  isOrganizer: boolean;
}

export const ProfitClaim = ({ eventPda, event, isOrganizer }: ProfitClaimProps) => {
  const { getProfitDistribution, claimProfit, claimOrganizerProfit } = useProfit();
  const { getContributor } = useContribution();
  const { publicKey } = useWallet();
  const [profit, setProfit] = useState<any>(null);
  const [contributor, setContributor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [backerProfitAmount, setBackerProfitAmount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const profitData = await getProfitDistribution(eventPda);
      setProfit(profitData);
      
      if (publicKey && !isOrganizer) {
        const contributorData = await getContributor(eventPda, publicKey);
        setContributor(contributorData);
        
        if (profitData && contributorData && event.amountRaised > 0) {
          const share = (contributorData.amount / event.amountRaised) * profitData.backersShare;
          setBackerProfitAmount(share);
        }
      }
    };
    fetchData();
  }, [eventPda, publicKey, isOrganizer]);

  const handleClaimBackerProfit = async () => {
    if (!contributor) return;
    setLoading(true);
    try {
      await claimProfit(eventPda, contributor.publicKey, contributor.account.tokenType);
    } catch (error) {
      console.error('Failed to claim profit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOrganizerProfit = async () => {
    setLoading(true);
    try {
      await claimOrganizerProfit(eventPda);
    } catch (error) {
      console.error('Failed to claim organizer profit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profit) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No profit distribution found</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Backers', value: profit.backersShare, color: '#3B82F6' },
    { name: 'Organizer', value: profit.organizerShare, color: '#10B981' },
    { name: 'Platform', value: profit.platformShare, color: '#8B5CF6' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Profit Distribution</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex justify-center items-center">
          <PieChart width={200} height={200}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">
              {formatTokenAmount(profit.totalRevenue, TokenType.SOL)} SOL
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Expenses</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatTokenAmount(profit.expenses, TokenType.SOL)} SOL
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatTokenAmount(profit.netProfit, TokenType.SOL)} SOL
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-6">
        {isOrganizer ? (
          <div>
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Your Share (35%)</p>
              <p className="text-2xl font-bold text-green-600">
                {formatTokenAmount(profit.organizerShare, TokenType.SOL)} SOL
              </p>
            </div>
            <button
              onClick={handleClaimOrganizerProfit}
              disabled={loading || profit.distributed}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : profit.distributed ? 'Already Claimed' : 'Claim Organizer Profit'}
            </button>
          </div>
        ) : (
          contributor && (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Your Profit Share</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatTokenAmount(backerProfitAmount, contributor.account.tokenType)} {contributor.account.tokenType}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Claimed: {formatTokenAmount(contributor.account.profitsClaimed, contributor.account.tokenType)}
                </p>
              </div>
              <button
                onClick={handleClaimBackerProfit}
                disabled={loading || backerProfitAmount <= contributor.account.profitsClaimed}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Claim Your Profit'}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
EOL

# Admin Components
cat > src/components/admin/PlatformAdmin.tsx << 'EOL'
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
EOL

# ============================================
# CREATE PAGES
# ============================================
echo -e "${GREEN}11. Creating all pages...${NC}"

# Root Layout
cat > src/app/layout.tsx << 'EOL'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/contexts/WalletContextProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GatherFi - Decentralized Event Funding on Solana",
  description: "Fund events, vote on budgets, and earn profits with GatherFi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
EOL

# Home Page
cat > src/app/page.tsx << 'EOL'
'use client';
import { useState } from 'react';
import { EventList } from '@/components/event/EventList';
import { EventStatus } from '@/types/gatherfi';

export default function Home() {
  const [filter, setFilter] = useState<EventStatus | undefined>(undefined);

  const filters = [
    { label: 'All', value: undefined },
    { label: 'Funding', value: EventStatus.Funding },
    { label: 'Active', value: EventStatus.Active },
    { label: 'Completed', value: EventStatus.Completed }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Events on Solana
        </h1>
        <p className="text-xl text-gray-600">
          Fund events, vote on budgets, and earn profits
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-md ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <EventList statusFilter={filter} />
    </div>
  );
}
EOL

# Create Event Page
cat > src/app/event/create/page.tsx << 'EOL'
'use client';
import { EventCreationForm } from '@/components/event/EventCreationForm';

export default function CreateEventPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <EventCreationForm />
    </div>
  );
}
EOL

# Event Detail Page
cat > src/app/event/[address]/page.tsx << 'EOL'
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';
import { useEvent } from '@/hooks/useEvent';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePlatform } from '@/hooks/usePlatform';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ContributionForm } from '@/components/event/ContributionForm';
import { BudgetVoting } from '@/components/budget/BudgetVoting';
import { MilestoneList } from '@/components/milestone/MilestoneList';
import { AddMilestoneForm } from '@/components/milestone/AddMilestoneForm';
import { TicketPurchase } from '@/components/tickets/TicketPurchase';
import { TicketCheckIn } from '@/components/tickets/TicketCheckIn';
import { ProfitClaim } from '@/components/profit/ProfitClaim';
import { formatTokenAmount, TokenType } from '@/utils/tokens';
import { formatDate, daysRemaining } from '@/utils/date';
import { EventStatus } from '@/types/gatherfi';

export default function EventDetailPage() {
  const params = useParams();
  const { publicKey } = useWallet();
  const { getEvent, finalizeFunding, finalizeFundingFailure, cancelEvent } = useEvent();
  const { isAdmin } = usePlatform();
  const [event, setEvent] = useState<any>(null);
  const [eventPda, setEventPda] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (params.address) {
        const pda = new PublicKey(params.address as string);
        setEventPda(pda);
        const eventData = await getEvent(pda);
        setEvent(eventData);
        
        if (publicKey) {
          setIsOrganizer(eventData.organizer.equals(publicKey));
          const adminStatus = await isAdmin();
          setIsUserAdmin(adminStatus);
        }
      }
    };
    fetchEvent();
  }, [params.address, publicKey]);

  const handleFinalizeFunding = async () => {
    if (!eventPda) return;
    setLoading(true);
    try {
      await finalizeFunding(eventPda);
      const updated = await getEvent(eventPda);
      setEvent(updated);
    } catch (error) {
      console.error('Failed to finalize funding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeFailure = async () => {
    if (!eventPda) return;
    setLoading(true);
    try {
      await finalizeFundingFailure(eventPda);
      const updated = await getEvent(eventPda);
      setEvent(updated);
    } catch (error) {
      console.error('Failed to finalize failure:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!eventPda) return;
    if (!confirm('Are you sure you want to cancel this event?')) return;
    setLoading(true);
    try {
      await cancelEvent(eventPda);
      const updated = await getEvent(eventPda);
      setEvent(updated);
    } catch (error) {
      console.error('Failed to cancel event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return <div className="text-center py-12">Loading event...</div>;
  }

  const daysLeft = daysRemaining(event.fundingDeadline);
  const isDeadlinePassed = Date.now() / 1000 > event.fundingDeadline;
  const canFinalizeFunding = event.status === EventStatus.Funding && 
    event.amountRaised >= event.targetAmount;
  const canFinalizeFailure = event.status === EventStatus.Funding && 
    isDeadlinePassed && event.amountRaised < event.targetAmount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
            <StatusBadge status={event.status} />
          </div>
          {isOrganizer && event.status !== EventStatus.Completed && 
           event.status !== EventStatus.Cancelled && 
           event.status !== EventStatus.Failed && (
            <button
              onClick={handleCancelEvent}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              Cancel Event
            </button>
          )}
        </div>

        <p className="text-gray-700 mb-4">{event.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">📍 Location</p>
            <p className="font-medium">{event.location}</p>
          </div>
          <div>
            <p className="text-gray-500">📅 Event Date</p>
            <p className="font-medium">{formatDate(event.eventDate)}</p>
          </div>
          <div>
            <p className="text-gray-500">🎫 Tickets</p>
            <p className="font-medium">{event.ticketsSold} / {event.maxTickets} sold</p>
          </div>
          <div>
            <p className="text-gray-500">⏰ Funding Deadline</p>
            <p className="font-medium">{daysLeft} days left</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-500 mb-2">Accepted Tokens</p>
          <div className="flex gap-2">
            {event.acceptedTokens.map((token: TokenType) => (
              <span key={token} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {token}
              </span>
            ))}
          </div>
        </div>
      </div>

      {event.status === EventStatus.Funding && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Funding Progress</h2>
            <ProgressBar
              current={event.amountRaised}
              total={event.targetAmount}
              label={`${formatTokenAmount(event.amountRaised, event.acceptedTokens[0])} / ${formatTokenAmount(event.targetAmount, event.acceptedTokens[0])} raised`}
            />
            
            {(canFinalizeFunding || canFinalizeFailure) && isOrganizer && (
              <div className="mt-4 flex gap-4">
                {canFinalizeFunding && (
                  <button
                    onClick={handleFinalizeFunding}
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Finalize Funding
                  </button>
                )}
                {canFinalizeFailure && (
                  <button
                    onClick={handleFinalizeFailure}
                    disabled={loading}
                    className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Mark as Failed
                  </button>
                )}
              </div>
            )}
          </div>
          <ContributionForm
            eventPda={eventPda!}
            acceptedTokens={event.acceptedTokens}
            targetAmount={event.targetAmount}
            amountRaised={event.amountRaised}
          />
        </>
      )}

      {event.status === EventStatus.BudgetVoting && (
        <BudgetVoting eventPda={eventPda!} event={event} />
      )}

      {event.status === EventStatus.Active && (
        <>
          <TicketPurchase eventPda={eventPda!} event={event} />
          
          {isOrganizer && (
            <>
              <AddMilestoneForm
                eventPda={eventPda!}
                acceptedTokens={event.acceptedTokens}
                onSuccess={async () => {
                  const updated = await getEvent(eventPda!);
                  setEvent(updated);
                }}
              />
              <TicketCheckIn eventPda={eventPda!} />
            </>
          )}
          
          <MilestoneList
            eventPda={eventPda!}
            event={event}
            isOrganizer={isOrganizer}
          />
        </>
      )}

      {event.status === EventStatus.Completed && (
        <ProfitClaim
          eventPda={eventPda!}
          event={event}
          isOrganizer={isOrganizer}
        />
      )}

      {(event.status === EventStatus.Failed || event.status === EventStatus.Cancelled) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">
            {event.status === EventStatus.Failed ? 'Funding Failed' : 'Event Cancelled'}
          </h2>
          <p className="text-gray-700 mb-4">
            {event.status === EventStatus.Failed 
              ? 'This event did not reach its funding goal. Contributors can claim refunds.'
              : 'This event has been cancelled. Contributors can claim refunds.'}
          </p>
        </div>
      )}
    </div>
  );
}
EOL

# Dashboard Page
cat > src/app/dashboard/page.tsx << 'EOL'
'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEvent } from '@/hooks/useEvent';
import { useTicket } from '@/hooks/useTicket';
import { EventCard } from '@/components/event/EventCard';

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const { getEventsByOrganizer } = useEvent();
  const { getUserTickets } = useTicket();
  
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!publicKey) return;
      setLoading(true);
      try {
        const events = await getEventsByOrganizer(publicKey);
        setMyEvents(events);
        
        const tickets = await getUserTickets(publicKey);
        setMyTickets(tickets);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please connect your wallet to view dashboard</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Events</h2>
        {myEvents.length === 0 ? (
          <p className="text-gray-500">You haven't created any events yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map(({ pubkey, account }) => (
              <EventCard key={pubkey.toBase58()} event={account} eventPda={pubkey} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Tickets</h2>
        {myTickets.length === 0 ? (
          <p className="text-gray-500">You haven't purchased any tickets yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTickets.map(({ pubkey, account }) => (
              <div key={pubkey.toBase58()} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Ticket #{account.ticketNumber}</p>
                    <p className="text-lg font-semibold">Event: {account.event.toBase58().slice(0, 8)}...</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    account.checkedIn 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {account.checkedIn ? 'Checked In' : 'Not Checked In'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p>Price: {account.pricePaid} {account.tokenType}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
EOL

# My Tickets Page
cat > src/app/my-tickets/page.tsx << 'EOL'
'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTicket } from '@/hooks/useTicket';
import { useEvent } from '@/hooks/useEvent';
import { PublicKey } from '@solana/web3.js';
import QRCode from 'react-qr-code';

export default function MyTicketsPage() {
  const { publicKey } = useWallet();
  const { getUserTickets } = useTicket();
  const { getEvent } = useEvent();
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [events, setEvents] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!publicKey) return;
      setLoading(true);
      try {
        const userTickets = await getUserTickets(publicKey);
        setTickets(userTickets);
        
        const eventMap: Record<string, any> = {};
        for (const ticket of userTickets) {
          if (!eventMap[ticket.account.event.toBase58()]) {
            const eventData = await getEvent(ticket.account.event);
            eventMap[ticket.account.event.toBase58()] = eventData;
          }
        }
        setEvents(eventMap);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please connect your wallet to view tickets</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading your tickets...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Tickets</h1>

      {tickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">You don't have any tickets yet</p>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Browse Events →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map(({ pubkey, account }) => {
            const event = events[account.event.toBase58()];
            const ticketData = JSON.stringify({
              ticketNumber: account.ticketNumber,
              event: account.event.toBase58(),
              owner: account.owner.toBase58()
            });

            return (
              <div key={pubkey.toBase58()} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {event?.name || 'Event'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Ticket #{account.ticketNumber}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      account.checkedIn 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {account.checkedIn ? 'Checked In' : 'Active'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📍 {event?.location || 'Location TBD'}</p>
                    <p>📅 {event?.eventDate ? new Date(event.eventDate * 1000).toLocaleDateString() : 'Date TBD'}</p>
                    <p>💰 Paid: {account.pricePaid} {account.tokenType}</p>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(selectedTicket === pubkey ? null : pubkey)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {selectedTicket === pubkey ? 'Hide QR Code' : 'Show QR Code'}
                  </button>

                  {selectedTicket === pubkey && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-center mb-4">
                        <QRCode value={ticketData} size={200} />
                      </div>
                      <p className="text-xs text-center text-gray-500">
                        Show this QR code at the event entrance
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
EOL

# My Contributions Page
cat > src/app/my-contributions/page.tsx << 'EOL'
'use client';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGatherFiProgram } from '@/utils/anchor';
import { useEvent } from '@/hooks/useEvent';
import { formatTokenAmount } from '@/utils/tokens';
import Link from 'next/link';

export default function MyContributionsPage() {
  const { publicKey } = useWallet();
  const { getProgramWithSigner } = useGatherFiProgram();
  const { getEvent } = useEvent();
  
  const [contributions, setContributions] = useState<any[]>([]);
  const [events, setEvents] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      if (!publicKey) return;
      setLoading(true);
      try {
        const program = getProgramWithSigner();
        const allContributions = await program.account.contributor.all([
          {
            memcmp: {
              offset: 8 + 32,
              bytes: publicKey.toBase58()
            }
          }
        ]);
        setContributions(allContributions);
        
        const eventMap: Record<string, any> = {};
        for (const contribution of allContributions) {
          if (!eventMap[contribution.account.event.toBase58()]) {
            const eventData = await getEvent(contribution.account.event);
            eventMap[contribution.account.event.toBase58()] = eventData;
          }
        }
        setEvents(eventMap);
      } catch (error) {
        console.error('Error fetching contributions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please connect your wallet to view contributions</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading your contributions...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Contributions</h1>

      {contributions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">You haven't made any contributions yet</p>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Fund an Event →
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voting Power
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contributions.map(({ pubkey, account }) => {
                const event = events[account.event.toBase58()];
                const isRefundable = event?.status === 'Failed' || event?.status === 'Cancelled';

                return (
                  <tr key={pubkey.toBase58()}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {event?.name || 'Unknown Event'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {account.event.toBase58().slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTokenAmount(account.amount, account.tokenType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.tokenType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTokenAmount(account.votingPower, account.tokenType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.refundClaimed 
                          ? 'bg-gray-100 text-gray-800'
                          : isRefundable 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {account.refundClaimed 
                          ? 'Refunded' 
                          : isRefundable 
                            ? 'Refund Available' 
                            : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/event/${account.event.toBase58()}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
EOL

# Admin Page
cat > src/app/admin/page.tsx << 'EOL'
'use client';
import { PlatformAdmin } from '@/components/admin/PlatformAdmin';

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PlatformAdmin />
    </div>
  );
}
EOL

# ============================================
# CREATE TYPESCRIPT TYPES
# ============================================
echo -e "${GREEN}12. Creating TypeScript type definitions...${NC}"

cat > src/types/gatherfi.ts << 'EOL'
import { PublicKey } from '@solana/web3.js';

export enum TokenType {
  SOL = 'SOL',
  USDC = 'USDC',
  USDT = 'USDT'
}

export enum EventStatus {
  Draft = 'Draft',
  Funding = 'Funding',
  BudgetVoting = 'BudgetVoting',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunding = 'Refunding',
  Failed = 'Failed'
}

export interface PlatformConfig {
  admin: PublicKey;
  treasury: PublicKey;
  feePercentage: number;
  royaltyPercentage: number;
  totalFeesCollected: bigint;
  totalVolume: bigint;
  paused: boolean;
  usdcMint: PublicKey;
  usdtMint: PublicKey;
  bump: number;
}

export interface Event {
  organizer: PublicKey;
  eventId: bigint;
  name: string;
  description: string;
  targetAmount: bigint;
  amountRaised: bigint;
  ticketPrice: bigint;
  ticketsSold: number;
  maxTickets: number;
  location: string;
  eventDate: bigint;
  status: EventStatus;
  acceptedTokens: TokenType[];
  budgetApproved: boolean;
  fundingDeadline: bigint;
  totalVotes: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  platformFeeAmount: bigint;
  ticketMint: PublicKey | null;
  escrowBump: number;
  eventBump: number;
}

export interface Contributor {
  event: PublicKey;
  contributor: PublicKey;
  amount: bigint;
  votingPower: bigint;
  tokenType: TokenType;
  profitsClaimed: bigint;
  refundClaimed: boolean;
  bump: number;
}

export interface Ticket {
  mint: PublicKey;
  event: PublicKey;
  owner: PublicKey;
  ticketNumber: number;
  checkedIn: boolean;
  pricePaid: bigint;
  tokenType: TokenType;
  refunded: boolean;
  bump: number;
}

export interface Budget {
  event: PublicKey;
  totalAmount: bigint;
  approved: boolean;
  submittedAt: bigint;
  bump: number;
}

export interface Milestone {
  event: PublicKey;
  index: number;
  description: string;
  amount: bigint;
  dueDate: bigint;
  tokenType: TokenType;
  released: boolean;
  releaseDate: bigint | null;
  bump: number;
}

export interface ProfitDistribution {
  event: PublicKey;
  totalRevenue: bigint;
  expenses: bigint;
  netProfit: bigint;
  backersShare: bigint;
  organizerShare: bigint;
  platformShare: bigint;
  distributed: boolean;
  distributionDate: bigint;
  bump: number;
}

export interface Escrow {
  event: PublicKey;
  solBalance: bigint;
  usdcBalance: bigint;
  usdtBalance: bigint;
  totalBalance: bigint;
  isInitialized: boolean;
  bump: number;
}

export interface Vote {
  event: PublicKey;
  voter: PublicKey;
  amount: bigint;
  approve: boolean;
  votedAt: bigint;
  bump: number;
}
EOL

# ============================================
# UPDATE GLOBALS.CSS WITH CUSTOM STYLES
# ============================================
echo -e "${GREEN}13. Updating global styles...${NC}"

cat > src/app/globals.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
  }

  .btn-success {
    @apply bg-green-600 text-white hover:bg-green-700;
  }

  .btn-danger {
    @apply bg-red-600 text-white hover:bg-red-700;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .input {
    @apply w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }

  .label {
    @apply block text-sm font-medium text-gray-700 mb-2;
  }
}

.wallet-adapter-modal {
  @apply bg-gray-900 bg-opacity-50;
}

.wallet-adapter-button {
  @apply bg-blue-600 hover:bg-blue-700 transition-colors;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}
EOL

# ============================================
# UPDATE TAILWIND CONFIG
# ============================================
echo -e "${GREEN}14. Updating Tailwind configuration...${NC}"

cat > tailwind.config.ts << 'EOL'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
EOL

# ============================================
# UPDATE NEXT.CONFIG.JS
# ============================================
echo -e "${GREEN}15. Updating Next.js configuration...${NC}"

cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [''],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
}

module.exports = nextConfig
EOL

# ============================================
# UPDATE PACKAGE.JSON WITH SCRIPTS
# ============================================
echo -e "${GREEN}16. Updating package.json scripts...${NC}"

cat > package.json << 'EOL'
{
  "name": "gatherfi-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@coral-xyz/anchor": "^0.29.0",
    "@solana/spl-token": "^0.4.6",
    "@solana/wallet-adapter-base": "^0.9.33",
    "@solana/wallet-adapter-react": "^0.15.35",
    "@solana/wallet-adapter-react-ui": "^0.9.34",
    "@solana/wallet-adapter-wallets": "^0.19.32",
    "@solana/web3.js": "^1.91.0",
    "bs58": "^5.0.0",
    "date-fns": "^2.30.0",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-qr-code": "^2.0.12",
    "react-qr-reader": "^3.0.0-beta-1",
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}
EOL

# ============================================
# CREATE README.MD
# ============================================
echo -e "${GREEN}17. Creating README documentation...${NC}"

cat > README.md << 'EOL'
# GatherFi - Decentralized Event Funding on Solana

GatherFi is a decentralized crowdfunding platform for events built on Solana. It enables event organizers to raise funds, sell tickets, and manage budgets through community voting.

## Features in

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
