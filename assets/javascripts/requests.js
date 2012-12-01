function RequestsCtrl($scope) {
  $scope.requests = [
    {path:'/articles', method:'GET', controller:'ArticlesController', action:'index', format:'html', status:'200', view:'110.23', db:'50.01', duration:'160.24'},
    {path:'/articles/17', method:'GET', controller:'ArticlesController', action:'show', format:'html', status:'200', view:'120.11', db:'10.15', duration:'130.26'},
    {path:'/articles/17', method:'GET', controller:'ArticlesController', action:'edit', format:'html', status:'200', view:'122.00', db:'10.15', duration:'132.15'},
    {path:'/articles/17', method:'PUT', controller:'ArticlesController', action:'update', format:'html', status:'200', view:'10.78', db:'250.10', duration:'260.88'},
    {path:'/articles', method:'GET', controller:'ArticlesController', action:'index', format:'html', status:'200', view:'110.23', db:'50.01', duration:'160.24'},
  ]
}
