function OptionsCtrl($scope) {
  $scope.editor = localStorage.getItem("railspanel.editor");

  $scope.$watch('editor', function(value) {
    localStorage.setItem("railspanel.editor", value);
 });
}

