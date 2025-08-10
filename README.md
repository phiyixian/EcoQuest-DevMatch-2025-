# 🌱 EcoQuest DevMatch 2025

<div align="center">

![EcoQuest Logo](scalffoldeth2/packages/nextjs/public/ecoquest/assets/default.png)

**A gamified carbon offset platform built on Ethereum**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.18.3+-green.svg)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

</div>

## 🎯 Overview

EcoQuest DevMatch 2025 is an innovative blockchain-based platform that gamifies carbon offsetting through NFTs, donations, and cross-chain bridges. Users can track their carbon footprint, make donations to offset CO₂ emissions, and earn unique NFTs as proof of their environmental contributions.

## ✨ Key Features

### 🌍 Carbon Offset Donations
- **USDC Donations**: Make carbon offset donations using USDC tokens
- **Real-time Tracking**: Monitor total community donations and CO₂ offset
- **Gamified Experience**: Earn points and achievements for environmental contributions

### 🎮 NFT Rewards System
- **EcoProof NFTs**: Unique NFTs minted for carbon offset activities
- **Multiple NFT Types**:
  - Donation Proof NFTs
  - Rare Discovery NFTs
  - Quest Completion NFTs
  - Carbon Offset NFTs
- **Metadata Storage**: Each NFT contains detailed information about the offset activity

### 🌉 Cross-Chain Bridges
- **Arbitrum Bridge**: Seamless asset transfer between Ethereum and Arbitrum
- **Celo Bridge**: Connect to Celo network for additional carbon offset opportunities
- **Multi-chain Support**: Expand your environmental impact across multiple networks

### 🔧 Browser Extension
- **Carbon Tracker**: Chrome extension that tracks browsing CO₂ emissions
- **Micropayments**: Offset carbon footprint through small donations
- **Real-time Monitoring**: Track your environmental impact as you browse

### 🏆 Gamification Elements
- **Leaderboard**: Compete with other users for environmental impact
- **Profile System**: Track your personal carbon offset achievements
- **Gallery**: Showcase your EcoProof NFT collection
- **Quest System**: Complete environmental challenges for rewards

## 🏗️ Architecture

### Smart Contracts
- **EcoQuestNFT.sol**: ERC721 contract for minting EcoProof NFTs
- **EcoQuestDonation.sol**: Manages carbon offset donations and tracking
- **EcoQuestCollection.sol**: NFT collection management
- **MockUSDC.sol**: Test USDC token for development
- **ETHUSDCSwap.sol**: ETH to USDC conversion functionality
- **ArbitrumBridge.sol**: Cross-chain bridge to Arbitrum
- **CeloBridge.sol**: Cross-chain bridge to Celo

### Frontend
- **Next.js 14**: Modern React framework with App Router
- **RainbowKit**: Web3 wallet connection and management
- **Wagmi**: React hooks for Ethereum
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling framework

### Development Stack
- **Hardhat**: Ethereum development environment
- **Scaffold-ETH 2**: Rapid dApp development framework
- **Yarn Workspaces**: Monorepo management
- **ESLint & Prettier**: Code quality and formatting

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (>= v20.18.3)
- [Yarn](https://yarnpkg.com/) (v1 or v2+)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/EcoQuest-DevMatch-2025-.git
   cd EcoQuest-DevMatch-2025-
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start local blockchain**
   ```bash
   yarn chain
   ```

4. **Deploy smart contracts**
   ```bash
   yarn deploy
   ```

5. **Start the frontend**
   ```bash
   yarn start
   ```

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Browser Extension Setup

1. **Navigate to the extension directory**
   ```bash
   cd carbon-offset-extension
   ```

2. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `carbon-offset-extension` folder

## 🎮 How to Use

### Making Carbon Offset Donations

1. **Connect your wallet** using RainbowKit
2. **Convert ETH to USDC** using the built-in swap functionality
3. **Enter donation amount** and optional message
4. **Submit donation** to offset your carbon footprint
5. **Receive EcoProof NFT** as proof of your contribution

### Earning NFTs

- **Donation Proof NFTs**: Automatically minted for each donation
- **Quest Completion NFTs**: Earned by completing environmental challenges
- **Rare Discovery NFTs**: Special NFTs for unique environmental activities
- **Carbon Offset NFTs**: Proof of specific carbon offset activities

### Cross-Chain Activities

- **Bridge to Arbitrum**: Transfer assets to Arbitrum for additional opportunities
- **Bridge to Celo**: Connect to Celo's carbon-focused ecosystem
- **Multi-chain Impact**: Expand your environmental impact across networks

## 🧪 Testing

### Smart Contract Tests
```bash
yarn test
```

### Frontend Development
```bash
yarn start
```

### Contract Verification
```bash
yarn verify
```

## 📁 Project Structure

```
EcoQuest-DevMatch-2025-/
├── scalffoldeth2/                 # Main Scaffold-ETH 2 project
│   ├── packages/
│   │   ├── hardhat/              # Smart contracts and deployment
│   │   │   ├── contracts/        # Solidity smart contracts
│   │   │   ├── deploy/           # Deployment scripts
│   │   │   └── test/             # Contract tests
│   │   └── nextjs/               # Frontend application
│   │       ├── app/              # Next.js app directory
│   │       │   └── ecoquest/     # Main EcoQuest application
│   │       ├── components/       # React components
│   │       └── hooks/            # Custom React hooks
├── carbon-offset-extension/       # Chrome browser extension
│   ├── popup.html               # Extension popup interface
│   ├── content.js               # Content script for webpage interaction
│   └── manifest.json            # Extension configuration
└── contracts1/                   # Additional contract files
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `scalffoldeth2` directory:
```env
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
ALCHEMY_API_KEY=your_alchemy_api_key
```

### Network Configuration
Modify `scalffoldeth2/packages/hardhat/hardhat.config.ts` to configure networks and deployment settings.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Scaffold-ETH 2**: For the excellent development framework
- **OpenZeppelin**: For secure smart contract libraries
- **RainbowKit**: For seamless wallet integration
- **Wagmi**: For powerful Ethereum hooks
- **DevMatch 2025**: For the hackathon opportunity

## 📞 Support

- **Documentation**: [Scaffold-ETH 2 Docs](https://docs.scaffoldeth.io)
- **Issues**: [GitHub Issues](https://github.com/your-username/EcoQuest-DevMatch-2025-/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/EcoQuest-DevMatch-2025-/discussions)

---

<div align="center">

**Made with ❤️ for a greener future**

*EcoQuest DevMatch 2025 - Gamifying Carbon Offset on Ethereum*

</div>
