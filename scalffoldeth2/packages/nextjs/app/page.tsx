"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">🌱 EcoQuest</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg">
            Play, Track, and Offset Your Carbon Impact with Web3
          </p>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <div className="text-4xl mb-4">🌱</div>
              <p>
                Start your eco-journey with{" "}
                <Link href="/ecoquest" passHref className="link">
                  EcoQuest Dashboard
                </Link>{" "}
                to donate and offset carbon.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <div className="text-4xl mb-4">🏆</div>
              <p>
                View the{" "}
                <Link href="/ecoquest/leaderboard" passHref className="link">
                  Leaderboard
                </Link>{" "}
                to see top contributors and their impact.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <div className="text-4xl mb-4">🎨</div>
              <p>
                Check your{" "}
                <Link href="/ecoquest/gallery" passHref className="link">
                  NFT Gallery
                </Link>{" "}
                to see your earned EcoProof tokens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
