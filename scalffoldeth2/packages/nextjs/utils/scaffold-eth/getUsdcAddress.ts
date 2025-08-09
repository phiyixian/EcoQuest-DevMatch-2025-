import { useSelectedNetwork } from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

/**
 * Get the correct USDC address based on the network
 * For localhost/hardhat: use deployed MockUSDC
 * For other networks: use real USDC address
 */
export const useUsdcAddress = () => {
  const selectedNetwork = useSelectedNetwork();
  const { data: mockUsdcContract } = useDeployedContractInfo("MockUSDC");

  // For localhost/hardhat networks, use MockUSDC
  if (selectedNetwork?.id === 31337) {
    return mockUsdcContract?.address;
  }

  // For other networks, use real USDC address
  return "0x7F5c764cBc14f9669B88837ca1490cCa17c31607" as `0x${string}`;
};

/**
 * Get USDC ABI based on the network
 */
export const useUsdcAbi = () => {
  const selectedNetwork = useSelectedNetwork();
  const { data: mockUsdcContract } = useDeployedContractInfo("MockUSDC");

  // For localhost/hardhat networks, use MockUSDC ABI
  if (selectedNetwork?.id === 31337) {
    return mockUsdcContract?.abi;
  }

  // For other networks, use minimal USDC ABI
  return [
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
  ] as const;
}; 