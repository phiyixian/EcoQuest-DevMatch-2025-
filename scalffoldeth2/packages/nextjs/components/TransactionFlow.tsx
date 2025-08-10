"use client";

import React, { useState } from "react";

interface TransactionStep {
  id: number;
  title: string;
  description: string;
  status: "pending" | "processing" | "completed" | "failed";
  timestamp?: string;
  txHash?: string;
  amount?: string;
}

interface TransactionFlowProps {
  bridgeTransactionId?: number;
  amount?: string;
  purpose?: string;
}

export default function TransactionFlow({ bridgeTransactionId, amount, purpose }: TransactionFlowProps) {
  // Mock transaction steps for demo
  const [steps] = useState<TransactionStep[]>([
    {
      id: 1,
      title: "USDC Approval",
      description: "Approve USDC spending for carbon offset",
      status: "completed",
      timestamp: "2024-01-15 10:30:15",
      txHash: "0x1234...5678",
      amount: amount,
    },
    {
      id: 2,
      title: "Bridge Selection",
      description: "Choose bridge network: Celo (USDC) or Arbitrum (ETH)",
      status: "completed",
      timestamp: "2024-01-15 10:30:30",
      txHash: "0x5678...9abc",
      amount: amount,
    },
    {
      id: 3,
      title: "Cross-Chain Bridge",
      description: "Bridge funds to Celo (for USDC) or Arbitrum (for ETH)",
      status: "completed",
      timestamp: "2024-01-15 10:30:45",
      txHash: "0xabcd...efgh",
      amount: amount,
    },
    {
      id: 4,
      title: "Network Transfer",
      description: "Transfer to L2 network for efficient carbon project funding",
      status: "processing",
      timestamp: "2024-01-15 10:31:00",
      txHash: "0xnetwork...1234",
      amount: amount,
    },
    {
      id: 5,
      title: "Carbon Project Funding",
      description: "Funds allocated to verified carbon offset projects",
      status: "pending",
      amount: amount,
    },
    {
      id: 6,
      title: "CO₂ Certificate Generation",
      description: "Generate carbon offset certificate and NFT",
      status: "pending",
      amount: amount,
    },
  ]);

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "processing":
        return "🔄";
      case "failed":
        return "❌";
      default:
        return "⏳";
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 border-green-200 bg-green-50";
      case "processing":
        return "text-blue-600 border-blue-200 bg-blue-50";
      case "failed":
        return "text-red-600 border-red-200 bg-red-50";
      default:
        return "text-gray-500 border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🌍 Multi-Chain Carbon Offset Flow</h2>
          {bridgeTransactionId && (
            <p className="text-sm text-gray-600">
              Bridge Transaction ID: <span className="font-mono">{bridgeTransactionId}</span>
            </p>
          )}
          {purpose && (
            <p className="text-sm text-gray-600">
              Purpose: <span className="italic">{purpose}</span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`border rounded-lg p-4 transition-all duration-300 ${getStepColor(step.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getStepIcon(step.status)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>

                    {step.timestamp && <p className="text-xs text-gray-500 mt-2">⏰ {step.timestamp}</p>}

                    {step.txHash && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Transaction: </span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{step.txHash}</code>
                      </div>
                    )}
                  </div>
                </div>

                {step.amount && (
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-700">{step.amount} USDC</span>
                  </div>
                )}
              </div>

              {/* Progress indicator */}
              {index < steps.length - 1 && (
                <div className="ml-6 mt-4 h-6 border-l-2 border-dashed border-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-600">🌱</span>
            <h3 className="font-semibold text-green-800">Environmental Impact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Estimated CO₂ Offset:</span>
              <div className="font-semibold text-green-700">
                {amount ? `${parseFloat(amount) * 10} kg` : "Calculating..."}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Project Type:</span>
              <div className="font-semibold text-green-700">Reforestation & Clean Energy</div>
            </div>
            <div>
              <span className="text-gray-600">Verification:</span>
              <div className="font-semibold text-green-700">Verified Carbon Standard (VCS)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
