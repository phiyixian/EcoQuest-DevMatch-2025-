"use client";

import { useState } from "react";
import { createWalletClient, http, parseEther, parseUnits, encodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

// Number of ETH faucet sends to an address
const NUM_OF_ETH = "1";
const NUM_OF_USDC = "10"; // 10 USDC
const FAUCET_PRIVATE_KEY =
  (process.env.NEXT_PUBLIC_LOCAL_FAUCET_PK as `0x${string}` | undefined) ||
  ("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as const); // hardhat account[0]
const FAUCET_ACCOUNT = privateKeyToAccount(FAUCET_PRIVATE_KEY);

const localWalletClient = createWalletClient({
  chain: hardhat,
  account: FAUCET_ACCOUNT,
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
      console.log("Faucet address:", FAUCET_ACCOUNT.address);
      
      // Send ETH
      await faucetTxn({
        account: FAUCET_ACCOUNT.address,
        to: address,
        value: parseEther(NUM_OF_ETH),
      });

      // Send USDC (transfer from faucet address to user)
      await faucetTxn({
        account: FAUCET_ACCOUNT.address,
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
