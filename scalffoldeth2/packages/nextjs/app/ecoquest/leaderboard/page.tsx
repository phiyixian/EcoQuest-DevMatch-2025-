"use client";

import { useMemo } from "react";
import { formatEther, formatUnits, parseEther, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

type LeaderboardRow = {
  address: string;
  totalDonated: bigint; // USDC 6 decimals
  co2Offset: bigint; // in wei-like units (using formatEther for kg)
  donationCount: number;
};

export default function LeaderboardPage() {
  const { address } = useAccount();

  // Contract refs for global stats
  // const { data: donationContract } = useDeployedContractInfo("EcoQuestDonation");
  // const { data: totalDonations } = useContractRead({
  //   address: donationContract?.address,
  //   abi: donationContract?.abi,
  //   functionName: "totalDonations",
  //   watch: true,
  // });
  // const { data: totalCO2Offset } = useContractRead({
  //   address: donationContract?.address,
  //   abi: donationContract?.abi,
  //   functionName: "totalCO2Offset",
  //   watch: true,
  // });

  // Aggregate leaderboard from DonationReceived events
  const { data: donationEvents, isLoading } = useScaffoldEventHistory({
    contractName: "EcoQuestDonation",
    eventName: "DonationReceived",
    watch: true,
  });

  const leaderboardData = useMemo<LeaderboardRow[]>(() => {
    const stats = new Map<string, LeaderboardRow>();

    donationEvents?.forEach((ev: any) => {
      const donor = (ev as any)?.args?.donor as string | undefined;
      const amount = ((ev as any)?.args?.amount as bigint) ?? 0n;
      const co2 = ((ev as any)?.args?.co2Offset as bigint) ?? 0n;
      if (!donor) return;
      const current = stats.get(donor) ?? { address: donor, totalDonated: 0n, co2Offset: 0n, donationCount: 0 };
      current.totalDonated += amount;
      current.co2Offset += co2;
      current.donationCount += 1;
      stats.set(donor, current);
    });

    // Inject 4 comparator (fake) profiles so ranks visibly shift vs. burner wallet
    const fakeProfiles: Array<{ address: string; usdc: string; donations: number }> = [
      { address: "0x1111111111111111111111111111111111111111", usdc: "150.00", donations: 5 },
      { address: "0x2222222222222222222222222222222222222222", usdc: "80.00", donations: 3 },
      { address: "0x3333333333333333333333333333333333333333", usdc: "12.50", donations: 2 },
      { address: "0x4444444444444444444444444444444444444444", usdc: "0.75", donations: 1 },
    ];
    for (const fp of fakeProfiles) {
      if (!stats.has(fp.address)) {
        const donated = parseUnits(fp.usdc, 6);
        const co2 = parseEther((parseFloat(fp.usdc) * 10).toString());
        stats.set(fp.address, {
          address: fp.address,
          totalDonated: donated,
          co2Offset: co2,
          donationCount: fp.donations,
        });
      }
    }

    // Ensure the current burner/external wallet appears even if 0 donations
    if (address && !stats.has(address)) {
      stats.set(address, { address, totalDonated: 0n, co2Offset: 0n, donationCount: 0 });
    }

    const rows = Array.from(stats.values());
    // Sort by totalDonated desc
    rows.sort((a, b) => (a.totalDonated === b.totalDonated ? 0 : a.totalDonated > b.totalDonated ? -1 : 1));
    return rows;
  }, [donationEvents, address]);

  // Totals computed from all entries shown in the leaderboard (includes comparators and burner wallet)
  const computedTotals = useMemo(() => {
    let totalDonatedAll: bigint = 0n;
    let totalCo2All: bigint = 0n;
    for (const row of leaderboardData) {
      totalDonatedAll += row.totalDonated;
      totalCo2All += row.co2Offset;
    }
    return { totalDonatedAll, totalCo2All };
  }, [leaderboardData]);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🏆 EcoQuest Leaderboard</h1>
          <p className="text-lg text-gray-600">Top Carbon Offset Contributors</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Community Impact</h3>
            <p className="text-3xl font-bold text-green-600">{formatEther(computedTotals.totalCo2All)} kg CO₂</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-blue-600">{formatUnits(computedTotals.totalDonatedAll, 6)} USDC</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Contributors</h3>
            <p className="text-3xl font-bold text-purple-600">{leaderboardData.length}</p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Contributors</h2>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    index < 3
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getRankBadge(index + 1)}</div>
                    <div className="text-3xl">🌱</div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user.address.slice(0, 6)}...{user.address.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-600">{user.donationCount} donations</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{formatUnits(user.totalDonated, 6)} USDC</p>
                    <p className="text-sm text-gray-600">{formatEther(user.co2Offset)} kg CO₂ offset</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How to climb the leaderboard */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🚀 How to Climb the Leaderboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">💚</div>
              <h4 className="font-semibold text-gray-800 mb-2">Make Donations</h4>
              <p className="text-sm text-gray-600">Donate USDC to offset carbon and earn points</p>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🎮</div>
              <h4 className="font-semibold text-gray-800 mb-2">Play EcoQuest</h4>
              <p className="text-sm text-gray-600">Discover rare flora and fauna for bonus points</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🏆</div>
              <h4 className="font-semibold text-gray-800 mb-2">Earn NFTs</h4>
              <p className="text-sm text-gray-600">Complete quests to mint exclusive EcoProof NFTs</p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <a
            href="/ecoquest"
            className="inline-block bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
