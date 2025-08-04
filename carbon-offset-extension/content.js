(async function() {
  const currentUrl = window.location.href;

  try {
    const response = await fetch(`https://api.websitecarbon.com/site?url=${encodeURIComponent(currentUrl)}`);
    const data = await response.json();

    if (data.statistics && data.statistics.co2 && data.statistics.co2.grid) {
      const grams = data.statistics.co2.grid.grams.toFixed(2);
      const amount = (grams * 0.0001).toFixed(4); // $ per gram

      // Create a floating banner
      const banner = document.createElement("div");
      banner.style.position = "fixed";
      banner.style.bottom = "20px";
      banner.style.right = "20px";
      banner.style.background = "#222";
      banner.style.color = "#fff";
      banner.style.padding = "10px";
      banner.style.borderRadius = "8px";
      banner.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      banner.style.zIndex = "999999";
      banner.style.fontSize = "14px";
      banner.style.fontFamily = "Arial, sans-serif";

      banner.innerHTML = `
        <p style="margin:0; font-weight:bold;">CO₂: ${grams} g</p>
        <button id="offsetBtn" style="
          margin-top:6px;
          background:#4CAF50;
          color:white;
          border:none;
          padding:5px 10px;
          cursor:pointer;
          border-radius:4px;">Offset $${amount}</button>
      `;

      document.body.appendChild(banner);

      document.getElementById("offsetBtn").addEventListener("click", () => {
        const dashboardUrl = `https://your-dashboard-url.com/offset?amount=${amount}`;
        window.open(dashboardUrl, "_blank");
      });
    }
  } catch (err) {
    console.error("Error fetching CO₂ data:", err);
  }
})();
