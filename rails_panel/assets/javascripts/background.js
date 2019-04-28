chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  if (message.action == 'getJSON') {
    $.getJSON(message.url, callback);
    return true;
  }
});

// set default editor 
var editor = localStorage.getItem("railspanel.editor") 
if (editor == "null" || editor == null) {
  localStorage.setItem("railspanel.editor", "mate");
}

