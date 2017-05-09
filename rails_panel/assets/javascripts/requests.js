getJSON = function(url, callback) {
  console.log("sending RPC:" + url);
  chrome.extension.sendRequest({action:'getJSON',url:url}, callback);
}

var requests = {
  bindListener: function(scope) {
    chrome.devtools.network.onRequestFinished.addListener(function(request) {
      headers = request.response.headers;
      var requestId = headers.find(function(x) { return x.name.toLowerCase() == 'x-request-id' });
      var metaRequestVersion = headers.find(function(x) { return x.name.toLowerCase() == 'x-meta-request-version' });
      var railsRelativeUrlRoot = headers.find(function(x) { return x.name.toLowerCase() == 'x-rails-relative-url-root' });
      railsRelativeUrlRoot = (typeof railsRelativeUrlRoot != 'undefined') ? railsRelativeUrlRoot.value : '';
      if (typeof metaRequestVersion != 'undefined') {
        scope.metaRequestVersion = metaRequestVersion.value;
        var uri = new URI(request.request.url);
        uri.pathname(railsRelativeUrlRoot + '/__meta_request/' + requestId.value + '.json');
        uri.search("");
        getJSON(uri.toString(), function(data) {
          panel.addData(requestId.value, scope, data);
          $('.data-container').scrollTop(100000000);
        });
      };
    });
  }
};
