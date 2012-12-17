chrome_getJSON = function(url, callback) {
  console.log("sending RPC");
  chrome.extension.sendRequest({action:'getJSON',url:url}, callback);
}

addData = function(scope, data) {
  data.each(function(n) { scope.$apply(function() { scope.parseNotification(n) } ) } );
}

$(function() {

  $('#tabs').tabs();

  var scope = angular.element('.split-view').scope();
  new TransactionsCtrl(scope);

  if (typeof chrome.devtools == 'undefined') {
    addData(scope, mockTransactions());
  } else {
    chrome.devtools.network.onRequestFinished.addListener(
      function(request) {
        headers = request.response.headers;
        requestId = headers.find(function(x) { return x.name == 'X-Request-Id' });
        if (typeof requestId != 'undefined') {

          var uri = new URI(request.request.url);
          uri.pathname('/__meta_request/' + requestId.value + '.json');

          chrome_getJSON(uri.toString(), function(data) {
            addData(scope, data);
            $('.data-container').scrollTop(100000000);
          });
        }
      }
    );
  }

});


