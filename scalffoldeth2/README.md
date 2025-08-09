# 🌱 EcoQuest-DevMatch-2025

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🚀 An open-source, up-to-date toolkit for building decentralized applications 
(dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact 
with those contracts.

⚡ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.    

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract 
as you edit it.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 📦 [**Components**](https://docs.scaffoldeth.io/components/): Collection of 
common web3 components to quickly build your frontend.
- 🎨 **Theme Support**: Light and dark mode support with easy customization.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with EcoQuest, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd EcoQuest-DevMatch-2025-
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on 
your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contracts in `packages/hardhat/contracts`

## Account Management

EcoQuest provides several tools for managing accounts for testing and development:

### Generate Account with Funding

Generate a new account and automatically fund it with ETH for testing:

```bash
yarn account:generate
```

This command will:
- Generate a new encrypted wallet
- Prompt you for a password to encrypt the private key
- Ask for the amount of ETH to fund the account
- Automatically send the specified amount from the faucet account

### Fund Existing Account

Fund any existing account with ETH for testing:

```bash
yarn account:fund
```

This command will:
- Prompt for the target address
- Ask for the amount of ETH to send
- Send the transaction from the faucet account

### List Account Information

View your current account details and balances:

```bash
yarn account
```

### Other Account Commands

- `yarn account:import` - Import an existing private key
- `yarn account:reveal-pk` - Reveal the private key (use with caution)