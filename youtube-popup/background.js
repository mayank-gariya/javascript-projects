chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Get all open tabs to check which one is YouTube and which one is active
  const tabs = await chrome.tabs.query({});
  
  tabs.forEach(tab => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      if (tab.id === activeInfo.tabId) {
        chrome.tabs.sendMessage(tab.id, { action: "EXIT_PIP" }).catch(() => {});
      } else {
        chrome.tabs.sendMessage(tab.id, { action: "ENTER_PIP" }).catch(() => {});
      }
    }
  });
});