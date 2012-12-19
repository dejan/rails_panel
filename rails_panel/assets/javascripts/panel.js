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

$(function() {

  $('#tabs').tabs();

  var scope = angular.element('.split-view').scope();
  new TransactionsCtrl(scope);

  if (typeof chrome.devtools == 'undefined') {
    addData('1', scope, mockTransactions());
  } else {
    chrome.devtools.network.onRequestFinished.addListener(
      function(request) {
        headers = request.response.headers;
        var requestId = headers.find(function(x) { return x.name == 'X-Request-Id' });
        var metaRequestVersion = headers.find(function(x) { return x.name == 'X-MetaRequest-Version' });
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


