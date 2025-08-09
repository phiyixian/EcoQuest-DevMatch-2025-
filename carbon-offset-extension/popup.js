// Format number with 2 decimal places
const formatNumber = (num) => parseFloat(num).toFixed(2);

// Storage keys
const STORAGE_KEY = "ecoquest_co2_data";

// Helpers for chrome.storage
async function getStoredCO2() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] || {}); // { domain: grams }
    });
  });
}

async function setStoredCO2(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: data }, resolve);
  });
}

// Fallback CO2 estimation in grams per page load
function estimateCO2Fallback(domain) {
  if (domain.includes("youtube") || domain.includes("netflix")) return 8;   // heavy video sites
  if (domain.includes("facebook") || domain.includes("instagram")) return 5; // social media
  if (domain.includes("google") || domain.includes("news")) return 2;        // moderate
  return 1.5; // default for light sites
}

// Main logic
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const currentUrl = new URL(tabs[0].url);
  const domain = currentUrl.hostname;

  const siteCo2El = document.getElementById("siteCo2");
  const totalCo2El = document.getElementById("totalCo2");
  const offsetBtn = document.getElementById("offsetBtn");

  siteCo2El.innerText = "Calculating...";
  totalCo2El.innerText = "Calculating...";
  offsetBtn.disabled = true;
  offsetBtn.innerText = "Loading...";

  let grams = null;

  try {
    // Try WebsiteCarbon API first
    const response = await fetch(
      `https://api.websitecarbon.com/site?url=${encodeURIComponent(currentUrl.href)}`
    );
    if (response.ok) {
      const apiData = await response.json();
      if (apiData.statistics?.co2?.grid) {
        grams = parseFloat(apiData.statistics.co2.grid.grams.toFixed(2));
      }
    }
  } catch (err) {
    console.warn("WebsiteCarbon API failed, using fallback", err);
  }

  // Use fallback if API fails
  if (!grams || isNaN(grams)) grams = estimateCO2Fallback(domain);

  // Load existing storage
  const storedData = await getStoredCO2();

  // Accumulate CO2 for this domain
  const accumulatedGrams = (storedData[domain] || 0) + grams;
  storedData[domain] = accumulatedGrams;
  await setStoredCO2(storedData);

  // Calculate total CO2 across all sites
  const totalCo2 = Object.values(storedData).reduce((a, b) => a + b, 0);

  // Update UI
  siteCo2El.innerText = `${formatNumber(grams)} g CO₂`;
  totalCo2El.innerText = `${formatNumber(totalCo2)} g CO₂`;

  // Calculate donation amount (USD ≈ USDC)
  const usdAmount = (totalCo2 * 0.0001).toFixed(4); // $0.0001 per gram
  offsetBtn.innerText = `Offset for $${usdAmount}`;
  offsetBtn.disabled = false;

  // Offset button logic
  offsetBtn.addEventListener("click", async () => {
    const dashboardUrl = `http://localhost:3000/ecoquest?donation=${usdAmount}&message=Offset%20from%20Extension&autoDonate=true`;

    // Reset all accumulated CO2 after offset
    await setStoredCO2({});

    // Open EcoQuest donation page
    chrome.tabs.create({ url: dashboardUrl });
  });
});
