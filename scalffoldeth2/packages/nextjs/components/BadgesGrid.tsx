"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

type Props = { address?: `0x${string}` };

const BadgeCard = ({ tokenId, imageURI, title, description }: { tokenId: bigint; imageURI?: string; title: string; description: string }) => {
  return (
    <div className="rounded-xl border bg-base-100 p-3 shadow-sm hover:shadow transition">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-base-200">
        {imageURI ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageURI} alt={title} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-4xl">🏅</div>
        )}
      </div>
      <div className="mt-2">
        <div className="text-sm font-semibold">{title} #{String(tokenId)}</div>
        <div className="text-xs text-gray-600 line-clamp-2">{description}</div>
      </div>
    </div>
  );
};

export const BadgesGrid = ({ address }: Props) => {
  // Prefer direct owner index if available
  const { data: owned } = useScaffoldReadContract({
    contractName: "EcoQuestNFT",
    functionName: "getNFTsByOwner",
    args: address ? [address] : undefined,
  }) as { data: bigint[] | undefined };

  const ownedIds = useMemo(() => (owned && owned.length ? owned.slice(0, 5) : []), [owned]);

  const placeholders = useMemo(() => {
    const emojis = ["🌱", "🌿", "🌳", "🍃", "🌎", "🌊", "🌸", "🐝"];
    const needed = Math.max(0, 5 - ownedIds.length);
    return Array.from({ length: needed }, (_, i) => emojis[i % emojis.length]);
  }, [ownedIds.length]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {ownedIds.map(id => (
        <BadgeResolver key={String(id)} tokenId={id} ownerFilter={address} />
      ))}
      {placeholders.map((emoji, i) => (
        <div key={`ph-${i}`} className="rounded-xl border bg-base-100 p-3 shadow-sm flex flex-col items-center justify-center">
          <div className="text-5xl">{emoji}</div>
          <div className="mt-2 text-sm font-semibold">EcoProof</div>
          <div className="text-xs text-gray-600">Collect impact badges</div>
        </div>
      ))}
    </div>
  );
};

const OwnedBadges = ({ tokenIds, ownerFilter }: { tokenIds: bigint[]; ownerFilter?: `0x${string}` }) => {
  const items = tokenIds.map(id => <BadgeResolver key={String(id)} tokenId={id} ownerFilter={ownerFilter} />);
  // limit to first 5 non-null results
  const filtered = items.filter(Boolean).slice(0, 5);
  return <>{filtered}</>;
};

const BadgeResolver = ({ tokenId, ownerFilter }: { tokenId: bigint; ownerFilter?: `0x${string}` }) => {
  const { data } = useScaffoldReadContract({
    contractName: "EcoQuestNFT",
    functionName: "getNFTMetadata",
    args: [tokenId],
  }) as { data: any };

  const { data: owner } = useScaffoldReadContract({
    contractName: "EcoQuestNFT",
    functionName: "ownerOf",
    args: [tokenId],
  }) as { data: `0x${string}` | undefined };

  if (ownerFilter && owner && owner.toLowerCase() !== ownerFilter.toLowerCase()) {
    return null;
  }

  const title = useMemo(() => {
    if (!data) return "EcoProof";
    const typeName = ["Unknown", "Bronze", "Silver", "Gold", "Rare"][Number(data.nftType) || 0] || "Badge";
    return `${typeName}`;
  }, [data]);

  return (
    <BadgeCard
      tokenId={tokenId}
      imageURI={data?.imageURI}
      title={title}
      description={data?.description || "Impact badge"}
    />
  );
};

export default BadgesGrid;


