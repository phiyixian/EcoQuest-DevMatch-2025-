"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { formatEther, formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import BadgesGrid from "~~/components/BadgesGrid";

type SortKey = "time" | "amount" | "co2" | "message";

const ProfilePage = () => {
  const { address } = useAccount();
  const { data: events, isLoading } = useScaffoldEventHistory({
    contractName: "EcoQuestDonation",
    eventName: "DonationReceived",
    watch: true,
    // No filters: show all history; users can sort/filter client-side
  });

  const [sortBy, setSortBy] = useState<SortKey>("time");
  const [asc, setAsc] = useState(false);
  const [onlyMine, setOnlyMine] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minUSDC, setMinUSDC] = useState<string>("");
  const [maxUSDC, setMaxUSDC] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const rows = useMemo(() => {
    const list = (events || []).map((ev: any) => {
      const args = (ev as any).args || {};
      const blockTime = (ev as any).blockData?.timestamp
        ? Number((ev as any).blockData?.timestamp) * 1000
        : undefined;
      return {
        donor: args.donor as string,
        amount: (args.amount as bigint) ?? 0n,
        co2: (args.co2Offset as bigint) ?? 0n,
        message: (args.message as string) || "",
        time: blockTime ?? Date.now(),
        txHash: (ev as any).transactionHash as string | undefined,
      };
    });

    const cmp = (a: any, b: any) => {
      const dir = asc ? 1 : -1;
      switch (sortBy) {
        case "amount":
          return a.amount === b.amount ? 0 : a.amount > b.amount ? dir : -dir;
        case "co2":
          return a.co2 === b.co2 ? 0 : a.co2 > b.co2 ? dir : -dir;
        case "message":
          return dir * String(a.message).localeCompare(String(b.message));
        case "time":
        default:
          return a.time === b.time ? 0 : a.time > b.time ? dir : -dir;
      }
    };
    return list.sort(cmp);
  }, [events, sortBy, asc]);

  // Apply filters
  const filteredRows = useMemo(() => {
    const min = minUSDC ? parseUnits(minUSDC, 6) : undefined;
    const max = maxUSDC ? parseUnits(maxUSDC, 6) : undefined;
    const start = startDate ? new Date(startDate).getTime() : undefined;
    const end = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : undefined;
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (onlyMine && address && r.donor?.toLowerCase() !== address.toLowerCase()) return false;
      if (start !== undefined && r.time < start) return false;
      if (end !== undefined && r.time > end) return false;
      if (min !== undefined && r.amount < min) return false;
      if (max !== undefined && r.amount > max) return false;
      if (q && !(r.message || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, onlyMine, startDate, endDate, minUSDC, maxUSDC, query, address]);

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
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default as any;
    const doc = new jsPDF();
    doc.text("EcoQuest Donation History", 14, 14);
    (autoTable as any)(doc, {
      head: [["Date", "Donor", "USDC", "CO2 (kg)", "Message"]],
      body: filteredRows.map(r => [
        new Date(r.time).toLocaleString(),
        r.donor,
        formatUnits(r.amount, 6),
        formatEther(r.co2),
        r.message || "-",
      ]),
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] },
    });
    doc.save("ecoquest-donations.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14">
              <Image src="https://media.istockphoto.com/id/2165994073/vector/white-coffee-mug-with-heart-shaped-latte-art.jpg?s=612x612&w=0&k=20&c=E5Xwr2R6M7hLGetGGshkEvqkItDBgMcs_QN6WXrryeE=" alt="Profile" fill className="rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-800">cappuccino</h1>
              <p className="text-sm text-gray-600">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={exportPdf} disabled={!rows.length}>
            Export to PDF
          </button>
        </div>

        {/* Badges (NFTs) */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-800">Your Badges</h2>
            <a href="/ecoquest/gallery" className="link">View gallery →</a>
          </div>
          <BadgesGrid address={address ? (address as `0x${string}`) : undefined} />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Your total donations</div>
            <div className="text-2xl font-semibold text-green-700">{formatUnits(myTotals.usdc, 6)} USDC</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Your CO₂ offset</div>
            <div className="text-2xl font-semibold text-blue-700">{formatEther(myTotals.co2)} kg</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total donations</div>
            <div className="text-2xl font-semibold">{filteredRows.length}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="select select-sm" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
            <option value="time">Time</option>
            <option value="amount">USDC</option>
            <option value="co2">CO₂</option>
            <option value="message">Message</option>
          </select>
          <label className="cursor-pointer label gap-2">
            <span className="text-sm">Ascending</span>
            <input type="checkbox" className="toggle toggle-sm" checked={asc} onChange={e => setAsc(e.target.checked)} />
          </label>

          <div className="divider divider-horizontal" />

          <label className="text-sm">Only my donations
            <input type="checkbox" className="toggle toggle-sm ml-2" checked={onlyMine} onChange={e => setOnlyMine(e.target.checked)} />
          </label>

          <input type="date" className="input input-sm input-bordered" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <span className="text-sm">to</span>
          <input type="date" className="input input-sm input-bordered" value={endDate} onChange={e => setEndDate(e.target.value)} />

          <input type="number" step="0.000001" placeholder="Min USDC" className="input input-sm input-bordered w-32" value={minUSDC} onChange={e => setMinUSDC(e.target.value)} />
          <input type="number" step="0.000001" placeholder="Max USDC" className="input input-sm input-bordered w-32" value={maxUSDC} onChange={e => setMaxUSDC(e.target.value)} />

          <input type="text" placeholder="Search message" className="input input-sm input-bordered w-48" value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Donor</th>
                <th>USDC</th>
                <th>CO₂ (kg)</th>
                <th>Message</th>
                <th>Tx</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Loading history...
                  </td>
                </tr>
              ) : filteredRows.length ? (
                filteredRows.map((r, i) => (
                  <tr key={i}>
                    <td>{new Date(r.time).toLocaleString()}</td>
                    <td>{r.donor ? `${r.donor.slice(0, 6)}...${r.donor.slice(-4)}` : "-"}</td>
                    <td>{formatUnits(r.amount, 6)}</td>
                    <td>{formatEther(r.co2)}</td>
                    <td className="max-w-[20rem] truncate" title={r.message}>{r.message || "-"}</td>
                    <td>
                      {r.txHash ? (
                        <a className="link" href={`/blockexplorer/transaction/${r.txHash}`}>View</a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No donations match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <a href="/ecoquest" className="btn">← Back to EcoQuest</a>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


