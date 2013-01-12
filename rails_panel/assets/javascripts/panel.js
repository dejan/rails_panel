chrome_getJSON = function(url, callback) {
  console.log("sending RPC:" + url);
  chrome.extension.sendRequest({action:'getJSON',url:url}, callback);
}

addData = function(requestId, scope, data) {
  data.each(function(n) { 
    scope.$apply(function() {
      scope.parseNotification(requestId, n);
    }); 
  });
}

clearData = function(scope) {
  scope.$apply(function() {
    scope.clear();
  });
}


$(function() {
  var scope = angular.element('.split-view').scope();
  new TransactionsCtrl(scope);

  var port = chrome.extension.connect({name: "clear"});
  port.onMessage.addListener(function(msg) {
    clearData(scope);
  });

  key('⌘+k, ctrl+l', function(){ clearData(scope) });

  $('#tabs').tabs();
  if (typeof chrome.devtools == 'undefined') {
    addData('1', scope, mockTransactions1());
    addData('2', scope, mockTransactions2());
    addData('3', scope, mockTransactions3());
    addData('4', scope, mockTransactions4());
    addData('5', scope, mockTransactions5());
    addData('6', scope, mockTransactions6());
  } else {
    chrome.devtools.network.onRequestFinished.addListener(
      function(request) {
        headers = request.response.headers;
        var requestId = headers.find(function(x) { return x.name == 'X-Request-Id' });
        var metaRequestVersion = headers.find(function(x) { return x.name == 'X-Meta-Request-Version' });
        if (typeof metaRequestVersion != 'undefined') {

          var uri = new URI(request.request.url);
          uri.pathname('/__meta_request/' + requestId.value + '.json');
          chrome_getJSON(uri.toString(), function(data) {
            addData(requestId.value, scope, data);
            $('.data-container').scrollTop(100000000);
          });
        }
      }
    );
  }

});


