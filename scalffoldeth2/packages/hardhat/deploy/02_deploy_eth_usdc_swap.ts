import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the ETH to USDC swap contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployETHUSDCSwap: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  // For Sepolia, use a real USDC contract or deploy MockUSDC
  let usdcAddress;

  if (hre.network.name === "sepolia") {
    // Use Sepolia USDC address or deploy our own MockUSDC
    try {
      const mockUSDC = await get("MockUSDC");
      usdcAddress = mockUSDC.address;
    } catch {
      // Deploy MockUSDC if it doesn't exist
      const mockUSDC = await deploy("MockUSDC", {
        from: deployer,
        args: ["1000000000000"], // 1M USDC
        log: true,
        autoMine: true,
      });
      usdcAddress = mockUSDC.address;
    }
  } else {
    // Use the existing MockUSDC for local networks
    const mockUSDC = await get("MockUSDC");
    usdcAddress = mockUSDC.address;
  }

  // Exchange rate: 2000 USDC per 1 ETH (with 6 decimals for USDC)
  const exchangeRate = "2000000000"; // 2000 * 10^6

  await deploy("ETHUSDCSwap", {
    from: deployer,
    args: [usdcAddress, exchangeRate],
    log: true,
    autoMine: true,
  });

  // Get the deployed contracts with proper signer
  const ethUsdcSwap = await hre.ethers.getContract<Contract>("ETHUSDCSwap", deployer);

  // Get signer for contract interactions
  const accounts = await hre.ethers.getSigners();
  const deployerSigner = accounts[0];

  const mockUsdcContract = await hre.ethers.getContractAt("MockUSDC", usdcAddress, deployerSigner);

  console.log("👋 Setting up ETH-USDC Swap contract...");

  // Fund the swap contract with USDC so it can perform swaps
  const fundAmount = hre.ethers.parseUnits("100000", 6); // 100,000 USDC

  // First, mint USDC to deployer if needed
  try {
    const deployerBalance = await mockUsdcContract.balanceOf(deployerSigner.address);
    if (deployerBalance < fundAmount) {
      console.log("💰 Minting USDC for deployer...");
      await mockUsdcContract.mint(deployerSigner.address, fundAmount);
    }
  } catch (error) {
    console.log("⚠️ Could not check/mint USDC balance, continuing with deployment...");
    console.log("You may need to manually fund the swap contract later.");
  }

  // Approve the swap contract to spend USDC
  try {
    console.log("✅ Approving swap contract to spend USDC...");
    await mockUsdcContract.approve(ethUsdcSwap.target, fundAmount);

    // Fund the swap contract with USDC
    console.log("💵 Funding swap contract with USDC...");
    await ethUsdcSwap.fundWithUSDC(fundAmount);

    console.log("🎉 ETH-USDC Swap contract setup complete!");
  } catch (error) {
    console.log("⚠️ Could not fund swap contract automatically.");
    console.log("The contract was deployed but you may need to manually fund it with USDC later.");
    console.log("Contract can still be used if you fund it manually.");
  }

  console.log(`📄 Contract address: ${ethUsdcSwap.target}`);
  console.log(`💱 Exchange rate: ${exchangeRate} USDC per ETH`);
};

export default deployETHUSDCSwap;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags ETHUSDCSwap
deployETHUSDCSwap.tags = ["ETHUSDCSwap"];
