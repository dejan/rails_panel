angular.module('RailsPanel', [])
  .directive('ngHtml', function() {
    return function(scope, element, attrs) {
      scope.$watch(attrs.ngHtml, function(value) {
        element[0].innerHTML = value;
      });
    }
  }).
  filter('editorify', function() {
    return function(input) {
      var mapping = {
        mvim: "mvim://open?url=file://%s&line=%d&column=%d",
        mate: "txmt://open?url=file://%s&line=%d&column=%d",
        subl: "subl://open?url=file://%s&line=%d&column=%d",
        sblm: "sblm:///%s",
        emacs: "emacs://open?url=file://%s&line=%d&column=%d",
        mine: "rubymine://open?url=file://%s&line=%d"}
      var editor = localStorage.getItem("railspanel.editor");
      var editorPrefix = mapping[editor]
      if (editor === 'sblm') {
        var out = sprintf(editorPrefix, input);
        // remove sblm:///c:/git/Icome/app/views/homes/index.html.erb the second :
        // so become sblm:///c/git/Icome/app/views/homes/index.html.erb
        out = out.slice(0, 9) + out.slice(10, out.len);
      } else {
        var out = sprintf(editorPrefix, input, 1, 1);
      }
      return out;
    }
  }).
  filter('normalizeViewPath', function() {
    return function(input) {
      return input.remove(/.*\/app\/views/);
    }
  }).
  filter('ansi2html', function() {
    return function(input) {
      return ansi2html(input);
    }
});
