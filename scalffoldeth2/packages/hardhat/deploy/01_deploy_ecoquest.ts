import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import fs from "fs";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const { ethers } = hre;

  console.log("Deploying EcoQuest contracts...");


  // Deploy MockUSDC (if not already deployed)
  const mockUSDC = await deploy("MockUSDC", {
    from: deployer,
    args: ["1000000000000"], // 1,000,000 mUSDC (6 decimals)
    log: true,
    autoMine: true,
  });

  // For debug
  console.log("Writing to:", require("path").resolve(__dirname, "../../../frontend-addresses.json"));
  
  // Automatically update frontend-addresses.json with the deployed MockUSDC address
  fs.writeFileSync(
    "../../../frontend-addresses.json",
    JSON.stringify({ USDC_ADDRESS: mockUSDC.address }, null, 2)
  );  // Set a fake KlimaDAO address (for local testing)
  const KLIMADAO_ADDRESS = "0x00000000000000000000000000000000DeaDBeef";

  // Deploy EcoQuestDonation with MockUSDC and KlimaDAO address
  const ecoQuestDonation = await deploy("EcoQuestDonation", {
    from: deployer,
    args: [mockUSDC.address, KLIMADAO_ADDRESS],
    log: true,
    autoMine: true,
  });


  console.log("MockUSDC deployed to:", mockUSDC.address);
  console.log("EcoQuestDonation deployed to:", ecoQuestDonation.address);

  // Auto-fund accounts with USDC for local testing
  if (hre.network.name === "hardhat" || hre.network.name === "localhost") {
    const accounts = await ethers.getSigners();
    const deployerSigner = accounts[0]; // The deployer is the first account
    const mockUSDCContract = await ethers.getContractAt("MockUSDC", mockUSDC.address, deployerSigner);
    const amount = "100000000"; // 100 USDC (6 decimals)
    
    for (let i = 0; i < accounts.length; i++) {
      const user = accounts[i];
      await mockUSDCContract.transfer(user.address, amount);
      console.log(`Transferred 100 USDC to test user: ${user.address}`);
    }
  }

  // Deploy EcoQuestNFT contract
  const ecoQuestNFT = await deploy("EcoQuestNFT", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("EcoQuestNFT deployed to:", ecoQuestNFT.address);


  // Verify contracts on Etherscan (if not on local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");

    console.log("Verifying contracts...");
    try {
      await hre.run("verify:verify", {
        address: ecoQuestDonation.address,
        constructorArguments: [mockUSDC.address, KLIMADAO_ADDRESS],
      });
    } catch (error) {
      console.log("Error verifying EcoQuestDonation:", error);
    }

    try {
      await hre.run("verify:verify", {
        address: ecoQuestNFT.address,
        constructorArguments: [],
      });
    } catch (error) {
      console.log("Error verifying EcoQuestNFT:", error);
    }
  }

  console.log("EcoQuest deployment completed!");
};

func.id = "deploy_ecoquest";
func.tags = ["EcoQuest"];

export default func; 