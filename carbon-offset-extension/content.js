// ===== Helpers =====
const formatNumber = (num) => parseFloat(num).toFixed(2);
const STORAGE_KEY = "ecoquest_co2_data";
const SEEN_KEY = "ecoquest_seen_domains";

async function getStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key] || {});
    });
  });
}

async function setStorage(key, data) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: data }, resolve);
  });
}

function estimateCO2Fallback(domain) {
  if (domain.includes("youtube") || domain.includes("netflix")) return 8;
  if (domain.includes("facebook") || domain.includes("instagram")) return 5;
  if (domain.includes("google") || domain.includes("news")) return 2;
  return 1.5;
}

(async function () {
  const currentUrl = new URL(window.location.href);
  const domain = currentUrl.hostname;

  // 1️⃣ Only show once per domain per page load
  const seenDomains = await getStorage(SEEN_KEY);
  if (seenDomains[domain]) return;
  seenDomains[domain] = true;
  await setStorage(SEEN_KEY, seenDomains);

  // 2️⃣ Calculate site emission
  let grams = null;
  try {
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
  if (!grams || isNaN(grams)) grams = estimateCO2Fallback(domain);

  // 3️⃣ Accumulate CO2
  const storedData = await getStorage(STORAGE_KEY);
  const accumulatedGrams = (storedData[domain] || 0) + grams;
  storedData[domain] = accumulatedGrams;
  await setStorage(STORAGE_KEY, storedData);

  // Calculate today's total
  const totalCo2 = Object.values(storedData).reduce((a, b) => a + b, 0);
  const usdAmount = (totalCo2 * 0.0001).toFixed(4); // $0.0001 per gram

  // 4️⃣ Create floating popup
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.width = "260px";
  popup.style.background = "linear-gradient(to bottom right, #ecfdf5, #eff6ff)";
  popup.style.borderRadius = "12px";
  popup.style.boxShadow = "0 2px 12px rgba(0,0,0,0.2)";
  popup.style.padding = "12px";
  popup.style.fontFamily = "Segoe UI, Arial, sans-serif";
  popup.style.zIndex = "999999";
  popup.style.color = "#1f2937";

  popup.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <strong style="color:#065f46;font-size:16px;">🌱 EcoQuest</strong>
      <button id="ecoquest-close" style="border:none;background:transparent;font-size:16px;font-weight:bold;cursor:pointer;">✕</button>
    </div>
    <p style="font-size:12px;color:#6b7280;margin:4px 0 10px 0;">Track & Offset Your Browsing CO₂</p>

    <div style="background:white;border-radius:8px;padding:8px;text-align:center;margin-bottom:8px;box-shadow:0 1px 4px rgba(0,0,0,0.1);">
      <p style="margin:4px 0;font-size:14px;color:#374151;">This Site Emitted</p>
      <div style="font-size:18px;font-weight:bold;color:#16a34a;">${formatNumber(grams)} g CO₂</div>
    </div>

    <div style="background:white;border-radius:8px;padding:8px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.1);">
      <p style="margin:4px 0;font-size:14px;color:#374151;">Total CO₂ Today</p>
      <div style="font-size:18px;font-weight:bold;color:#1d4ed8;">${formatNumber(totalCo2)} g CO₂</div>
      <button id="ecoquest-offset" style="
        margin-top:8px;
        width:100%;
        padding:8px;
        background:#16a34a;
        color:white;
        border:none;
        border-radius:6px;
        font-weight:600;
        cursor:pointer;
      ">Offset for $${usdAmount}</button>
    </div>
  `;

  document.body.appendChild(popup);

  // 5️⃣ Close button
  popup.querySelector("#ecoquest-close").addEventListener("click", () => {
    popup.remove();
  });

  // 6️⃣ Offset button
  popup.querySelector("#ecoquest-offset").addEventListener("click", async () => {
    const dashboardUrl = `http://192.168.56.1:3000/ecoquest?donation=${usdAmount}&message=Offset%20from%20Extension&autoDonate=true`;

    // Reset all accumulated CO2 after offset
    await setStorage(STORAGE_KEY, {});

    window.open(dashboardUrl, "_blank");
    popup.remove();
  });
})();
