// Get the current active tab URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentUrl = tabs[0].url;

  // Show loading text
  document.getElementById("co2").innerText = `Calculating...`;

  // Call WebsiteCarbon API
  fetch(`https://api.websitecarbon.com/site?url=${encodeURIComponent(currentUrl)}`)
    .then(response => response.json())
    .then(apiData => {
      if (apiData.statistics && apiData.statistics.co2 && apiData.statistics.co2.grid) {
        const grams = apiData.statistics.co2.grid.grams.toFixed(2);
        document.getElementById("co2").innerText = `${grams} g CO₂`;

        // Dynamic offset price: $0.0001 per gram
        const amount = (grams * 0.0001).toFixed(4);
        document.getElementById("offsetBtn").innerText = `Offset for $${amount}`;

        document.getElementById("offsetBtn").addEventListener("click", () => {
          const dashboardUrl = `https://your-dashboard-url.com/offset?amount=${amount}`;
          chrome.tabs.create({ url: dashboardUrl });
        });
      } else {
        document.getElementById("co2").innerText = `No data available`;
      }
    })
    .catch(error => {
      console.error("API error:", error);
      document.getElementById("co2").innerText = `Error fetching data`;
    });
});
