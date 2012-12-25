angular.module('RailsPanel', []).
  filter('editorify', function() {
    return function(input) {
      //var editorPrefix = "mvim://open?url=file://%s&line=%d&column=%d" // mvim
      var editorPrefix = "txmt://open?url=file://%s&line=%d&column=%d" // textmate
      var out = sprintf(editorPrefix, input, 1, 1);
      return out;
    }
  }).
  filter('normalizeViewPath', function() {
    return function(input) {
      return input.remove(/.*\/app\/views/);
    }
  });

