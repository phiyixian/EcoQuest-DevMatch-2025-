"use client";

import { useState } from "react";
import { createWalletClient, http, parseEther, parseUnits, encodeFunctionData } from "viem";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// Number of ETH faucet sends to an address
const NUM_OF_ETH = "1";
const NUM_OF_USDC = "100"; // 100 USDC
const FAUCET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const localWalletClient = createWalletClient({
  chain: hardhat,
  transport: http(),
});

/**
 * FaucetButton button which lets you grab eth and USDC.
 */
export const FaucetButton = () => {
  const { address, chain: ConnectedChain } = useAccount();

  const { data: balance } = useWatchBalance({ address });
  const { data: usdcContract } = useDeployedContractInfo("MockUSDC");

  const [loading, setLoading] = useState(false);

  const faucetTxn = useTransactor(localWalletClient);

  const sendETHAndUSDC = async () => {
    if (!address || !usdcContract) return;
    try {
      setLoading(true);
      
      console.log("Recipient address (burner wallet):", address);
      console.log("USDC contract address:", usdcContract.address);
      console.log("Faucet address:", FAUCET_ADDRESS);
      
      // Send ETH
      await faucetTxn({
        account: FAUCET_ADDRESS,
        to: address,
        value: parseEther(NUM_OF_ETH),
      });

      // Send USDC (transfer from faucet address to user)
      await faucetTxn({
        account: FAUCET_ADDRESS,
        to: usdcContract.address,
        data: encodeFunctionData({
          abi: usdcContract.abi,
          functionName: "transfer",
          args: [address, parseUnits(NUM_OF_USDC, 6)],
        }),
      });

      setLoading(false);
    } catch (error) {
      console.error("⚡️ ~ file: FaucetButton.tsx:sendETHAndUSDC ~ error", error);
      setLoading(false);
    }
  };

  // Render only on local chain
  if (ConnectedChain?.id !== hardhat.id) {
    return null;
  }

  const isBalanceZero = balance && balance.value === 0n;

  return (
    <div
      className={
        !isBalanceZero
          ? "ml-1"
          : "ml-1 tooltip tooltip-bottom tooltip-primary tooltip-open font-bold before:left-auto before:transform-none before:content-[attr(data-tip)] before:-translate-x-2/5"
      }
      data-tip="Grab ETH & USDC from faucet"
    >
      <button className="btn btn-secondary btn-sm px-2 rounded-full" onClick={sendETHAndUSDC} disabled={loading}>
        {!loading ? (
          <BanknotesIcon className="h-4 w-4" />
        ) : (
          <span className="loading loading-spinner loading-xs"></span>
        )}
      </button>
    </div>
  );
};
