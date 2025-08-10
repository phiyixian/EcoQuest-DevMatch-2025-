"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { formatEther, formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import BadgesGrid from "~~/components/BadgesGrid";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerTxLink } from "~~/utils/scaffold-eth";

type SortKey = "time" | "amount" | "co2" | "message" | "type";
type TransactionType = "DONATION" | "NFT_COLLECTION" | "CELO_BRIDGE" | "ARBITRUM_BRIDGE" | "SWAP";

const ProfilePage = () => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  // Get donation events
  const { data: donationEvents, isLoading: isDonationsLoading } = useScaffoldEventHistory({
    contractName: "EcoQuestDonation",
    eventName: "DonationReceived",
    watch: true,
  });

  // Get Celo bridge events
  const { data: celoBridgeEvents, isLoading: isCeloBridgeLoading } = useScaffoldEventHistory({
    contractName: "CeloBridge",
    eventName: "BridgeInitiated",
    watch: true,
  });

  // Get Arbitrum bridge events (temporarily disabled until types refresh)
  // const { data: arbitrumBridgeEvents, isLoading: isArbitrumBridgeLoading } = useScaffoldEventHistory({
  //   contractName: "ArbitrumBridge",
  //   eventName: "BridgeInitiated",
  //   watch: true,
  // });
  const arbitrumBridgeEvents: any[] = [];
  const isArbitrumBridgeLoading = false;

  // Get swap events
  const { data: swapEvents, isLoading: isSwapLoading } = useScaffoldEventHistory({
    contractName: "ETHUSDCSwap",
    eventName: "ETHSwappedForUSDC",
    watch: true,
  });

  const isLoading = isDonationsLoading || isCeloBridgeLoading || isArbitrumBridgeLoading || isSwapLoading;

  const [sortBy, setSortBy] = useState<SortKey>("time");
  const [asc, setAsc] = useState(false);
  const [onlyMine, setOnlyMine] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minUSDC, setMinUSDC] = useState<string>("");
  const [maxUSDC, setMaxUSDC] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<TransactionType | "ALL">("ALL");

  const rows = useMemo(() => {
    const list: any[] = [];

    // Process donation events
    (donationEvents || []).forEach((ev: any) => {
      const args = (ev as any).args || {};
      const blockTime = (ev as any).blockData?.timestamp ? Number((ev as any).blockData?.timestamp) * 1000 : undefined;
      list.push({
        type: "DONATION" as TransactionType,
        donor: args.donor as string,
        amount: (args.amount as bigint) ?? 0n,
        co2: (args.co2Offset as bigint) ?? 0n,
        message: (args.message as string) || "",
        time: blockTime ?? Date.now(),
        txHash: (ev as any).transactionHash as string | undefined,
        description: `Donated ${formatUnits((args.amount as bigint) ?? 0n, 6)} USDC`,
      });
    });

    // Process Celo bridge events
    (celoBridgeEvents || []).forEach((ev: any) => {
      const args = (ev as any).args || {};
      const blockTime = (ev as any).blockData?.timestamp ? Number((ev as any).blockData?.timestamp) * 1000 : undefined;
      list.push({
        type: "CELO_BRIDGE" as TransactionType,
        donor: args.user as string,
        amount: (args.usdcAmount as bigint) ?? 0n,
        co2: 0n,
        message: `Bridge to Celo: ${args.celoRecipient || ""}`,
        time: blockTime ?? Date.now(),
        txHash: (ev as any).transactionHash as string | undefined,
        description: `Bridged ${formatUnits((args.usdcAmount as bigint) ?? 0n, 6)} USDC to Celo`,
      });
    });

    // Process Arbitrum bridge events
    (arbitrumBridgeEvents || []).forEach((ev: any) => {
      const args = (ev as any).args || {};
      const blockTime = (ev as any).blockData?.timestamp ? Number((ev as any).blockData?.timestamp) * 1000 : undefined;
      list.push({
        type: "ARBITRUM_BRIDGE" as TransactionType,
        donor: args.user as string,
        amount: (args.ethAmount as bigint) ?? 0n,
        co2: 0n,
        message: `Bridge to Arbitrum: ${args.arbitrumRecipient || ""}`,
        time: blockTime ?? Date.now(),
        txHash: (ev as any).transactionHash as string | undefined,
        description: `Bridged ${formatEther((args.ethAmount as bigint) ?? 0n)} ETH to Arbitrum`,
      });
    });

    // Process swap events
    (swapEvents || []).forEach((ev: any) => {
      const args = (ev as any).args || {};
      const blockTime = (ev as any).blockData?.timestamp ? Number((ev as any).blockData?.timestamp) * 1000 : undefined;
      list.push({
        type: "SWAP" as TransactionType,
        donor: args.user as string,
        amount: (args.usdcAmount as bigint) ?? 0n,
        co2: 0n,
        message: `Swapped ${formatEther((args.ethAmount as bigint) ?? 0n)} ETH for USDC`,
        time: blockTime ?? Date.now(),
        txHash: (ev as any).transactionHash as string | undefined,
        description: `Swapped ${formatEther((args.ethAmount as bigint) ?? 0n)} ETH for ${formatUnits((args.usdcAmount as bigint) ?? 0n, 6)} USDC`,
      });
    });

    // Add NFT collection transactions from localStorage
    if (typeof window !== "undefined" && address) {
      const stored = localStorage.getItem(`ecoquest-nfts-${address}`);
      if (stored) {
        try {
          const nfts = JSON.parse(stored);
          nfts.forEach((nft: any, index: number) => {
            list.push({
              type: "NFT_COLLECTION" as TransactionType,
              donor: address,
              amount: 0n,
              co2: 0n,
              message: `Collected ${nft.name} (${nft.rarity})`,
              time: nft.timestamp || Date.now() - (nfts.length - index) * 60000, // Estimated time
              txHash: undefined,
              description: `Collected NFT: ${nft.name} (${nft.rarity})`,
            });
          });
        } catch (error) {
          console.error("Error loading NFT history:", error);
        }
      }
    }

    const cmp = (a: any, b: any) => {
      const dir = asc ? 1 : -1;
      switch (sortBy) {
        case "amount":
          return a.amount === b.amount ? 0 : a.amount > b.amount ? dir : -dir;
        case "co2":
          return a.co2 === b.co2 ? 0 : a.co2 > b.co2 ? dir : -dir;
        case "message":
          return dir * String(a.message).localeCompare(String(b.message));
        case "type":
          return dir * String(a.type).localeCompare(String(b.type));
        case "time":
        default:
          return a.time === b.time ? 0 : a.time > b.time ? dir : -dir;
      }
    };
    return list.sort(cmp);
  }, [donationEvents, celoBridgeEvents, arbitrumBridgeEvents, swapEvents, sortBy, asc, address]);

  // Apply filters
  const filteredRows = useMemo(() => {
    const min = minUSDC ? parseUnits(minUSDC, 6) : undefined;
    const max = maxUSDC ? parseUnits(maxUSDC, 6) : undefined;
    const start = startDate ? new Date(startDate).getTime() : undefined;
    const end = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : undefined;
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (onlyMine && address && r.donor?.toLowerCase() !== address.toLowerCase()) return false;
      if (transactionTypeFilter !== "ALL" && r.type !== transactionTypeFilter) return false;
      if (start !== undefined && r.time < start) return false;
      if (end !== undefined && r.time > end) return false;
      if (min !== undefined && r.amount < min) return false;
      if (max !== undefined && r.amount > max) return false;
      if (q && !(r.message || "").toLowerCase().includes(q) && !(r.description || "").toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [rows, onlyMine, transactionTypeFilter, startDate, endDate, minUSDC, maxUSDC, query, address]);

  const myTotals = useMemo(() => {
    let usdc: bigint = 0n;
    let co2: bigint = 0n;
    rows.forEach(r => {
      if (!address || r.donor?.toLowerCase() !== address.toLowerCase()) return;
      usdc += r.amount;
      co2 += r.co2;
    });
    return { usdc, co2 };
  }, [rows, address]);

  const exportPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      await import("jspdf-autotable");

      const doc = new jsPDF();

      // Add title and user info
      doc.setFontSize(16);
      doc.text("EcoQuest Carbon Offset Report", 14, 20);

      doc.setFontSize(12);
      doc.text(`User: ${address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Anonymous"}`, 14, 30);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);
      doc.text(`Total USDC Donated: ${formatUnits(myTotals.usdc, 6)} USDC`, 14, 50);
      doc.text(`Total CO₂ Offset: ${formatEther(myTotals.co2)} kg`, 14, 60);

      // Add table using autoTable
      (doc as any).autoTable({
        head: [["Date", "Donor", "USDC", "CO₂ (kg)", "Message"]],
        body: filteredRows.map(r => [
          new Date(r.time).toLocaleDateString(),
          r.donor ? `${r.donor.slice(0, 6)}...${r.donor.slice(-4)}` : "-",
          formatUnits(r.amount, 6),
          formatEther(r.co2),
          (r.message || "-").substring(0, 50) + (r.message && r.message.length > 50 ? "..." : ""),
        ]),
        startY: 75,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { top: 75, right: 14, bottom: 20, left: 14 },
      });

      // Add footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`EcoQuest - Carbon Offset Platform | Page ${pageCount}`, 14, doc.internal.pageSize.height - 10);

      doc.save(`ecoquest-report-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14">
              <Image
                src="https://media.istockphoto.com/id/2165994073/vector/white-coffee-mug-with-heart-shaped-latte-art.jpg?s=612x612&w=0&k=20&c=E5Xwr2R6M7hLGetGGshkEvqkItDBgMcs_QN6WXrryeE="
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-800">cappuccino</h1>
              <p className="text-sm text-gray-600">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
              </p>
            </div>
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            onClick={exportPdf}
            disabled={!filteredRows.length}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export PDF Report
          </button>
        </div>

        {/* Badges (NFTs) */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-800">Your Badges</h2>
            <a href="/ecoquest/gallery" className="link">
              View gallery →
            </a>
          </div>
          <BadgesGrid address={address ? (address as `0x${string}`) : undefined} />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Donations</div>
            <div className="text-2xl font-semibold text-green-700">{formatUnits(myTotals.usdc, 6)} USDC</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">CO₂ Offset</div>
            <div className="text-2xl font-semibold text-blue-700">{formatEther(myTotals.co2)} kg</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Transactions</div>
            <div className="text-2xl font-semibold text-purple-700">{filteredRows.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">NFTs Collected</div>
            <div className="text-2xl font-semibold text-orange-700">
              {filteredRows.filter(r => r.type === "NFT_COLLECTION").length}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="select select-sm" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
            <option value="time">Time</option>
            <option value="type">Type</option>
            <option value="amount">USDC</option>
            <option value="co2">CO₂</option>
            <option value="message">Message</option>
          </select>

          <span className="text-sm text-gray-600">Type:</span>
          <select
            className="select select-sm"
            value={transactionTypeFilter}
            onChange={e => setTransactionTypeFilter(e.target.value as TransactionType | "ALL")}
          >
            <option value="ALL">All Types</option>
            <option value="DONATION">Donations</option>
            <option value="NFT_COLLECTION">NFT Collections</option>
            <option value="CELO_BRIDGE">Celo Bridge</option>
            <option value="ARBITRUM_BRIDGE">Arbitrum Bridge</option>
            <option value="SWAP">Swaps</option>
          </select>
          <label className="cursor-pointer label gap-2">
            <span className="text-sm">Ascending</span>
            <input
              type="checkbox"
              className="toggle toggle-sm"
              checked={asc}
              onChange={e => setAsc(e.target.checked)}
            />
          </label>

          <div className="divider divider-horizontal" />

          <label className="text-sm">
            Only my donations
            <input
              type="checkbox"
              className="toggle toggle-sm ml-2"
              checked={onlyMine}
              onChange={e => setOnlyMine(e.target.checked)}
            />
          </label>

          <input
            type="date"
            className="input input-sm input-bordered"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <span className="text-sm">to</span>
          <input
            type="date"
            className="input input-sm input-bordered"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />

          <input
            type="number"
            step="0.000001"
            placeholder="Min USDC"
            className="input input-sm input-bordered w-32"
            value={minUSDC}
            onChange={e => setMinUSDC(e.target.value)}
          />
          <input
            type="number"
            step="0.000001"
            placeholder="Max USDC"
            className="input input-sm input-bordered w-32"
            value={maxUSDC}
            onChange={e => setMaxUSDC(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search message"
            className="input input-sm input-bordered w-48"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>User</th>
                <th>USDC</th>
                <th>CO₂ (kg)</th>
                <th>Description</th>
                <th>Tx</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    Loading history...
                  </td>
                </tr>
              ) : filteredRows.length ? (
                filteredRows.map((r, i) => {
                  const getTypeColor = (type: TransactionType) => {
                    switch (type) {
                      case "DONATION":
                        return "badge-success";
                      case "NFT_COLLECTION":
                        return "badge-primary";
                      case "CELO_BRIDGE":
                        return "badge-warning";
                      case "ARBITRUM_BRIDGE":
                        return "badge-error";
                      case "SWAP":
                        return "badge-info";
                      default:
                        return "badge-ghost";
                    }
                  };

                  return (
                    <tr key={i}>
                      <td>{new Date(r.time).toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-sm ${getTypeColor(r.type)}`}>{r.type.replace("_", " ")}</span>
                      </td>
                      <td>{r.donor ? `${r.donor.slice(0, 6)}...${r.donor.slice(-4)}` : "-"}</td>
                      <td>{r.amount > 0n ? formatUnits(r.amount, 6) : "-"}</td>
                      <td>{r.co2 > 0n ? formatEther(r.co2) : "-"}</td>
                      <td className="max-w-[20rem] truncate" title={r.description || r.message}>
                        {r.description || r.message || "-"}
                      </td>
                      <td>
                        {r.txHash ? (
                          <div className="flex gap-2">
                            <a
                              className="link text-blue-600 hover:text-blue-800"
                              href={`/blockexplorer/transaction/${r.txHash}`}
                              title="View in internal explorer"
                            >
                              Internal
                            </a>
                            <span className="text-gray-400">|</span>
                            <a
                              className="link text-green-600 hover:text-green-800"
                              href={getBlockExplorerTxLink(targetNetwork.id, r.txHash) || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View on Etherscan/Block Explorer"
                            >
                              External ↗
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">No Tx</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <a href="/ecoquest" className="btn">
            ← Back to EcoQuest
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
