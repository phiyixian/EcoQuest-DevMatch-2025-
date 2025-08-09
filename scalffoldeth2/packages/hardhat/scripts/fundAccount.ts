import { ethers } from "ethers";
import input from "@inquirer/input";

const fundAccount = async (toAddress: string, amount: number) => {
  try {
    // Get the first account from hardhat (the faucet account)
    const hardhatAccounts = await ethers.getSigners();
    const faucetAccount = hardhatAccounts[0];
    
    if (!faucetAccount) {
      console.log("❌ No faucet account available. Make sure hardhat node is running.");
      return false;
    }

    // Check faucet account balance
    const faucetBalance = await faucetAccount.getBalance();
    const requiredAmount = ethers.parseEther(amount.toString());
    
    if (faucetBalance < requiredAmount) {
      console.log(`❌ Insufficient funds in faucet account. Available: ${ethers.formatEther(faucetBalance)} ETH, Required: ${amount} ETH`);
      return false;
    }

    console.log(`💰 Funding account ${toAddress} with ${amount} ETH...`);
    const tx = await faucetAccount.sendTransaction({
      to: toAddress,
      value: requiredAmount,
    });

    console.log(`⏳ Funding transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Account funded with ${amount} ETH`);
    
    // Show new balance
    const newBalance = await ethers.provider.getBalance(toAddress);
    console.log(`📊 New balance: ${ethers.formatEther(newBalance)} ETH`);
    
    return true;
  } catch (error) {
    console.error("❌ Failed to fund account:", error);
    return false;
  }
};

async function main() {
  console.log("💰 Account Funding Tool\n");
  
  // Get target address
  const targetAddress = await input({
    message: "Enter the address to fund:",
    validate: (value) => {
      if (!ethers.isAddress(value)) {
        return "Please enter a valid Ethereum address";
      }
      return true;
    },
  });

  // Get funding amount
  const amountStr = await input({
    message: "Enter amount of ETH to send:",
    default: "1.0",
    validate: (value) => {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return "Please enter a valid positive number";
      }
      return true;
    },
  });

  const amount = parseFloat(amountStr);
  
  console.log(`\n🎯 Target: ${targetAddress}`);
  console.log(`💸 Amount: ${amount} ETH`);
  
  const confirm = await input({
    message: "Proceed with funding? (y/N):",
    default: "N",
  });

  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log("❌ Funding cancelled");
    return;
  }

  await fundAccount(targetAddress, amount);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
}); 