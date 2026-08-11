chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("index.html"),
    type: "popup",
    width: 380,
    height: 520
  });
});