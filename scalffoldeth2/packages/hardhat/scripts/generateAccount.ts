import { ethers } from "ethers";
import { parse, stringify } from "envfile";
import * as fs from "fs";
import password from "@inquirer/password";
import input from "@inquirer/input";

const envFilePath = "./.env";

const getValidatedPassword = async () => {
  while (true) {
    const pass = await password({ message: "Enter a password to encrypt your private key:" });
    const confirmation = await password({ message: "Confirm password:" });

    if (pass === confirmation) {
      return pass;
    }
    console.log("❌ Passwords don't match. Please try again.");
  }
};

const getFundingAmount = async () => {
  const amount = await input({
    message: "Enter amount of ETH to fund the account for testing (e.g., 1.5):",
    default: "1.0",
    validate: (value) => {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return "Please enter a valid positive number";
      }
      return true;
    },
  });
  return parseFloat(amount);
};

const fundAccount = async (toAddress: string, amount: number) => {
  try {
    // Get the first account from hardhat (the faucet account)
    const hardhatAccounts = await ethers.getSigners();
    const faucetAccount = hardhatAccounts[0];
    
    if (!faucetAccount) {
      console.log("❌ No faucet account available. Make sure hardhat node is running.");
      return false;
    }

    const tx = await faucetAccount.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount.toString()),
    });

    console.log(`⏳ Funding transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Account funded with ${amount} ETH`);
    return true;
  } catch (error) {
    console.error("❌ Failed to fund account:", error);
    return false;
  }
};

const setNewEnvConfig = async (existingEnvConfig = {}, fundingAmount?: number) => {
  console.log("👛 Generating new Wallet\n");
  const randomWallet = ethers.Wallet.createRandom();

  const pass = await getValidatedPassword();
  const encryptedJson = await randomWallet.encrypt(pass);

  const newEnvConfig = {
    ...existingEnvConfig,
    DEPLOYER_PRIVATE_KEY_ENCRYPTED: encryptedJson,
  };

  // Store in .env
  fs.writeFileSync(envFilePath, stringify(newEnvConfig));
  console.log("\n📄 Encrypted Private Key saved to packages/hardhat/.env file");
  console.log("🪄 Generated wallet address:", randomWallet.address, "\n");
  console.log("⚠️ Make sure to remember your password! You'll need it to decrypt the private key.");

  // Fund the account if amount is specified
  if (fundingAmount && fundingAmount > 0) {
    console.log(`\n💰 Funding account with ${fundingAmount} ETH for testing...`);
    const success = await fundAccount(randomWallet.address, fundingAmount);
    if (success) {
      console.log(`✅ Account ${randomWallet.address} is now ready for testing with ${fundingAmount} ETH`);
    } else {
      console.log("⚠️ Account generated but funding failed. You can manually fund it later.");
    }
  }
};

async function main() {
  if (!fs.existsSync(envFilePath)) {
    // No .env file yet.
    const fundingAmount = await getFundingAmount();
    await setNewEnvConfig({}, fundingAmount);
    return;
  }

  const existingEnvConfig = parse(fs.readFileSync(envFilePath).toString());
  if (existingEnvConfig.DEPLOYER_PRIVATE_KEY_ENCRYPTED) {
    console.log("⚠️ You already have a deployer account. Check the packages/hardhat/.env file");
    const overwrite = await input({
      message: "Do you want to generate a new account? (y/N):",
      default: "N",
    });
    
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      return;
    }
  }

  const fundingAmount = await getFundingAmount();
  await setNewEnvConfig(existingEnvConfig, fundingAmount);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
