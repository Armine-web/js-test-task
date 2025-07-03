if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener((tab) => {
    if (tab.url && tab.url.includes("web.telegram.org")) {
      chrome.tabs.sendMessage(tab.id, { action: "toggle" });
    }
  });
} else {
  console.error("chrome.action.onClicked is undefined");
}
