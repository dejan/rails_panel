console.log("Rails panel is active.");
connection = null

function connectToRadiowaves(uri) {
  connection = new WebSocket(uri);
  console.log("OK, connected to Radiowaves!")
  connection.onclose = function(e) {
    connection = null;
    console.log("Connection to Radiowaves closed...")
  }
  connection.onmessage = function (e) {
    appendRequest(JSON.parse(e.data));
  }
}

function appendRequest(data) {
  $('#log').append('<tr>'+
    '<td class="path">'       + data.payload.path                  + '</td>' +
    '<td class="method">'     + data.payload.method                + '</td>' +
    '<td class="controller">' + data.payload.controller            + '</td>' +
    '<td class="action">'     + data.payload.action                + '</td>' +
    '<td class="format">'     + data.payload.format                + '</td>' +
    '<td class="status">'     + data.payload.status                + '</td>' +
    '<td class="view">'       + data.payload.view_runtime.round(2) + '</td>' +
    '<td class="db">'         + data.payload.db_runtime.round(2)   + '</td>' +
    '<td class="duration">'   + data.duration.round(2)             + '</td>' +
  '</tr>');
  $('.data-container').scrollTop(100000000)
}

chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
    if (connection == null) {
      headers = request.response.headers;
      radiowavesURI = headers.find(function(x) { return x.name == 'X-Radiowaves-URI' })
      if (typeof radiowavesURI != 'undefined') {
        connectToRadiowaves(radiowavesURI.value);
      }
    }
  }
);

