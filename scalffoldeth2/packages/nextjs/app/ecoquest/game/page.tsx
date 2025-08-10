"use client";

import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function EcoQuestGamePage() {
  console.log("🎮 [DEBUG] EcoQuestGamePage component rendered");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { address, isConnected } = useAccount();

  const [collectedNFTs, setCollectedNFTs] = useState<
    Array<{ id: number; name: string; image: string; rarity: string }>
  >([]);

  // Contract hooks for NFT collection
  // Temporarily using EcoQuestNFT until types refresh
  // const { writeContractAsync: collectNFT } = useScaffoldWriteContract({
  //   contractName: "EcoQuestNFT",
  // });

  // Debug: Show contract information
  console.log("EcoQuestCollection deployed at: 0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f");
  console.log("Contract added to deployedContracts.ts - types will update after server restart");

  // For now, use local storage to persist NFTs until types are fully loaded
  // const [persistedNFTs, setPersistedNFTs] = useState<any[]>([]);

  // Load persisted NFTs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && address) {
      const stored = localStorage.getItem(`ecoquest-nfts-${address}`);
      if (stored) {
        try {
          const parsedNFTs = JSON.parse(stored);
          // setPersistedNFTs(parsedNFTs);
          setCollectedNFTs(parsedNFTs);
        } catch (error) {
          console.error("Error loading stored NFTs:", error);
        }
      }
    }
  }, [address]);

  // Save NFTs to localStorage for persistence
  const saveNFTsToStorage = (nfts: any[]) => {
    if (typeof window !== "undefined" && address) {
      try {
        localStorage.setItem(`ecoquest-nfts-${address}`, JSON.stringify(nfts));
        console.log("NFTs saved to localStorage:", nfts);
      } catch (error) {
        console.error("Error saving NFTs to localStorage:", error);
      }
    }
  };

  // Play sound effect when NFT is collected
  const playCollectionSound = () => {
    try {
      // Use a data URL for a simple beep sound or skip if no sound file available
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Sound not available:", error);
    }
  };

  // Save NFT to both localStorage and blockchain (when types are ready)
  const saveNFTToBlockchain = async (nft: { name: string; image: string; rarity: string }) => {
    if (!address || !isConnected) return;

    console.log("NFT collected:", nft);
    console.log("🎯 EcoQuestCollection contract deployed at: 0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f");
    console.log("📝 Contract added to deployedContracts.ts - ready for blockchain integration");

    // TODO: Enable blockchain saving once TypeScript types refresh
    // The contract function signature will be:
    // collectNFT(address user, string name, string image, string rarity)

    // For now, this function prepares the data structure for blockchain storage
    console.log("Ready for blockchain integration with EcoQuestCollection.collectNFT()");
  };

  useEffect(() => {
    (window as any).addCollectedNFT = async (nft: { id: number; name: string; image: string; rarity?: string }) => {
      // Validate and sanitize NFT data
      const validatedNFT = {
        id: nft.id || Date.now() + Math.random(),
        name: typeof nft.name === "string" ? nft.name : "Unknown NFT",
        image: typeof nft.image === "string" ? nft.image : "/ecoquest/assets/wildlife-images/cow.jpeg",
        rarity: typeof nft.rarity === "string" ? nft.rarity : "Common",
      };

      console.log("Validated NFT data:", validatedNFT);

      // Check if already collected
      if (collectedNFTs.find(item => item.name === validatedNFT.name)) return;

      // Add to local state
      const updatedNFTs = [...collectedNFTs, validatedNFT];
      setCollectedNFTs(updatedNFTs);

      // Save to localStorage for persistence
      saveNFTsToStorage(updatedNFTs);

      // Play sound effect
      playCollectionSound();

      // Save to blockchain
      await saveNFTToBlockchain({
        name: validatedNFT.name,
        image: validatedNFT.image,
        rarity: validatedNFT.rarity,
      });
    };
  }, [address, isConnected, collectedNFTs, saveNFTsToStorage]);

  useEffect(() => {
    console.log("🎮 [DEBUG] Game page useEffect triggered");
    console.log("🎮 [DEBUG] Wallet connected:", isConnected);
    console.log("🎮 [DEBUG] Wallet address:", address);
    
    // Load scripts immediately when component mounts, don't wait for canvas
    console.log("🎮 [DEBUG] Loading scripts immediately...");

    const scriptSources = [
      "/ecoquest/js/interactableObjects.js",
      "/ecoquest/js/tab.js",
      "/ecoquest/js/quest.js",
      "/ecoquest/js/collisions.js",
      "/ecoquest/js/objects.js",
      "/ecoquest/js/class.js",
      "/ecoquest/index.js",
    ];

    console.log("🎮 [DEBUG] Script sources:", scriptSources);

    async function loadScriptsSequentially() {
      console.log("🎮 [DEBUG] Starting script loading sequence");
      
      // Clear any existing scripts first
      scriptSources.forEach(src => {
        const existingScripts = document.querySelectorAll(`script[src="${src}"]`);
        console.log(`🎮 [DEBUG] Removing ${existingScripts.length} existing scripts for ${src}`);
        existingScripts.forEach(el => el.remove());
      });

      // Clear global variables that might cause conflicts
      const globalVarsToClean = [
        "objectsData",
        "objectsMap",
        "objects",
        "mushroomData",
        "treeData",
        "cowData",
        "otherTreeData",
        "otherMushroomData",
        "chickenData",
        "sheepData",
        "pigData",
        "goatData",
        "duckData",
        "rabbitData",
        "foxData",
        "bearData",
        "deerData",
        "wolfData",
        "eagleData",
        "fishData",
        "frogData",
        "snakeData",
        "turtleData",
        "butterflyData",
        "beeData",
        "spiderData",
        "antData",
        "wormData",
        "snailData",
        "boundaries",
        "background",
        "movables",
        "player",
        "canvas",
        "c",
      ];

      console.log("🎮 [DEBUG] Cleaning global variables");
      globalVarsToClean.forEach(varName => {
        if ((window as any)[varName]) {
          console.log(`🎮 [DEBUG] Deleting global variable: ${varName}`);
          delete (window as any)[varName];
        }
      });

      for (let i = 0; i < scriptSources.length; i++) {
        const src = scriptSources[i];
        console.log(`🎮 [DEBUG] Loading script ${i + 1}/${scriptSources.length}: ${src}`);
        
        try {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = false;
            script.onload = () => {
              console.log(`🎮 [DEBUG] ✅ Successfully loaded: ${src}`);
              resolve();
            };
            script.onerror = (error) => {
              console.error(`🎮 [DEBUG] ❌ Failed to load script: ${src}`, error);
              reject(new Error(`Failed to load script ${src}`));
            };
            document.body.appendChild(script);
            console.log(`🎮 [DEBUG] Script element added to DOM: ${src}`);
          });
        } catch (error) {
          console.error(`🎮 [DEBUG] ❌ Script loading failed: ${src}`, error);
          throw error;
        }
      }

      console.log("🎮 [DEBUG] All scripts loaded successfully");
      
      // Check if canvas exists after script loading and initialize game
      const checkCanvasAndInit = () => {
        const canvas = document.querySelector("canvas");
        console.log("🎮 [DEBUG] Canvas element after script loading:", canvas);
        console.log("🎮 [DEBUG] Canvas ID:", canvas?.id);
        console.log("🎮 [DEBUG] Canvas dimensions:", canvas?.width, "x", canvas?.height);
        
        // Check if game variables are available
        console.log("🎮 [DEBUG] Game variables check:");
        console.log("🎮 [DEBUG] - collisions:", typeof (window as any).collisions);
        console.log("🎮 [DEBUG] - objectsData:", typeof (window as any).objectsData);
        console.log("🎮 [DEBUG] - interactionZones:", typeof (window as any).interactionZones);
        console.log("🎮 [DEBUG] - Boundary class:", typeof (window as any).Boundary);
        console.log("🎮 [DEBUG] - Item class:", typeof (window as any).Item);
        console.log("🎮 [DEBUG] - Sprite class:", typeof (window as any).Sprite);
        
        // If canvas is not found, retry after a delay
        if (!canvas) {
          console.log("🎮 [DEBUG] Canvas not found, retrying in 500ms...");
          setTimeout(checkCanvasAndInit, 500);
          return;
        }
        
        // If all variables are available and canvas exists, trigger game initialization
        if ((window as any).collisions && (window as any).objectsData && (window as any).interactionZones && (window as any).Boundary) {
          console.log("🎮 [DEBUG] All dependencies loaded, triggering game initialization...");
          // Trigger the game initialization by dispatching a custom event
          window.dispatchEvent(new CustomEvent('gameReady'));
        } else {
          console.log("🎮 [DEBUG] Dependencies not ready, retrying in 500ms...");
          setTimeout(checkCanvasAndInit, 500);
        }
      };
      
      // Start checking for canvas and dependencies
      setTimeout(checkCanvasAndInit, 100);
      
      // Fallback: if game doesn't start within 10 seconds, try to initialize anyway
      setTimeout(() => {
        const canvas = document.querySelector("canvas");
        if (canvas && (window as any).collisions && (window as any).objectsData && (window as any).interactionZones && (window as any).Boundary) {
          console.log("🎮 [DEBUG] Fallback: triggering game initialization after timeout...");
          window.dispatchEvent(new CustomEvent('gameReady'));
        }
      }, 10000);
    }

    loadScriptsSequentially().catch((error) => {
      console.error("🎮 [DEBUG] ❌ Script loading sequence failed:", error);
    });

    return () => {
      scriptSources.forEach(src => {
        document.querySelectorAll(`script[src="${src}"]`).forEach(el => el.remove());
      });
    };
  }, []); // Only run once when component mounts

  // Continuous canvas checking useEffect
  useEffect(() => {
    if (!isConnected) {
      console.log("🎮 [DEBUG] Wallet not connected, skipping canvas check");
      return;
    }

    console.log("🎮 [DEBUG] Starting continuous canvas check...");
    
    let checkCount = 0;
    const maxChecks = 50; // Check up to 50 times (5 seconds total)
    
    const checkCanvasInterval = setInterval(() => {
      checkCount++;
      const canvas = document.querySelector("canvas");
      console.log(`🎮 [DEBUG] Canvas check #${checkCount}:`, canvas ? "Found!" : "Not found");
      
      if (canvas) {
        console.log("🎮 [DEBUG] Canvas found! Stopping checks and triggering game initialization...");
        clearInterval(checkCanvasInterval);
        
        // Give a small delay for scripts to load, then trigger game
        setTimeout(() => {
          console.log("🎮 [DEBUG] Triggering gameReady event...");
          window.dispatchEvent(new CustomEvent('gameReady'));
        }, 1000);
      } else if (checkCount >= maxChecks) {
        console.log("🎮 [DEBUG] Max canvas checks reached, stopping...");
        clearInterval(checkCanvasInterval);
      }
    }, 100); // Check every 100ms
    
    return () => {
      clearInterval(checkCanvasInterval);
    };
  }, [isConnected]);

  // Show wallet connection requirement if not connected
  if (!isConnected) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>🎮 EcoQuest Game</h1>
        <p style={{ marginBottom: "30px", fontSize: "1.2rem", maxWidth: "500px" }}>
          Welcome to EcoQuest! Connect your wallet to start playing and collecting unique environmental NFTs.
        </p>
        <ConnectButton />
        <p style={{ marginTop: "20px", color: "#888", fontSize: "0.9rem" }}>
          Your progress and collected NFTs will be linked to your wallet address.
        </p>
      </div>
    );
  }

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
            <img className="interaction-image" alt="" style={{ width: "100%", borderRadius: 6, marginBottom: 10 }} />
            <p className="interaction-rarity" style={{ fontWeight: "bold" }}></p>
            <div className="interaction-description" style={{ fontSize: "0.9rem" }}></div>
            <p style={{ fontSize: "0.8rem", color: "gray", marginTop: "10px" }}>Press X to close</p>
          </div>
        </div>
        <div
          style={{
            maxWidth: 800,
            textAlign: "center",
            fontSize: "0.9rem",
            lineHeight: 1.4,
            color: "#e0e0e0",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => {
              console.log("🎮 [DEBUG] Manual game initialization triggered");
              window.dispatchEvent(new CustomEvent('gameReady'));
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
              marginRight: "10px",
            }}
          >
            🎮 Initialize Game Manually
          </button>
          <button
            onClick={() => {
              console.log("🎮 [DEBUG] Checking dependencies...");
              if ((window as any).checkGameDependencies) {
                (window as any).checkGameDependencies();
              } else {
                console.log("🎮 [DEBUG] checkGameDependencies function not available");
              }
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            🔍 Check Dependencies
          </button>
        </div>
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #333",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              color: "#4ade80",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            🎮 How to Play
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <span style={{ color: "#60a5fa", fontWeight: "500" }}>🎯 Movement:</span>
              <br />
              <span style={{ fontSize: "0.8rem" }}>Use WASD keys</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ color: "#f59e0b", fontWeight: "500" }}>🔍 Interact:</span>
              <br />
              <span style={{ fontSize: "0.8rem" }}>Press K near objects</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ color: "#ef4444", fontWeight: "500" }}>❌ Close:</span>
              <br />
              <span style={{ fontSize: "0.8rem" }}>Press X to close tabs</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ color: "#8b5cf6", fontWeight: "500" }}>🏆 Goal:</span>
              <br />
              <span style={{ fontSize: "0.8rem" }}>Collect NFTs & learn</span>
            </div>
          </div>
          <p
            style={{
              margin: "0",
              fontSize: "0.8rem",
              color: "#9ca3af",
              fontStyle: "italic",
            }}
          >
            Explore the environment and help the planet! 🌱
          </p>
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
          <h2 style={{ margin: 0 }}>Collected NFTs</h2>
          <span style={{ background: "#333", padding: "4px 8px", borderRadius: 4, fontSize: "0.8rem" }}>
            {collectedNFTs.length}
          </span>
        </div>
        {collectedNFTs.length === 0 && (
          <div style={{ textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
            <p>🌱 No NFTs collected yet.</p>
            <p>Explore and interact with objects to collect them!</p>
          </div>
        )}
        {collectedNFTs.map(nft => (
          <div
            key={nft.id}
            style={{
              backgroundColor: "#222",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: `2px solid ${nft.rarity === "Rare" ? "#ffd700" : nft.rarity === "Epic" ? "#9c27b0" : "#4caf50"}`,
              animation: "fadeIn 0.5s ease-in",
            }}
          >
            <img
              src={typeof nft.image === "string" ? nft.image : "/ecoquest/assets/wildlife-images/cow.jpeg"}
              alt={nft.name}
              style={{ width: "100%", borderRadius: 6, marginBottom: 8 }}
              onError={e => {
                e.currentTarget.src = "/ecoquest/assets/wildlife-images/cow.jpeg";
              }}
            />
            <span style={{ fontWeight: "bold", fontSize: "0.9rem", marginBottom: 4 }}>{nft.name}</span>
            <span
              style={{
                fontSize: "0.7rem",
                color: nft.rarity === "Rare" ? "#ffd700" : nft.rarity === "Epic" ? "#9c27b0" : "#4caf50",
                fontWeight: "bold",
              }}
            >
              {nft.rarity}
            </span>
          </div>
        ))}
      </aside>
    </main>
  );
}
