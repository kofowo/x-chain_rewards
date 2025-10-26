# 🌉 X-Chain Rewards Bridge

A cross-chain bridge enabling STX token transfers from Stacks to EVM-compatible chains. Built with Clarity smart contracts and React frontend for DoraHacks hackathon.

## ✨ Features

- **Cross-Chain Bridge**: Lock STX on Stacks, mint wrapped tokens on Polygon
- **Oracle System**: Simulated oracle for demonstration purposes
- **Wallet Integration**: Full Stacks wallet connection with @stacks/connect
- **Timeout Protection**: Users can refund locked STX if oracle fails
- **React Frontend**: Modern UI with real-time transaction status

## 🏗️ Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Stacks    │    │    Oracle    │    │   Polygon   │
│             │    │   (Simulated)│    │             │
│ Lock STX ───┼────┼─► Monitor ────┼────┼─► Mint wSTX  │
│             │    │              │    │             │
│ Confirm ◄───┼────┼── Validate ◄─┼────┼── Events     │
│             │    │              │    │             │
│ Refund ─────┼────┼── Timeout    │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Clarinet](https://github.com/hirosystems/clarinet) v2.0+
- [Stacks Wallet](https://wallet.hiro.so/) with testnet access
- Testnet STX from [faucet](https://explorer.stacks.co/sandbox/faucet)

### Installation & Setup
```bash
# Clone the repository
git clone https://github.com/kofowo/x-chain_rewards.git
cd x-chain_rewards

# Install all dependencies (contract + frontend)
npm run setup
```

### Configure Testnet Deployment
Edit `settings/Testnet.toml` with your testnet mnemonic:
```toml
[accounts.deployer]
mnemonic = "your twelve word testnet mnemonic phrase here"
```

### Deploy to Testnet
```bash
# Verify contract syntax
npm run check

# Run comprehensive tests
npm test

# Deploy contract to Stacks testnet
npm run deploy
```

### Start Development
```bash
# Start frontend development server
npm run dev
# Open http://localhost:5173
```

## 📱 How to Use

1. **Connect Wallet**
   - Click "Connect Stacks Wallet" in the UI
   - Approve the connection in your wallet

2. **Lock STX Tokens**
   - Enter amount in microSTX (1 STX = 1,000,000 microSTX)
   - Enter your Polygon wallet address (0x...)
   - Select target chain (Polygon Mumbai testnet recommended)
   - Click "Lock STX" and confirm transaction

3. **Simulate Oracle**
   - After successful lock, click "Simulate Oracle"
   - This demonstrates the oracle confirmation process
   - View transaction status and details

## � Project Structure

```
x-chain_rewards/
├── contracts/
│   └── cross-chain-bridge.clar           # Main bridge smart contract
├── tests/
│   └── cross-chain-bridge.test.ts        # Comprehensive contract tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BridgeForm.tsx            # Main bridge interface
│   │   │   ├── StatusDisplay.tsx         # Network and flow status
│   │   │   └── WalletConnect.tsx         # Stacks wallet integration
│   │   ├── utils/
│   │   │   ├── stacks.ts                 # Contract interaction utilities
│   │   │   ├── oracle.ts                 # Oracle simulation logic
│   │   │   └── polygon.ts                # Chain configuration
│   │   ├── App.tsx                       # Main application component
│   │   └── main.tsx                      # Application entry point
│   ├── .env                              # Environment configuration
│   └── package.json                      # Frontend dependencies
├── settings/
│   └── Testnet.toml                      # Testnet configuration
├── Clarinet.toml                         # Project configuration
├── package.json                          # Root project dependencies
└── README.md                             # This file
```

## 🔧 Smart Contract Interface

### Public Functions
- **`lock-stx`** `(amount uint, recipient (buff 48), target-chain uint)`
  - Lock STX tokens for cross-chain transfer
  - Returns lock ID for tracking

- **`oracle-confirm`** `(id uint, dest-tx-hash (buff 66))`
  - Oracle confirms mint transaction on destination chain
  - Only callable by contract admin/oracle

- **`refund`** `(id uint)`
  - User can refund locked STX after timeout period
  - Protection against oracle failure

- **`get-admin`** `()` (read-only)
  - Returns the current oracle administrator address

- **`set-admin`** `(p principal)`
  - Update oracle administrator (admin only)

### Key Features
- **Secure Locking**: STX held in contract until confirmation or timeout
- **Oracle System**: Designated admin can confirm cross-chain operations  
- **Timeout Protection**: 100 block timeout for user refunds
- **Event Logging**: All operations emit events for monitoring

## 🌐 Network Configuration

### Testnet (Recommended)
- **Stacks**: Testnet (api.testnet.hiro.so)
- **Target**: Polygon Mumbai (Chain ID: 80001)
- **Explorer**: https://explorer.stacks.co/sandbox

### Environment Variables
```env
VITE_STACKS_NETWORK=testnet
VITE_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_CONTRACT_NAME=cross-chain-bridge
```

## 🧪 Testing

### Contract Tests
```bash
npm test  # Run all contract tests with Clarinet SDK
```

Test Coverage:
- ✅ Contract initialization and admin setup
- ✅ STX locking functionality
- ✅ Oracle confirmation process
- ✅ Refund mechanism after timeout

### Frontend Build
```bash
npm run build  # Build optimized production frontend
```

## 🛡️ Security Notes

⚠️ **This is a proof-of-concept for educational purposes**

**Current Limitations:**
- Single oracle (centralized)
- Mock destination chain integration
- No fee mechanism
- Basic timeout protection

**For Production:**
- Multi-signature oracle network
- Formal security audit
- Comprehensive fee structure
- Advanced timeout and slashing mechanisms
- Real EVM chain integration

## 💡 Development

### Available Scripts
```bash
npm run setup     # Install all dependencies
npm run check     # Verify contract syntax
npm test          # Run contract tests
npm run deploy    # Deploy to testnet
npm run dev       # Start frontend development
npm run build     # Build frontend for production
```

### Adding New Features
1. Update contract in `contracts/cross-chain-bridge.clar`
2. Add tests in `tests/cross-chain-bridge.test.ts`
3. Update frontend utilities in `frontend/src/utils/`
4. Test thoroughly before deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Verify all tests pass: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stacks**: Blockchain platform and Clarity language
- **Hiro**: Development tools (Clarinet, Stacks.js)
- **DoraHacks**: Hackathon platform and community
- **Polygon**: Target chain for cross-chain demonstrations

---

**Built for DoraHacks 2024** | **Educational Demo** | **Not for Production Use**
