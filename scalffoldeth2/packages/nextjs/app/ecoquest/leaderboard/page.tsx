"use client";

import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { formatEther, formatUnits } from "viem";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

// Dummy data for demo
const dummyLeaderboard = [
  {
    rank: 1,
    address: "0x1234...5678",
    totalDonated: "150.00",
    co2Offset: "1500.00",
    donationCount: 5,
    avatar: "🌱",
  },
  {
    rank: 2,
    address: "0x8765...4321",
    totalDonated: "120.00",
    co2Offset: "1200.00",
    donationCount: 3,
    avatar: "🌿",
  },
  {
    rank: 3,
    address: "0x9876...5432",
    totalDonated: "100.00",
    co2Offset: "1000.00",
    donationCount: 2,
    avatar: "🌳",
  },
  {
    rank: 4,
    address: "0x5432...9876",
    totalDonated: "80.00",
    co2Offset: "800.00",
    donationCount: 4,
    avatar: "🌲",
  },
  {
    rank: 5,
    address: "0x6789...1234",
    totalDonated: "60.00",
    co2Offset: "600.00",
    donationCount: 1,
    avatar: "🌺",
  },
];

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState(dummyLeaderboard);
  const [isLoading, setIsLoading] = useState(false);

  // Get contract data
  const { data: donationContract } = useDeployedContractInfo("EcoQuestDonation");
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

  // In a real implementation, you would fetch leaderboard data from the contract
  // For now, we'll use dummy data
  useEffect(() => {
    // Simulate loading real data
    setIsLoading(true);
    setTimeout(() => {
      setLeaderboardData(dummyLeaderboard);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🏆 EcoQuest Leaderboard</h1>
          <p className="text-lg text-gray-600">Top Carbon Offset Contributors</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Community Impact</h3>
            <p className="text-3xl font-bold text-green-600">
              {totalCO2Offset ? formatEther(totalCO2Offset) : "0"} kg CO₂
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-blue-600">
              {totalDonations ? formatUnits(totalDonations as bigint, 6) : "0"} USDC
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Contributors</h3>
            <p className="text-3xl font-bold text-purple-600">{leaderboardData.length}</p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Contributors</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    user.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getRankBadge(user.rank)}</div>
                    <div className="text-3xl">{user.avatar}</div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.address}</p>
                      <p className="text-sm text-gray-600">{user.donationCount} donations</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{user.totalDonated} USDC</p>
                    <p className="text-sm text-gray-600">{user.co2Offset} kg CO₂ offset</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How to climb the leaderboard */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🚀 How to Climb the Leaderboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">💚</div>
              <h4 className="font-semibold text-gray-800 mb-2">Make Donations</h4>
              <p className="text-sm text-gray-600">Donate USDC to offset carbon and earn points</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🎮</div>
              <h4 className="font-semibold text-gray-800 mb-2">Play EcoQuest</h4>
              <p className="text-sm text-gray-600">Discover rare flora and fauna for bonus points</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🏆</div>
              <h4 className="font-semibold text-gray-800 mb-2">Earn NFTs</h4>
              <p className="text-sm text-gray-600">Complete quests to mint exclusive EcoProof NFTs</p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <a
            href="/ecoquest"
            className="inline-block bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
} 