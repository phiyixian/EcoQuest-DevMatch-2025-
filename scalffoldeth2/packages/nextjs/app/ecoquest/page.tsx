"use client";

import { useMemo, useState, useEffect } from "react";
import { formatEther, formatUnits, parseEther, parseUnits, createWalletClient, http, encodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { useAccount, useBalance } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useSearchParams } from "next/navigation";
import { notification } from "~~/utils/scaffold-eth";
import { getCurrentUserEmail } from "~~/services/auth/firebase";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";

export default function EcoQuestDashboard() {
  // Use burner wallet (automatically managed by Scaffold-ETH)
  const { address, isConnected } = useAccount();
  
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [isDonating, setIsDonating] = useState(false);

  const searchParams = useSearchParams();

  // Get contract info for donation contract address
  const { data: ecoQuestContract } = useDeployedContractInfo({
  contractName: "EcoQuestDonation",
});

  // Get USDC contract info
  const { data: usdcContract } = useDeployedContractInfo({
    contractName: "MockUSDC",
  });

  // Contract read hooks - Using explicit typing to bypass TypeScript issues
  // Aggregate totals from all visible contributors (same as leaderboard logic)
  const { data: donationEvents } = useScaffoldEventHistory({
    contractName: "EcoQuestDonation",
    eventName: "DonationReceived",
    watch: true,
  });

  const { data: userStatsRaw } = (useScaffoldReadContract as any)({
    contractName: "EcoQuestDonation",
    functionName: "getUserStats",
    args: [address],
  });
  type UserStatsResult = {
    totalDonated: bigint;
    totalCO2Offset: bigint;
    donationCount: bigint;
  };
  const userStats = userStatsRaw as UserStatsResult | undefined;

  // Compute community totals by summing all events and including comparator profiles
  const computedTotals = useMemo(() => {
    let donated: bigint = 0n;
    let co2: bigint = 0n;

    donationEvents?.forEach((ev: any) => {
      donated += ((ev as any)?.args?.amount as bigint) ?? 0n;
      co2 += ((ev as any)?.args?.co2Offset as bigint) ?? 0n;
    });

    // Include the same 4 comparator entries used in leaderboard
    const fake = ["150.00", "80.00", "12.50", "0.75"]; // USDC amounts
    for (const u of fake) {
      donated += parseUnits(u, 6);
      co2 += parseEther((parseFloat(u) * 10).toString());
    }

    return { donated, co2 };
  }, [donationEvents]);

  // USDC balance using wagmi
  const { data: usdcBalance } = useBalance({
    address,
    token: usdcContract?.address,
    query: { refetchInterval: 5000 },
  });

  // Contract write hooks - Using explicit typing to bypass TypeScript issues
  const { writeContractAsync: writeUSDC } = (useScaffoldWriteContract as any)({
    contractName: "MockUSDC",
  });
  const { writeContractAsync: writeEcoQuest } = (useScaffoldWriteContract as any)({
    contractName: "EcoQuestDonation",
  });

  // Auto-fill from Chrome Extension query params
  useEffect(() => {
    const amountParam = searchParams.get("donation");
    const msgParam = searchParams.get("message");
    const autoDonate = searchParams.get("autoDonate");

    // Only prefill if this is explicitly requested by the extension and wallet is connected
    if (autoDonate === "true" && isConnected) {
      if (amountParam && !isNaN(parseFloat(amountParam)) && parseFloat(amountParam) > 0) {
        setDonationAmount(amountParam);
      } else {
        setDonationAmount("");
      }
      if (msgParam) {
        setDonationMessage(decodeURIComponent(msgParam));
      } else {
        setDonationMessage("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isConnected]);

  // Handle donation using Scaffold-ETH hooks
  const handleDonate = async () => {
    if (!donationAmount || !address) return;
    try {
      setIsDonating(true);
      const amount = parseUnits(donationAmount, 6); // USDC has 6 decimals
      // Calculate CO2 offset (frontend logic: 1 USDC = 10 kg CO2)
      const co2Offset = parseEther((parseFloat(donationAmount) * 10).toString());

      // 1️⃣ Approve USDC using Scaffold hook
      await writeUSDC({
  functionName: "approve",
  args: [ecoQuestContract?.address, amount], // Use the contract address from deployedContracts
});

      // 2️⃣ Call offset using Scaffold hook
      const tx = await writeEcoQuest({
        functionName: "offset",
        args: [amount, co2Offset, donationMessage],
      });

      notification.success("Offset successful! Thank you for offsetting carbon!");
      // Fire-and-forget: generate simple HTML and POST to API route to send email
      try {
        let to = (typeof window !== "undefined" && localStorage.getItem("ecoquest_user_email")) || "";
        if (!to) {
          const email = getCurrentUserEmail();
          if (email) to = email;
        }
        if (to) {
          const html = `
            <h2>EcoQuest Donation Receipt</h2>
            <p>Thank you for your contribution to offset carbon.</p>
            <ul>
              <li>Amount: ${formatUnits(amount, 6)} USDC</li>
              <li>Estimated CO₂ offset: ${formatEther(co2Offset)} kg</li>
              <li>Message: ${donationMessage || "-"}</li>
            </ul>
            <p>Tx Hash: ${String(tx)}</p>
          `;
          // Generate a richer PDF receipt
          let pdfBase64 = "";
          try {
            const { jsPDF } = await import("jspdf");
            const autoTable = (await import("jspdf-autotable")).default as any;
            const doc = new jsPDF({ unit: "pt" });

            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 40;
            const now = new Date();
            const amountStr = `${formatUnits(amount, 6)} USDC`;
            const co2Str = `${formatEther(co2Offset)} kg`;
            const txHash = String(tx);
            const txLink = `/blockexplorer/transaction/${txHash}`;

            // Header
            doc.setFontSize(18);
            doc.text("EcoQuest Donation Receipt", margin, 60);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Date: ${now.toLocaleString()}`, margin, 80);
            if (address) doc.text(`Wallet: ${address}`, margin, 96);
            if (to) doc.text(`Recipient: ${to}`, margin, 112);

            // Details table
            (autoTable as any)(doc, {
              startY: 130,
              head: [["Field", "Value"]],
              body: [
                ["Amount", amountStr],
                ["Estimated CO₂ offset", co2Str],
                ["Message", donationMessage || "-"],
                ["Transaction Hash", txHash],
                ["Explorer Link", txLink],
              ],
              styles: { fontSize: 10, cellPadding: 6 },
              headStyles: { fillColor: [34, 197, 94] },
              columnStyles: { 0: { cellWidth: 160 } },
              margin: { left: margin, right: margin },
            });

            // Footer
            const footerY = doc.internal.pageSize.getHeight() - 40;
            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(
              "Thanks for supporting public goods and carbon offset! This receipt is generated by EcoQuest.",
              margin,
              footerY,
            );
            pdfBase64 = doc.output("datauristring").split(",")[1] || "";
          } catch {}
          fetch("/api/send-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to, html, pdfBase64 }),
          }).catch(() => {});
        }
      } catch {}
      setDonationAmount("");
      setDonationMessage("");
    } catch (error) {
      console.error("Offset error:", error);
      notification.error("Offset failed. Please try again.");
    } finally {
      setIsDonating(false);
    }
  };

  // Calculate CO2 offset for display
  const calculateCO2Offset = (usdcAmount: string) => {
    const amount = parseFloat(usdcAmount) || 0;
    return (amount * 10).toFixed(2); // 1 USDC = 10 kg CO2
  };

  // Ensure a smooth start: if burner has 0 USDC, auto-fund from local faucet account (Hardhat account[0])
  useEffect(() => {
    (async () => {
      if (!isConnected || !address || !usdcBalance || usdcBalance.value > 0n || !usdcContract) return;
      try {
        const faucetPk =
          (process.env.NEXT_PUBLIC_LOCAL_FAUCET_PK as `0x${string}` | undefined) ||
          ("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as const);
        const account = privateKeyToAccount(faucetPk);
        const wc = createWalletClient({ chain: hardhat, account, transport: http() });
        // 1 ETH to cover gas
        await wc.sendTransaction({ to: address as `0x${string}` | undefined, value: parseEther("1") });
        // 10 USDC transfer
        await wc.sendTransaction({
          to: usdcContract.address,
          data: encodeFunctionData({
            abi: usdcContract.abi,
            functionName: "transfer",
            args: [address, parseUnits("10", 6)],
          }),
        });
        notification.info("Auto-funded burner with 1 ETH and 10 USDC.");
      } catch (e) {
        console.error("auto-faucet failed", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, usdcBalance?.value, usdcContract?.address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 EcoQuest</h1>
          <p className="text-lg text-gray-600">Play, Track, and Offset Your Carbon Impact</p>
        </div>

        {/* Wallet Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Burner Wallet Status</h2>
          <div className="space-y-2">
            <p className="text-green-600">
              ✅ Using Burner Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <p className="text-gray-600">
              USDC Balance: {usdcBalance ? formatUnits(usdcBalance.value, 6) : "0"} USDC
            </p>
            <p className="text-sm text-blue-600">
              💡 This is an automatically generated burner wallet (no external wallet needed)
            </p>
          </div>
        </div>

        {/* Impact Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Donations */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-green-600">{formatUnits(computedTotals.donated, 6)} USDC</p>
          </div>

          {/* Total CO2 Offset */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">CO₂ Offset</h3>
            <p className="text-3xl font-bold text-blue-600">{formatEther(computedTotals.co2)} kg</p>
          </div>

          {/* User Impact */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Impact</h3>
            <p className="text-3xl font-bold text-purple-600">{formatEther(userStats?.totalCO2Offset ?? 0n)} kg</p>
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Make a Donation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">USDC Amount</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.000001"
                min="0"
                autoComplete="off"
                value={donationAmount}
                onChange={e => setDonationAmount(e.target.value)}
                onWheel={e => (e.currentTarget as HTMLInputElement).blur()}
                onKeyDown={e => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                suppressHydrationWarning
              />
              {donationAmount && (
                <p className="text-sm text-gray-600 mt-1">
                  This will offset {calculateCO2Offset(donationAmount)} kg of CO₂
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
              <textarea
                value={donationMessage}
                onChange={e => setDonationMessage(e.target.value)}
                placeholder="Leave a message with your donation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                suppressHydrationWarning
              />
            </div>

            <button
              onClick={handleDonate}
              disabled={!donationAmount || isDonating}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isDonating ? "Processing..." : "Donate & Offset Carbon"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
