let visitCount = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get(["visitCount", "lastDate"], (data) => {
      const today = new Date().toDateString();
      let count = data.visitCount || 0;
      let lastDate = data.lastDate || today;

      // Reset count if it's a new day
      if (lastDate !== today) {
        count = 0;
        lastDate = today;
      }

      count++;
      chrome.storage.local.set({ visitCount: count, lastDate });
    });
  }
});
