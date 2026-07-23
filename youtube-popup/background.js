chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tabs = await chrome.tabs.query({});
  
  tabs.forEach(async (tab) => {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      const isCurrentTab = (tab.id === activeInfo.tabId);

      try {
        if (isCurrentTab) {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              if (document.pictureInPictureElement) {
                document.exitPictureInPicture().catch(() => {});
              }
            }
          });
        } else {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const video = document.querySelector('video');
              if (video && !video.paused && document.pictureInPictureElement !== video) {
                video.requestPictureInPicture().catch((err) => {
                  console.log("PiP injection running...", err);
                });
              }
            }
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
});