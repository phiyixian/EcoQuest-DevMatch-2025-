"use client";

import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const ArbitrumBridge = () => {
  const { address, isConnected } = useAccount();
  const [ethAmount, setEthAmount] = useState("");
  const [arbitrumAddress, setArbitrumAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get user's ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // Get bridge fee and stats
  const { data: bridgeFee } = useScaffoldReadContract({
    contractName: "ArbitrumBridge",
    functionName: "bridgeFee",
  });

  const { data: bridgeStats } = useScaffoldReadContract({
    contractName: "ArbitrumBridge",
    functionName: "getBridgeStats",
  });

  // Bridge write function
  const { writeContractAsync: bridgeToArbitrum } = useScaffoldWriteContract({
    contractName: "ArbitrumBridge",
  });

  const handleBridge = async () => {
    if (!isConnected || !address || !ethAmount || !arbitrumAddress) return;

    try {
      setIsLoading(true);
      const amount = parseEther(ethAmount);

      await bridgeToArbitrum({
        functionName: "bridgeToArbitrum",
        args: [arbitrumAddress],
        value: amount,
      });

      // Reset form
      setEthAmount("");
      setArbitrumAddress("");

      console.log("✅ Bridge transaction initiated successfully!");
    } catch (error) {
      console.error("❌ Bridge transaction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidAmount = () => {
    if (!ethAmount || !bridgeFee || !ethBalance) return false;
    try {
      const amount = parseEther(ethAmount);
      return amount > bridgeFee && amount <= ethBalance.value;
    } catch {
      return false;
    }
  };

  const isValidAddress = () => {
    return arbitrumAddress.length === 42 && arbitrumAddress.startsWith("0x");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">🌉</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Arbitrum Bridge</h3>
          <p className="text-sm text-gray-600">Bridge ETH to Arbitrum L2</p>
        </div>
      </div>

      {/* Bridge Stats */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Bridge Fee</div>
            <div className="font-semibold">{bridgeFee ? formatEther(bridgeFee) : "0.001"} ETH</div>
          </div>
          <div>
            <div className="text-gray-500">Total Bridged</div>
            <div className="font-semibold">{bridgeStats ? formatEther(bridgeStats[0]) : "0"} ETH</div>
          </div>
        </div>
      </div>

      {/* Bridge Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ETH Amount</label>
          <div className="relative">
            <input
              type="number"
              step="0.001"
              placeholder="0.1"
              className="input input-bordered w-full pr-12"
              value={ethAmount}
              onChange={e => setEthAmount(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">ETH</span>
          </div>
          {ethBalance && <div className="text-xs text-gray-500 mt-1">Balance: {formatEther(ethBalance.value)} ETH</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Arbitrum Recipient Address</label>
          <input
            type="text"
            placeholder="0x..."
            className="input input-bordered w-full"
            value={arbitrumAddress}
            onChange={e => setArbitrumAddress(e.target.value)}
          />
          <div className="text-xs text-gray-500 mt-1">Enter your Arbitrum wallet address</div>
        </div>

        {/* Transaction Summary */}
        {ethAmount && bridgeFee && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Amount to bridge:</span>
                <span>{ethAmount} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Bridge fee:</span>
                <span>{formatEther(bridgeFee)} ETH</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1">
                <span>Total required:</span>
                <span>
                  {ethAmount && !isNaN(parseFloat(ethAmount))
                    ? (parseFloat(ethAmount) + parseFloat(formatEther(bridgeFee))).toFixed(4)
                    : "0"}{" "}
                  ETH
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          className={`btn w-full ${isValidAmount() && isValidAddress() && !isLoading ? "btn-primary" : "btn-disabled"}`}
          onClick={handleBridge}
          disabled={!isValidAmount() || !isValidAddress() || isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Bridging...
            </>
          ) : (
            "Bridge to Arbitrum"
          )}
        </button>

        {!isConnected && <div className="text-center text-gray-500 text-sm">Connect wallet to bridge ETH</div>}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <div className="text-xs text-yellow-800">
          <div className="font-semibold mb-1">ℹ️ Bridge Information</div>
          <ul className="space-y-1">
            <li>• This is a demonstration bridge for testnet</li>
            <li>• Funds will be held in the bridge contract</li>
            <li>• Real Arbitrum bridge uses different mechanics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArbitrumBridge;
