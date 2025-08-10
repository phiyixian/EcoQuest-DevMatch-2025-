"use client";

import { useEffect } from "react";

export default function DebugTestPage() {
  useEffect(() => {
    console.log("🎮 [DEBUG] Debug test page loaded");
    console.log("🎮 [DEBUG] Testing console logging");
    console.log("🎮 [DEBUG] If you see this, console logging is working!");
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🎮 Debug Test Page</h1>
      <p>Open your browser's Developer Tools (F12) and check the Console tab.</p>
      <p>You should see debug messages starting with "🎮 [DEBUG]"</p>
      <button 
        onClick={() => {
          console.log("🎮 [DEBUG] Button clicked!");
          alert("Check the console for debug message!");
        }}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Test Console Log
      </button>
    </div>
  );
}
