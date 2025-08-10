"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const WalletSignInButton = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  if (isConnected) return null;

  return (
    <button className="btn btn-sm ml-2" onClick={() => openConnectModal?.()} aria-label="Sign in via wallet">
      Sign in via Wallet
    </button>
  );
};

export default WalletSignInButton;
