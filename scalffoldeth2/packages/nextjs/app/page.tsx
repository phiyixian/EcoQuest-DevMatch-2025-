"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-green-100">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Forest landscape"
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-blue-600/30"></div>
          </div>

          <div className="relative container mx-auto px-6 py-20 text-center">
            <h1 className="text-6xl font-bold text-green-800 mb-6">🌱 EcoQuest</h1>
            <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              The Revolutionary Web3 Platform for Carbon Offset and Environmental Impact Tracking
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto">
              Join the future of climate action with blockchain-powered transparency, direct project funding through
              Celo network, and gamified environmental impact tracking. Make every transaction count for our planet.
            </p>

            <div className="flex justify-center items-center space-x-2 flex-col mb-8">
              <p className="text-sm font-medium text-gray-600">Your Wallet Address:</p>
              <Address address={connectedAddress} />
            </div>

            <Link
              href="/ecoquest"
              className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white text-xl font-semibold px-12 py-4 rounded-full hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Your Eco Journey →
            </Link>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Why Choose EcoQuest?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Blockchain Transparency */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1332&q=80"
                alt="Blockchain network"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🔗 Blockchain Transparency</h3>
                <p className="text-gray-600">
                  Every carbon offset transaction is recorded on the blockchain, ensuring complete transparency and
                  verifiability of environmental impact.
                </p>
              </div>
            </div>

            {/* Direct Project Funding */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1313&q=80"
                alt="Environmental project"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🎯 Direct Impact</h3>
                <p className="text-gray-600">
                  Your funds go directly to verified carbon offset projects via Celo network, eliminating intermediaries
                  and maximizing environmental impact.
                </p>
              </div>
            </div>

            {/* Gamified Experience */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1334&q=80"
                alt="Gaming elements"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🎮 Gamified Journey</h3>
                <p className="text-gray-600">
                  Earn EcoProof NFTs, climb leaderboards, and track your environmental achievements in an engaging,
                  game-like experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">How EcoQuest Works</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">1️⃣</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect Your Wallet</h3>
                    <p className="text-gray-600">
                      Use our built-in burner wallet or connect your existing Web3 wallet to get started instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">2️⃣</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Offset Carbon</h3>
                    <p className="text-gray-600">
                      Donate USDC to offset your carbon footprint. Funds are bridged to Celo network for direct project
                      funding.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">3️⃣</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Impact</h3>
                    <p className="text-gray-600">
                      Monitor your environmental impact, earn NFT badges, and compete on the global leaderboard.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <img
                  src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                  alt="Environmental dashboard"
                  className="w-full rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Platform Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/ecoquest" className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl text-center hover:shadow-lg transition-all group-hover:scale-105">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Carbon Offset Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  Track your donations, monitor CO₂ offset, and manage your environmental impact in real-time.
                </p>
                <span className="text-green-600 font-semibold group-hover:text-green-700">Start Offsetting →</span>
              </div>
            </Link>

            <Link href="/ecoquest/leaderboard" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center hover:shadow-lg transition-all group-hover:scale-105">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Global Leaderboard</h3>
                <p className="text-gray-600 mb-4">
                  See top contributors worldwide and discover how your efforts compare to the community.
                </p>
                <span className="text-blue-600 font-semibold group-hover:text-blue-700">View Rankings →</span>
              </div>
            </Link>

            <Link href="/ecoquest/gallery" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl text-center hover:shadow-lg transition-all group-hover:scale-105">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">EcoProof NFT Gallery</h3>
                <p className="text-gray-600 mb-4">
                  Collect unique NFT badges that represent your environmental achievements and milestones.
                </p>
                <span className="text-purple-600 font-semibold group-hover:text-purple-700">View Collection →</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already making a positive environmental impact through EcoQuest. Every
              offset counts, every action matters.
            </p>
            <Link
              href="/ecoquest"
              className="inline-block bg-white text-green-600 text-xl font-semibold px-12 py-4 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Begin Your Impact Journey
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
