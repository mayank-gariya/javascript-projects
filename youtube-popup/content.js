// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const video = document.querySelector('video');
  
  // If no video is present or playing, do nothing
  if (!video) return;

  if (request.action === "ENTER_PIP") {
    // Only trigger if a video is currently playing and not already in PiP
    if (!video.paused && document.pictureInPictureElement !== video) {
      video.requestPictureInPicture().catch(err => {
        console.error("Failed to enter Picture-in-Picture:", err);
      });
    }
  } else if (request.action === "EXIT_PIP") {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(err => {
        console.error("Failed to exit Picture-in-Picture:", err);
      });
    }
  }
});