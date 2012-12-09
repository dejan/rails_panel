console.log("Rails panel is active.");
connection = null

function connectToRadiowaves(uri) {
  connection = new WebSocket(uri);
  scope = angular.element('.split-view').scope();
  new TransactionsCtrl(scope)

  console.log("OK, connected to Radiowaves!")
  connection.onclose = function(e) {
    connection = null;
    console.log("Connection to Radiowaves closed...")
  }
  connection.onmessage = function (e) {
    scope.$apply(function() { scope.parseNotification(JSON.parse(e.data)) } );
    $('.data-container').scrollTop(100000000);
  }
}


$(function() {
  $('#tabs').tabs();
});

// TODO if devtools is undefined load mock data
chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
    if (connection == null) {
      headers = request.response.headers;
      radiowavesURI = headers.find(function(x) { return x.name == 'X-Radiowaves-Uri' })
      if (typeof radiowavesURI != 'undefined') {
        connectToRadiowaves(radiowavesURI.value);
      }
    }
  }
);

