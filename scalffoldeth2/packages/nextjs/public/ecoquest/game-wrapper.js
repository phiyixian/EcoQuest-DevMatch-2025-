// Safe game wrapper that checks for canvas availability
function initializeGame() {
  console.log("🎮 Initializing game...");

  // Wait for canvas to be available
  const canvas = document.querySelector("canvas#gameCanvas");
  if (!canvas) {
    console.error("❌ Canvas not found, retrying in 100ms...");
    setTimeout(initializeGame, 100);
    return;
  }

  console.log("✅ Canvas found, starting game...");

  try {
    // Re-define canvas for the game scope
    window.gameCanvas = canvas;

    // Initialize context
    const c = canvas.getContext("2d");
    if (!c) {
      console.error("❌ Cannot get 2D context");
      return;
    }

    canvas.width = 1024;
    canvas.height = 576;

    console.log("✅ Game canvas initialized successfully!");

    // Dispatch event to let React know game is ready
    window.dispatchEvent(new CustomEvent("gameCanvasReady"));
  } catch (error) {
    console.error("❌ Game initialization failed:", error);
  }
}

// Auto-initialize when script loads
if (typeof window !== "undefined") {
  // Wait a bit for DOM to be ready
  setTimeout(initializeGame, 100);
}

// Expose function for manual initialization
window.initializeGame = initializeGame;
