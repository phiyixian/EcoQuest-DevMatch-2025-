"use client";

import React, { useEffect, useRef, useState } from "react";

export default function EcoQuestGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [collectedNFTs, setCollectedNFTs] = useState<
    Array<{ id: number; name: string; image: string }>
  >([]);

  useEffect(() => {
    (window as any).addCollectedNFT = (nft: { id: number; name: string; image: string }) => {
      setCollectedNFTs((prev) => {
        if (prev.find((item) => item.id === nft.id)) return prev;
        return [...prev, nft];
      });
    };
  }, []);

  useEffect(() => {
    const scriptSources = [
      "/ecoquest/js/interactableObjects.js",
      "/ecoquest/js/tab.js",
      "/ecoquest/js/quest.js",
      "/ecoquest/js/collisions.js",
      "/ecoquest/js/objects.js",
      "/ecoquest/js/class.js",
      "/ecoquest/index.js",
    ];

    async function loadScriptsSequentially() {
      for (const src of scriptSources) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = false;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script ${src}`));
          document.body.appendChild(script);
        });
      }
    }

    loadScriptsSequentially().catch(console.error);

    return () => {
      scriptSources.forEach((src) => {
        document.querySelectorAll(`script[src="${src}"]`).forEach((el) => el.remove());
      });
    };
  }, []);

  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        padding: "20px",
        boxSizing: "border-box",
        gap: "20px",
        overflow: "hidden", // prevent main scroll, scroll inside panels instead
      }}
    >
      {/* Left: Game Section */}
      <section
        style={{
          flex: "1 1 600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#111",
          borderRadius: 10,
          padding: 20,
          minWidth: 0, // important for flexbox children to allow shrinking
          overflow: "hidden",
          position: "relative", // for absolute positioning of interaction tab
        }}
      >
        <div
          style={{
            width: "100%",
            height: "576px",
            backgroundColor: "#222",
            borderRadius: 8,
            marginBottom: 20,
            position: "relative", // important for interaction tab absolute inside this container
            overflow: "auto", // allow scroll if canvas is too big for viewport
          }}
        >
          <canvas
            id="gameCanvas"
            ref={canvasRef}
            width={1024}
            height={576}
            style={{ display: "block", margin: "0 auto", background: "#333", borderRadius: 8 }}
          />
          
          {/* Interaction Tab */}
          <div
            id="interactionTab"
            style={{
              display: "none",
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: "#222",
              padding: 15,
              borderRadius: 8,
              width: 300,
              color: "#fff",
              zIndex: 1000,
              pointerEvents: "auto", // allow interaction if needed
            }}
          >
            <h3 className="interaction-name" style={{ marginTop: 0 }}></h3>
            <img
              className="interaction-image"
              alt=""
              style={{ width: "100%", borderRadius: 6, marginBottom: 10 }}
            />
            <p className="interaction-rarity" style={{ fontWeight: "bold" }}></p>
            <div className="interaction-description" style={{ fontSize: "0.9rem" }}></div>
            <p style={{ fontSize: "0.8rem", color: "gray", marginTop: "10px" }}>Press X to close</p>
          </div>
        </div>
        <div
          style={{
            maxWidth: 1024,
            textAlign: "center",
            fontSize: "1rem",
            lineHeight: 1.5,
            overflowY: "auto",
          }}
        >
          <p>
            Welcome to EcoQuest! Explore the environment, complete quests, and collect unique NFTs
            as you progress. Your mission is to learn and help the planet by offsetting carbon and
            interacting with nature.
          </p>
          <p>Here are some simple instructions:</p>
          <p>1) Move the character using w,a,s,d</p>
          <p>2) Interact with objects by pressing 'k' when near highlighted areas</p>
          <p>3) Press 'x' to close the interaction tab</p>
          <p>4) Explore. Learn. And have fun!</p>
        </div>
      </section>

      {/* Right: NFT Panel */}
      <aside
        style={{
          width: 250,
          backgroundColor: "#111",
          borderRadius: 10,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 40px)", // fit viewport minus padding
          minWidth: 0,
        }}
      >
        <h2 style={{ marginBottom: 15, textAlign: "center" }}>Collected NFTs</h2>
        {collectedNFTs.length === 0 && (
          <p style={{ textAlign: "center" }}>No NFTs collected yet.</p>
        )}
        {collectedNFTs.map((nft) => (
          <div
            key={nft.id}
            style={{
              backgroundColor: "#222",
              borderRadius: 8,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={nft.image}
              alt={nft.name}
              style={{ width: "100%", borderRadius: 6, marginBottom: 10 }}
            />
            <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{nft.name}</span>
          </div>
        ))}
      </aside>
    </main>
  );
}
