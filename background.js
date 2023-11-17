chrome.action.onClicked.addListener((tab) => {
  // Send a message to the content script to execute logic
  chrome.tabs.sendMessage(tab.id, { action: "execute_content_script" });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'field_found') {
    sendResponse({ reply: 'https://api.quotable.io/quotes/random' });
  } else {
    sendResponse({ reply: 'https://random.imagecdn.app/500/150' });
  }
});