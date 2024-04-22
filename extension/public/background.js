chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  if (message.action == 'getJSON') {
    fetch(message.url)
      .then((resp) => resp.json())
      .then((data) => callback(data))
    return true;
  } else if (message.action === 'copyToClipboard') {
    addToClipboard(message.text);
  }
});

// https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.offscreen-clipboard-write
async function addToClipboard(value) {
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: 'Write text to the clipboard.'
  });

  chrome.runtime.sendMessage({
    type: 'copy-data-to-clipboard',
    target: 'offscreen-doc',
    data: value
  });
}