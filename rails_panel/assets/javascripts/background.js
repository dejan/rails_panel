function onRequest(request, sender, callback) {
  if (request.action == 'getJSON') {
    $.getJSON(request.url, callback);
  }
}

chrome.extension.onRequest.addListener(onRequest);
