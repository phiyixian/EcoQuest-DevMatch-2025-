"use client";

import { useState, useEffect } from "react";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useSearchParams } from "next/navigation";
import { notification } from "~~/utils/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

export default function EcoQuestDashboard() {
  // Use burner wallet (automatically managed by Scaffold-ETH)
  const { address, isConnected } = useAccount();
  
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [isDonating, setIsDonating] = useState(false);

  const searchParams = useSearchParams();

  // Get contract info for donation contract address
  const { data: ecoQuestContract } = useDeployedContractInfo({
  contractName: "EcoQuestDonation",
});

  // Get USDC contract info
  const { data: usdcContract } = useDeployedContractInfo({
    contractName: "MockUSDC",
  });

  // Contract read hooks - Using explicit typing to bypass TypeScript issues
  const { data: totalDonations } = (useScaffoldReadContract as any)({
    contractName: "EcoQuestDonation",
    functionName: "totalDonations",
  });

  const { data: totalCO2Offset } = (useScaffoldReadContract as any)({
    contractName: "EcoQuestDonation",
    functionName: "totalCO2Offset",
  });

  const { data: userStatsRaw } = (useScaffoldReadContract as any)({
    contractName: "EcoQuestDonation",
    functionName: "getUserStats",
    args: [address],
  });
  const userStats = userStatsRaw as [bigint, bigint] | undefined;

  // USDC balance using wagmi
  const { data: usdcBalance } = useBalance({
    address,
    token: usdcContract?.address,
    query: { refetchInterval: 5000 },
  });

  // Contract write hooks - Using explicit typing to bypass TypeScript issues
  const { writeContractAsync: writeUSDC } = (useScaffoldWriteContract as any)({
    contractName: "MockUSDC",
  });
  const { writeContractAsync: writeEcoQuest } = (useScaffoldWriteContract as any)({
    contractName: "EcoQuestDonation",
  });

  // Auto-fill from Chrome Extension query params
  useEffect(() => {
    const amountParam = searchParams.get("donation");
    const msgParam = searchParams.get("message");
    const autoDonate = searchParams.get("autoDonate");
    
    // Only prefill if this is actually from the extension (has autoDonate flag)
    if (autoDonate === "true") {
      if (amountParam && !isNaN(parseFloat(amountParam)) && parseFloat(amountParam) > 0) {
        setDonationAmount(amountParam);
      }
      if (msgParam) {
        setDonationMessage(decodeURIComponent(msgParam));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isConnected]);

  // Handle donation using Scaffold-ETH hooks
  const handleDonate = async () => {
    if (!donationAmount || !address) return;
    try {
      setIsDonating(true);
      const amount = parseUnits(donationAmount, 6); // USDC has 6 decimals
      // Calculate CO2 offset (frontend logic: 1 USDC = 10 kg CO2)
      const co2Offset = parseEther((parseFloat(donationAmount) * 10).toString());

      // 1️⃣ Approve USDC using Scaffold hook
      await writeUSDC({
  functionName: "approve",
  args: [ecoQuestContract?.address, amount], // Use the contract address from deployedContracts
});

      // 2️⃣ Call offset using Scaffold hook
      await writeEcoQuest({
        functionName: "offset",
        args: [amount, co2Offset, donationMessage],
      });

      notification.success("Offset successful! Thank you for offsetting carbon!");
      setDonationAmount("");
      setDonationMessage("");
    } catch (error) {
      console.error("Offset error:", error);
      notification.error("Offset failed. Please try again.");
    } finally {
      setIsDonating(false);
    }
  };

  // Calculate CO2 offset for display
  const calculateCO2Offset = (usdcAmount: string) => {
    const amount = parseFloat(usdcAmount) || 0;
    return (amount * 10).toFixed(2); // 1 USDC = 10 kg CO2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 EcoQuest</h1>
          <p className="text-lg text-gray-600">Play, Track, and Offset Your Carbon Impact</p>
        </div>

        {/* Wallet Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Burner Wallet Status</h2>
          <div className="space-y-2">
            <p className="text-green-600">
              ✅ Using Burner Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <p className="text-gray-600">
              USDC Balance: {usdcBalance ? formatUnits(usdcBalance.value, 6) : "0"} USDC
            </p>
            <p className="text-sm text-blue-600">
              💡 This is an automatically generated burner wallet (no external wallet needed)
            </p>
          </div>
        </div>

        {/* Impact Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Donations */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-green-600">
              {totalDonations ? formatUnits(totalDonations as bigint, 6) : "0"} USDC
            </p>
          </div>

          {/* Total CO2 Offset */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">CO₂ Offset</h3>
            <p className="text-3xl font-bold text-blue-600">
              {totalCO2Offset ? formatEther(totalCO2Offset as bigint) : "0"} kg
            </p>
          </div>

          {/* User Impact */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Impact</h3>
            <p className="text-3xl font-bold text-purple-600">{formatEther(userStats?.[1] ?? 0n)} kg</p>
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Make a Donation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">USDC Amount</label>
              <input
                type="number"
                value={donationAmount}
                onChange={e => setDonationAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                suppressHydrationWarning
              />
              {donationAmount && (
                <p className="text-sm text-gray-600 mt-1">
                  This will offset {calculateCO2Offset(donationAmount)} kg of CO₂
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                value={donationMessage}
                onChange={e => setDonationMessage(e.target.value)}
                placeholder="Leave a message with your donation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                suppressHydrationWarning
              />
            </div>

            <button
              onClick={handleDonate}
              disabled={!donationAmount || isDonating}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isDonating ? "Processing..." : "Donate & Offset Carbon"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
