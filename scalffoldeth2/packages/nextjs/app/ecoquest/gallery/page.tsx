"use client";

import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

// Dummy NFT data for demo
const dummyNFTs = [
  {
    id: 1,
    name: "Carbon Offset Proof #1",
    description: "Proof of 50 kg CO₂ offset with 5 USDC donation",
    image: "🌱",
    type: "DONATION_PROOF",
    co2Offset: "50.00",
    timestamp: "2024-01-15",
    rarity: "Common",
  },
  {
    id: 2,
    name: "Rare Discovery: Golden Oak",
    description: "Discovered a rare Golden Oak in the virtual forest",
    image: "🌳",
    type: "RARE_DISCOVERY",
    co2Offset: "0.00",
    timestamp: "2024-01-14",
    rarity: "Rare",
  },
  {
    id: 3,
    name: "Quest Completion: Forest Guardian",
    description: "Completed the Forest Guardian quest and protected endangered species",
    image: "🦉",
    type: "QUEST_COMPLETION",
    co2Offset: "25.00",
    timestamp: "2024-01-13",
    rarity: "Epic",
  },
  {
    id: 4,
    name: "Carbon Offset Proof #2",
    description: "Proof of 100 kg CO₂ offset with 10 USDC donation",
    image: "🌿",
    type: "DONATION_PROOF",
    co2Offset: "100.00",
    timestamp: "2024-01-12",
    rarity: "Common",
  },
  {
    id: 5,
    name: "Rare Discovery: Rainbow Orchid",
    description: "Found the legendary Rainbow Orchid in the misty mountains",
    image: "🌸",
    type: "RARE_DISCOVERY",
    co2Offset: "0.00",
    timestamp: "2024-01-11",
    rarity: "Legendary",
  },
];

export default function NFTGalleryPage() {
  const { address, isConnected } = useAccount();
  const [userNFTs, setUserNFTs] = useState(dummyNFTs);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);

  // Get contract data
  const { data: nftContract } = useDeployedContractInfo("EcoQuestNFT");

  // In a real implementation, you would fetch NFTs from the contract
  useEffect(() => {
    if (isConnected && address) {
      setIsLoading(true);
      // Simulate fetching NFTs from contract
      setTimeout(() => {
        setUserNFTs(dummyNFTs);
        setIsLoading(false);
      }, 1000);
    }
  }, [isConnected, address]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-600";
      case "Rare":
        return "text-blue-600";
      case "Epic":
        return "text-purple-600";
      case "Legendary":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "DONATION_PROOF":
        return "💚";
      case "RARE_DISCOVERY":
        return "🔍";
      case "QUEST_COMPLETION":
        return "🏆";
      case "CARBON_OFFSET":
        return "🌍";
      default:
        return "🎖️";
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">🌱 EcoQuest NFT Gallery</h1>
          <p className="text-lg text-gray-600 mb-8">Connect your wallet to view your EcoProof NFTs</p>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-red-600">❌ Please connect your wallet to view your NFT collection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 EcoQuest NFT Gallery</h1>
          <p className="text-lg text-gray-600">Your Collection of EcoProof Tokens</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total NFTs</h3>
            <p className="text-3xl font-bold text-green-600">{userNFTs.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total CO₂ Offset</h3>
            <p className="text-3xl font-bold text-blue-600">
              {userNFTs.reduce((sum, nft) => sum + parseFloat(nft.co2Offset), 0).toFixed(2)} kg
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Rare Discoveries</h3>
            <p className="text-3xl font-bold text-purple-600">
              {userNFTs.filter(nft => nft.type === "RARE_DISCOVERY").length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quest Completions</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {userNFTs.filter(nft => nft.type === "QUEST_COMPLETION").length}
            </p>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your EcoProof Collection</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your NFTs...</p>
            </div>
          ) : userNFTs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No NFTs Yet</h3>
              <p className="text-gray-600 mb-4">Start donating and playing EcoQuest to earn your first EcoProof NFTs!</p>
              <a
                href="/ecoquest"
                className="inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Start Donating
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedNFT(nft)}
                >
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">{nft.image}</div>
                    <div className="text-sm text-gray-500">{getTypeIcon(nft.type)} {nft.type.replace('_', ' ')}</div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{nft.name}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600 text-center">{nft.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">CO₂ Offset:</span>
                      <span className="font-semibold text-green-600">{nft.co2Offset} kg</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Rarity:</span>
                      <span className={`font-semibold ${getRarityColor(nft.rarity)}`}>{nft.rarity}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-600">{nft.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NFT Detail Modal */}
        {selectedNFT && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="text-center mb-4">
                <div className="text-8xl mb-4">{selectedNFT.image}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedNFT.name}</h3>
                <p className="text-gray-600 mb-4">{selectedNFT.description}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-semibold">{selectedNFT.type.replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">CO₂ Offset:</span>
                  <span className="font-semibold text-green-600">{selectedNFT.co2Offset} kg</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Rarity:</span>
                  <span className={`font-semibold ${getRarityColor(selectedNFT.rarity)}`}>{selectedNFT.rarity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-gray-600">{selectedNFT.timestamp}</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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