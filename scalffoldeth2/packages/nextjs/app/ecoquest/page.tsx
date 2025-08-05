"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useScaffoldContract } from "~~/hooks/scaffold-eth/useScaffoldContract";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { notification } from "~~/utils/scaffold-eth";

// USDC contract address on Optimism Goerli
const USDC_ADDRESS = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607";

export default function EcoQuestDashboard() {
  const { address, isConnected } = useAccount();
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [isDonating, setIsDonating] = useState(false);

  // Get contract instances
  const { data: donationContract } = useDeployedContractInfo("EcoQuestDonation");
  const { data: nftContract } = useDeployedContractInfo("EcoQuestNFT");

  // Read contract data
  const { data: totalDonations } = useContractRead({
    address: donationContract?.address,
    abi: donationContract?.abi,
    functionName: "totalDonations",
    watch: true,
  });

  const { data: totalCO2Offset } = useContractRead({
    address: donationContract?.address,
    abi: donationContract?.abi,
    functionName: "totalCO2Offset",
    watch: true,
  });

  const { data: userStats } = useContractRead({
    address: donationContract?.address,
    abi: donationContract?.abi,
    functionName: "getUserStats",
    args: [address],
    enabled: !!address,
    watch: true,
  });

  // USDC balance
  const { data: usdcBalance } = useBalance({
    address,
    token: USDC_ADDRESS as `0x${string}`,
    watch: true,
  });

  // Prepare donation transaction
  const { config: approveConfig } = usePrepareContractWrite({
    address: USDC_ADDRESS as `0x${string}`,
    abi: [
      {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
      },
    ],
    functionName: "approve",
    args: donationContract?.address ? [donationContract.address, parseEther(donationAmount || "0")] : undefined,
    enabled: !!donationAmount && !!donationContract?.address,
  });

  const { writeAsync: approveUSDC } = useContractWrite(approveConfig);

  const { config: donateConfig } = usePrepareContractWrite({
    address: donationContract?.address,
    abi: donationContract?.abi,
    functionName: "donate",
    args: [parseEther(donationAmount || "0"), donationMessage],
    enabled: !!donationAmount && !!donationContract?.address,
  });

  const { writeAsync: donate } = useContractWrite(donateConfig);

  // Handle donation
  const handleDonate = async () => {
    if (!donationAmount || !donationContract?.address) return;

    try {
      setIsDonating(true);
      
      // First approve USDC
      await approveUSDC?.();
      
      // Then donate
      await donate?.();
      
      notification.success("Donation successful! Thank you for offsetting carbon!");
      setDonationAmount("");
      setDonationMessage("");
    } catch (error) {
      console.error("Donation error:", error);
      notification.error("Donation failed. Please try again.");
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

        {/* Wallet Connection Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Wallet Status</h2>
          {isConnected ? (
            <div className="space-y-2">
              <p className="text-green-600">✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              <p className="text-gray-600">
                USDC Balance: {usdcBalance ? formatEther(usdcBalance.value) : "0"} USDC
              </p>
            </div>
          ) : (
            <p className="text-red-600">❌ Please connect your wallet to start donating</p>
          )}
        </div>

        {/* Impact Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-green-600">
              {totalDonations ? formatEther(totalDonations) : "0"} USDC
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">CO₂ Offset</h3>
            <p className="text-3xl font-bold text-blue-600">
              {totalCO2Offset ? formatEther(totalCO2Offset) : "0"} kg
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Impact</h3>
            <p className="text-3xl font-bold text-purple-600">
              {userStats ? formatEther(userStats.totalCO2Offset) : "0"} kg
            </p>
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Make a Donation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                USDC Amount
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={!isConnected}
              />
              {donationAmount && (
                <p className="text-sm text-gray-600 mt-1">
                  This will offset {calculateCO2Offset(donationAmount)} kg of CO₂
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={donationMessage}
                onChange={(e) => setDonationMessage(e.target.value)}
                placeholder="Leave a message with your donation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                disabled={!isConnected}
              />
            </div>
            
            <button
              onClick={handleDonate}
              disabled={!isConnected || !donationAmount || isDonating}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isDonating ? "Processing..." : "Donate & Offset Carbon"}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🎮 Play EcoQuest Game</h3>
            <p className="text-gray-600 mb-4">
              Explore virtual flora and fauna to earn eco-points and discover rare NFTs!
            </p>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Launch Game
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🏆 View Leaderboard</h3>
            <p className="text-gray-600 mb-4">
              See the top eco-contributors and their impact on carbon offset!
            </p>
            <button className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
              View Rankings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 