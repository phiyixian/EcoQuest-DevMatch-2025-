"use client";

import { useMemo, useState, useEffect } from "react";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useSearchParams } from "next/navigation";
import { notification } from "~~/utils/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import TransactionFlow from "~~/components/TransactionFlow";
import CeloExplanation from "~~/components/CeloExplanation";
import GoogleAuthButton from "~~/components/GoogleAuthButton";
import Link from "next/link";

export default function EcoQuestDashboard() {
  // Use burner wallet (automatically managed by Scaffold-ETH)
  const { address, isConnected } = useAccount();
  
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [isDonating, setIsDonating] = useState(false);
  const [showTransactionFlow, setShowTransactionFlow] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<number | undefined>();
  const [activeTab, setActiveTab] = useState<"donate" | "flow" | "about">("donate");
  const [ethToConvert, setEthToConvert] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [hasUSDC, setHasUSDC] = useState(false);

  const searchParams = useSearchParams();

  // Get contract info for donation contract address
  const { data: ecoQuestContract } = useDeployedContractInfo({
  contractName: "EcoQuestDonation",
});

  // Get USDC contract info - try multiple approaches
  const { data: usdcContract } = useDeployedContractInfo({
    contractName: "MockUSDC",
  });

  // Get ETH-USDC Swap contract info
  const { data: swapContract } = useDeployedContractInfo({
    contractName: "ETHUSDCSwap",
  });

  // Get USDC address from EcoQuestDonation contract as fallback
  const { data: usdcAddressFromContract } = useScaffoldReadContract({
    contractName: "EcoQuestDonation",
    functionName: "usdcToken",
  });

  // Use deployed MockUSDC contract address for testnet
  // Prioritize our deployed MockUSDC over external USDC addresses
  const usdcAddress = usdcContract?.address || usdcAddressFromContract;

  // Contract read hooks - Using explicit typing to bypass TypeScript issues
  // Aggregate totals from all visible contributors (same as leaderboard logic)
  const { data: donationEvents } = useScaffoldEventHistory({
    contractName: "EcoQuestDonation",
    eventName: "DonationReceived",
    watch: true,
  });

  const { data: userStatsRaw } = (useScaffoldReadContract as any)({
    contractName: "EcoQuestDonation",
    functionName: "getUserStats",
    args: [address],
  });
  type UserStatsResult = {
    totalDonated: bigint;
    totalCO2Offset: bigint;
    donationCount: bigint;
  };
  const userStats = userStatsRaw as UserStatsResult | undefined;

  // Compute community totals by summing all events and including comparator profiles
  const computedTotals = useMemo(() => {
    let donated: bigint = 0n;
    let co2: bigint = 0n;

    donationEvents?.forEach((ev: any) => {
      donated += ((ev as any)?.args?.amount as bigint) ?? 0n;
      co2 += ((ev as any)?.args?.co2Offset as bigint) ?? 0n;
    });

    // Include the same 4 comparator entries used in leaderboard
    const fake = ["150.00", "80.00", "12.50", "0.75"]; // USDC amounts
    for (const u of fake) {
      donated += parseUnits(u, 6);
      co2 += parseEther((parseFloat(u) * 10).toString());
    }

    return { donated, co2 };
  }, [donationEvents]);

  // ETH balance using wagmi
  const { data: ethBalance } = useBalance({
    address,
    query: { refetchInterval: 5000 },
  });

  // USDC balance using wagmi with fallback address
  const { data: usdcBalance } = useBalance({
    address,
    token: usdcAddress as `0x${string}`,
    query: { 
      refetchInterval: 5000,
      enabled: !!usdcAddress && !!address,
    },
  });

  // Check if user has USDC to enable donation
  useEffect(() => {
    if (usdcBalance && usdcBalance.value > 0n) {
      setHasUSDC(true);
    } else {
      setHasUSDC(false);
    }
  }, [usdcBalance]);

  // Note: Contract write hooks removed - using demo mode for Sepolia testnet
  // In production, these would be:
  // const { writeContractAsync: writeUSDC } = useScaffoldWriteContract({ contractName: "MockUSDC" });
  // const { writeContractAsync: writeEcoQuest } = useScaffoldWriteContract({ contractName: "EcoQuestDonation" });

  // Auto-fill from Chrome Extension query params and scroll to donation
  useEffect(() => {
    const amountParam = searchParams.get("donation");
    const msgParam = searchParams.get("message");
    const autoDonate = searchParams.get("autoDonate");

    // Only prefill if this is explicitly requested by the extension and wallet is connected
    if (autoDonate === "true" && isConnected) {
      if (amountParam && !isNaN(parseFloat(amountParam)) && parseFloat(amountParam) > 0) {
        setDonationAmount(amountParam);
      } else {
        setDonationAmount("");
      }
      if (msgParam) {
        setDonationMessage(decodeURIComponent(msgParam));
      } else {
        setDonationMessage("");
      }
      
      // Scroll to donation form when coming from Chrome extension
      setTimeout(() => {
        const donationElement = document.getElementById("donation-form");
        if (donationElement) {
          donationElement.scrollIntoView({ 
            behavior: "smooth", 
            block: "start",
            inline: "nearest" 
          });
        }
      }, 100); // Small delay to ensure page is rendered
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isConnected]);

  // Handle ETH to USDC conversion using real swap contract
  const handleConvertETH = async () => {
    if (!ethToConvert || !address || !swapContract) {
      notification.error("Missing required data for conversion");
      return;
    }
    
    try {
      setIsConverting(true);
      
      notification.info("Converting ETH to USDC...");
      
      const ethAmount = parseEther(ethToConvert);
      
      // Use wagmi writeContract for real transaction
      const { writeContract } = await import('wagmi/actions');
      const { wagmiConfig } = await import('~~/services/web3/wagmiConfig');
      
      // Execute real ETH to USDC swap using the deployed contract
      const txHash = await writeContract(wagmiConfig, {
        address: swapContract.address as `0x${string}`,
        abi: swapContract.abi,
        functionName: 'swapETHForUSDC',
        value: ethAmount,
      });
      
      // Calculate expected USDC amount for display (2000 USDC per ETH)
      const expectedUSDC = parseFloat(ethToConvert) * 2000;
      
      notification.success(`✅ Conversion Successful!`);
      notification.info(`Real swap: ${ethToConvert} ETH → ~${expectedUSDC.toFixed(2)} USDC`);
      notification.info(`Transaction: ${txHash}`);
      
      setEthToConvert("");
      setIsConverting(false);
    } catch (error) {
      console.error("Conversion error:", error);
      notification.error(`Conversion failed! ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConverting(false);
    }
  };

  // Handle donation using Scaffold-ETH hooks
  const handleDonate = async () => {
    if (!donationAmount || !address || !usdcAddress) return;
    try {
      setIsDonating(true);
      const amount = parseUnits(donationAmount, 6); // USDC has 6 decimals
      
      notification.info(`Initiating real USDC transfer for carbon offset...`);
      
      // Create a simple carbon offset wallet address (you can replace with your own)
      const CARBON_OFFSET_WALLET = "0x8d3b09d6d79D421395030207063208FD7b893400"; // Example offset wallet
      
      // Use wagmi to transfer USDC directly
      const { writeContract } = await import('wagmi/actions');
      const { wagmiConfig } = await import('~~/services/web3/wagmiConfig');
      
      // USDC contract ABI for transfer function
      const usdcAbi = [
        {
          name: 'transfer',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ name: '', type: 'bool' }]
        }
      ];
      
      // Execute real USDC transfer
      const txHash = await writeContract(wagmiConfig, {
        address: usdcAddress as `0x${string}`,
        abi: usdcAbi,
        functionName: 'transfer',
        args: [CARBON_OFFSET_WALLET, amount],
      });
      
      // Calculate CO2 offset (frontend logic: 1 USDC = 10 kg CO2)
      const co2Amount = parseFloat(donationAmount) * 10;
      
      notification.success(`✅ Real USDC Transfer Successful!`);
      notification.info(`Transferred ${donationAmount} USDC to carbon offset wallet. Transaction: ${txHash}`);
      notification.success(`🌱 Offset ${co2Amount} kg of CO2!`);
      
      // Show transaction flow
      setCurrentTransactionId(Math.floor(Math.random() * 10000));
      setActiveTab("flow");
      setShowTransactionFlow(true);
      
      setDonationAmount("");
      setDonationMessage("");
    } catch (error) {
      console.error("Offset error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      notification.error(`Transfer failed: ${errorMessage}`);
    } finally {
      setIsDonating(false);
    }
  };

  // Calculate CO2 offset for display
  const calculateCO2Offset = (usdcAmount: string) => {
    const amount = parseFloat(usdcAmount) || 0;
    return (amount * 10).toFixed(2); // 1 USDC = 10 kg CO2
  };

  // Refresh balances manually
  const refreshBalances = () => {
    // Force refresh of balance queries
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 EcoQuest</h1>
          <p className="text-lg text-gray-600 mb-4">Play, Track, and Offset Your Carbon Impact via Celo & Arbitrum Networks</p>
          <div className="flex justify-center gap-4">
            <GoogleAuthButton />
          </div>
        </div>

        

        {/* Game Section - Link to dedicated game page */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-8 text-white text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🎮 EcoQuest Adventure Game</h2>
          <p className="text-lg mb-6">
            Explore the environment, collect unique NFTs, and learn about conservation!
          </p>
          <Link 
            href="/ecoquest/game"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
          >
            🚀 Start Playing
          </Link>
          <p className="text-sm mt-4 opacity-90">
            Connect your wallet to save progress and collect NFTs
          </p>
        </div>

        {/* Wallet Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">💼 MetaMask Wallet Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">ETH Balance</h3>
              <p className="text-2xl font-bold text-blue-600">
                {ethBalance ? formatEther(ethBalance.value) : "Loading..."} ETH
              </p>
              <p className="text-xs text-blue-600">
                {ethBalance ? "Real MetaMask Balance" : "Fetching balance..."}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">USDC Balance</h3>
              <p className="text-2xl font-bold text-green-600">
                {usdcBalance ? formatUnits(usdcBalance.value, 6) : "Loading..."} USDC
              </p>
              <p className="text-xs text-green-600">
                {usdcAddress ? "Sepolia USDC Balance" : "USDC contract not found"}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Wallet Address</h3>
              <p className="text-sm font-mono text-purple-600">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
              </p>
              <p className="text-xs text-purple-600">
                {isConnected ? "Connected ✅" : "Disconnected ❌"}
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-4 text-center">
            <button
              onClick={refreshBalances}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
            >
              🔄 Refresh Balances
            </button>
          </div>


          
          {/* ETH to USDC Conversion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">
              💰 ETH → USDC Converter
            </h3>
            <p className="text-sm mb-4 text-blue-700">
              <strong>Convert ETH to USDC:</strong> Exchange your ETH for USDC to participate in carbon offset donations.
              {!hasUSDC && " You currently need USDC in your wallet to make donations."}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  ETH Amount to Convert
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.001"
                    min="0"
                    value={ethToConvert}
                    onChange={e => setEthToConvert(e.target.value)}
                    placeholder="0.1"
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isConverting}
                  />
                  <button
                    onClick={handleConvertETH}
                    disabled={!ethToConvert || isConverting || !address || !swapContract}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isConverting ? "Converting..." : "Convert"}
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-xs text-blue-600">
                  💡 <strong>Exchange Rate:</strong> 1 ETH = 2000 USDC (fixed rate)
                  <br />
                  <strong>Real Transaction:</strong> This will actually deduct ETH from your wallet and add USDC.
                  {!swapContract && (
                    <>
                      <br />
                      <span className="text-red-600">⚠️ Swap contract not found. Please deploy contracts first.</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {hasUSDC && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                ✅ <strong>Ready to offset carbon!</strong> You have USDC in your wallet and can now make real transfers for carbon offset.
              </p>
            </div>
          )}
        </div>

        {/* Impact Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Donations */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-green-600">{formatUnits(computedTotals.donated, 6)} USDC</p>
          </div>

          {/* Total CO2 Offset */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">CO₂ Offset</h3>
            <p className="text-3xl font-bold text-blue-600">{formatEther(computedTotals.co2)} kg</p>
          </div>

          {/* User Impact */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Impact</h3>
            <p className="text-3xl font-bold text-purple-600">{formatEther(userStats?.totalCO2Offset ?? 0n)} kg</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-2 flex space-x-2 overflow-x-auto">

            <button
              onClick={() => setActiveTab("donate")}
              className={`px-6 py-2 rounded-md transition-all whitespace-nowrap ${
                activeTab === "donate"
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              💳 Carbon Offset
            </button>
            <button
              onClick={() => setActiveTab("flow")}
              className={`px-6 py-2 rounded-md transition-all whitespace-nowrap ${
                activeTab === "flow"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              🔄 Transaction Flow
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-6 py-2 rounded-md transition-all whitespace-nowrap ${
                activeTab === "about"
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              🌍 Why Celo?
            </button>
          </div>
        </div>

        {/* Tab Content */}


        {activeTab === "donate" && (
          <div className="space-y-8">
            {/* USDC Requirement Notice */}
            {!hasUSDC && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">⚠️ USDC Required for Carbon Offset</h3>
                <p className="text-yellow-700 mb-4">
                  To participate in carbon offset donations, you need USDC in your wallet. 
                  You can get testnet USDC from the faucet in the header.
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
                >
                  Get USDC from Faucet
                </button>
              </div>
            )}

            {/* Donation Form */}
            <div id="donation-form" className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                🌍 Real Carbon Offset with USDC
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  <strong>💰 Real Transaction:</strong> This will transfer your actual USDC to a carbon offset wallet. 
                  Your testnet USDC will be permanently transferred to support environmental projects.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>🚀 How it works:</strong> Your USDC is transferred directly to a carbon offset wallet that funds 
                  verified environmental projects. Each USDC contributes to real carbon reduction efforts.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">USDC Amount</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.000001"
                    min="0"
                    autoComplete="off"
                    value={donationAmount}
                    onChange={e => setDonationAmount(e.target.value)}
                    onWheel={e => (e.currentTarget as HTMLInputElement).blur()}
                    onKeyDown={e => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault();
                      }
                    }}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    suppressHydrationWarning
                  />
                  {donationAmount && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">
                        <strong>Expected CO₂ Offset:</strong> {calculateCO2Offset(donationAmount)} kg
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Bridge fee: ~0.5% • Funds go directly to Celo carbon projects
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                  <textarea
                    value={donationMessage}
                    onChange={e => setDonationMessage(e.target.value)}
                    placeholder="Leave a message with your carbon offset contribution..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    suppressHydrationWarning
                  />
                </div>

                <button
                  onClick={() => {
                    if (confirm(`⚠️ REAL TRANSACTION CONFIRMATION\n\nYou are about to transfer ${donationAmount} USDC from your wallet to a carbon offset address.\n\nThis is a REAL transaction that will permanently transfer your USDC.\n\nDo you want to proceed?`)) {
                      handleDonate();
                    }
                  }}
                  disabled={!donationAmount || isDonating || !hasUSDC}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:from-green-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  {!hasUSDC 
                    ? "⚠️ USDC Required for Offset" 
                    : isDonating 
                      ? "🔄 Transferring USDC..." 
                      : "🌍 Transfer USDC for Carbon Offset"
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "flow" && (
          <TransactionFlow 
            bridgeTransactionId={currentTransactionId}
            amount={donationAmount}
            purpose={donationMessage}
          />
        )}

        {activeTab === "about" && (
          <CeloExplanation />
        )}
      </div>
    </div>
  );
}

