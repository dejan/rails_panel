chrome.extension.onRequest.addListener(function(request, sender, callback) {
  if (request.action == 'getJSON') {
    $.getJSON(request.url, callback);
  }
});

// set default editor 
var editor = localStorage.getItem("railspanel.editor") 
if (editor == "null" || editor == null) {
  localStorage.setItem("railspanel.editor", "mate");
}

