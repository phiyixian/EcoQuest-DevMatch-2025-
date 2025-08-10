"use client";

import React from "react";

export default function CeloExplanation() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative h-80 rounded-xl overflow-hidden mb-8 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Beautiful forest landscape representing carbon offset and environmental impact"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-blue-900/60 to-green-900/70 flex items-center justify-center">
              <div className="text-center text-white px-8">
                <h1 className="text-5xl font-bold mb-6">🌍 Why We Choose Celo Network</h1>
                <p className="text-2xl max-w-3xl mx-auto leading-relaxed">
                  The carbon-negative blockchain powering real environmental change
                </p>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Celo is the perfect blockchain for carbon offset projects, combining sustainability, accessibility, and
            direct environmental impact funding for maximum positive impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Carbon Negative */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Green forest canopy representing carbon negative impact"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-green-800">Carbon Negative</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Celo is a <strong>carbon-negative blockchain</strong>, meaning it removes more CO₂ from the atmosphere
              than it produces. Every transaction contributes to a greener future.
            </p>
          </div>

          {/* Mobile-First */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Mobile phone with modern financial app interface"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-blue-800">Mobile-First</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Designed for mobile accessibility, enabling carbon offset participation from anywhere in the world using
              just a phone number, making sustainability accessible to everyone.
            </p>
          </div>

          {/* Low Fees */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1621981386829-9b458a2cddde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Digital coins and low fees concept"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-purple-800">Ultra-Low Fees</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Transaction costs under $0.01 mean more of your donation goes directly to carbon projects, not network
              fees. Maximum impact for your contribution.
            </p>
          </div>

          {/* Real-World Impact */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Global sustainability and real-world environmental projects"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-yellow-800">Real-World Focus</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Celo's mission aligns with ours: creating financial tools for a more inclusive and sustainable world.
              Their ecosystem supports real environmental projects.
            </p>
          </div>

          {/* Stable Coins */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Digital financial stability and stablecoin concept"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-red-800">Stable Value</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Native stablecoins (cUSD, cEUR) provide price stability for long-term carbon project funding without
              cryptocurrency volatility affecting project outcomes.
            </p>
          </div>

          {/* Regenerative Finance */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Hands holding seedling representing regenerative finance ecosystem"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-indigo-800">ReFi Ecosystem</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Part of the growing Regenerative Finance (ReFi) ecosystem, connecting with other environmental and social
              impact projects for maximum collective benefit.
            </p>
          </div>
        </div>

        {/* Technical Benefits */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🔧 Technical Advantages for Carbon Offsets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h4 className="font-semibold">Proof of Stake Consensus</h4>
                  <p className="text-sm text-gray-600">
                    Energy-efficient consensus mechanism uses 99% less energy than Bitcoin
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h4 className="font-semibold">Smart Contract Transparency</h4>
                  <p className="text-sm text-gray-600">
                    All carbon offset transactions are publicly verifiable and traceable
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h4 className="font-semibold">Automated Distribution</h4>
                  <p className="text-sm text-gray-600">
                    Smart contracts ensure funds reach verified projects without intermediaries
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h4 className="font-semibold">Multi-Asset Support</h4>
                  <p className="text-sm text-gray-600">
                    Support for multiple stablecoins and tokens for flexible funding options
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h4 className="font-semibold">Cross-Chain Bridging</h4>
                  <p className="text-sm text-gray-600">
                    Seamless value transfer from Ethereum to Celo for optimal project funding
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h4 className="font-semibold">Real-Time Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Monitor your carbon offset impact in real-time with blockchain verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Flow */}
        <div className="bg-gradient-to-r from-green-50 via-blue-50 to-green-50 rounded-xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🔄 How Your Donation Flows to Celo</h2>

          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex-1 min-h-[220px]">
              <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Digital wallet with USDC representing initial deposit"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg text-green-800 mb-2">1. USDC Deposit</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                You contribute USDC on Ethereum mainnet through our secure platform
              </p>
            </div>

            <div className="text-3xl text-gray-400 self-center transform rotate-90 lg:rotate-0">→</div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex-1 min-h-[220px]">
              <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Blockchain network bridge representing cross-chain transfer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg text-blue-800 mb-2">2. Bridge to Celo</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Funds transferred to Celo network via secure, audited bridge protocol
              </p>
            </div>

            <div className="text-3xl text-gray-400 self-center transform rotate-90 lg:rotate-0">→</div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex-1 min-h-[220px]">
              <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Environmental project funding and tree planting"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg text-green-800 mb-2">3. Project Funding</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Direct funding to verified carbon offset and reforestation projects
              </p>
            </div>

            <div className="text-3xl text-gray-400 self-center transform rotate-90 lg:rotate-0">→</div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow flex-1 min-h-[220px]">
              <div className="w-20 h-20 mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Digital certificate and blockchain verification"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg text-purple-800 mb-2">4. Impact Proof</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Receive verifiable carbon offset certificate and NFT badge
              </p>
            </div>
          </div>
        </div>

        {/* Environmental Impact Showcase */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Lush reforestation project showing environmental impact and biodiversity"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-blue-900/70 to-green-900/80 flex items-center justify-center">
            <div className="text-center text-white px-8">
              <h3 className="text-4xl font-bold mb-6">Real Impact, Real Projects</h3>
              <p className="text-xl max-w-3xl mx-auto italic leading-relaxed mb-8">
                "By choosing Celo, we ensure your carbon offset contributions have maximum environmental impact while
                maintaining full transparency and minimal fees."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">500K+</div>
                  <div className="text-lg">Trees Planted</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">2M+</div>
                  <div className="text-lg">Tons CO₂ Offset</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-lg">Active Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Project Examples */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Featured Carbon Offset Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Amazon rainforest conservation project with pristine biodiversity"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h4 className="text-xl font-bold text-green-800 mb-3">Amazon Conservation</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Protecting 50,000 hectares of rainforest in Brazil through sustainable forestry practices and
                  indigenous community partnerships.
                </p>
                <div className="bg-green-50 rounded-lg p-3">
                  <span className="font-semibold text-green-800">Impact:</span>
                  <span className="text-green-700 ml-2">125,000 tons CO₂/year</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Large scale solar energy installation in African landscape"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h4 className="text-xl font-bold text-blue-800 mb-3">Solar Energy Kenya</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Building solar microgrids to provide clean energy to rural communities in East Africa, replacing
                  fossil fuel dependency.
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="font-semibold text-blue-800">Impact:</span>
                  <span className="text-blue-700 ml-2">80,000 tons CO₂/year</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1569163139472-de65eca84ddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Coastal mangrove restoration project with young mangrove trees"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h4 className="text-xl font-bold text-teal-800 mb-3">Mangrove Restoration</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Restoring coastal mangrove ecosystems in Southeast Asia for carbon sequestration and coastal
                  protection.
                </p>
                <div className="bg-teal-50 rounded-lg p-3">
                  <span className="font-semibold text-teal-800">Impact:</span>
                  <span className="text-teal-700 ml-2">60,000 tons CO₂/year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
