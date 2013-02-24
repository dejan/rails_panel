angular.module('RailsPanel', []).
  filter('editorify', function() {
    return function(input) {
      var mapping = {
        mvim: "mvim://open?url=file://%s&line=%d&column=%d",
        mate: "txmt://open?url=file://%s&line=%d&column=%d",
        subl: "subl://open?url=file://%s&line=%d&column=%d",
        emacs: "emacs://open?url=file://%s&line=%d&column=%d"}
      var editor = localStorage.getItem("railspanel.editor");
      var editorPrefix = mapping[editor]
      var out = sprintf(editorPrefix, input, 1, 1);
      return out;
    }
  }).
  filter('normalizeViewPath', function() {
    return function(input) {
      return input.remove(/.*\/app\/views/);
    }
  });
