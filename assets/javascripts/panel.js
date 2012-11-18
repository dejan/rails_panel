console.log("Rails panel is active.");
var connection = new WebSocket('ws://localhost:12010')

connection.onmessage = function (e) {
  data = JSON.parse(e.data);
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
};

