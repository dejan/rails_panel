function onRequest(request, sender, callback) {
  if (request.action == 'getJSON') {
    $.getJSON(request.url, callback);
  }
}
chrome.extension.onRequest.addListener(onRequest);

// set default editor 
var editor = localStorage.getItem("railspanel.editor") 
if (editor == "null" || editor == null) {
  localStorage.setItem("railspanel.editor", "mate");
}

