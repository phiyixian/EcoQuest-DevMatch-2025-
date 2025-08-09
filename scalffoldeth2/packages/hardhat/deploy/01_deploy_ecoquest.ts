import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying EcoQuest contracts...");

  let usdcAddress: string;
  
  // Use MockUSDC for localhost/hardhat networks, real USDC for other networks
  if (hre.network.name === "hardhat" || hre.network.name === "localhost") {
    console.log("Deploying MockUSDC for local testing...");
    
    // Deploy MockUSDC with initial supply of 1,000,000 USDC
    const mockUSDC = await deploy("MockUSDC", {
      from: deployer,
      args: [1000000], // 1 million USDC initial supply
      log: true,
      autoMine: true,
    });
    
    usdcAddress = mockUSDC.address;
    console.log("MockUSDC deployed to:", usdcAddress);
  } else {
    // USDC contract address on Optimism Goerli
    usdcAddress = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607";
    console.log("Using real USDC address:", usdcAddress);
  }
  
  // Carbon offset rate: 1 USDC = 10 kg CO2 (adjust as needed)
  const CARBON_OFFSET_RATE = "10000000000000000000"; // 10 * 10^18 (for precision)

  // Deploy EcoQuestDonation contract
  const ecoQuestDonation = await deploy("EcoQuestDonation", {
    from: deployer,
    args: [usdcAddress, CARBON_OFFSET_RATE],
    log: true,
    autoMine: true,
  });

  console.log("EcoQuestDonation deployed to:", ecoQuestDonation.address);

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
    await ecoQuestDonation.waitForDeployment();
    await ecoQuestNFT.waitForDeployment();

    console.log("Verifying contracts...");
    try {
      await hre.run("verify:verify", {
        address: ecoQuestDonation.address,
        constructorArguments: [usdcAddress, CARBON_OFFSET_RATE],
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