function TransactionsCtrl($scope) {
  $scope.transactionKeys = ['371131b57ce19c8bcc3d', '5ec801dc01e98e8c50ba'] 
  $scope.transactions = {
    '371131b57ce19c8bcc3d': { 
      request: {transactionId:'371131b57ce19c8bcc3d', path:'/articles', method:'GET', controller:'ArticlesController', action:'index', format:'html', status:'200', view:'110.23', db:'50.01', duration:'160.24'}, 
      views: [{"payload":{"identifier":"/Users/dejan/work/rors/app/views/layouts/application/_nav.html.haml"}, "time":"2012-11-25T16:53:11+01:00","transaction_id":"371131b57ce19c8bcc3d","end":"2012-11-25T16:53:11+01:00","duration":1.7429999999999999}, {"payload":{"identifier":"/Users/dejan/work/rors/app/views/layouts/application/_content.html.haml"},"time":"2012-11-25T16:53:11+01:00","transaction_id":"371131b57ce19c8bcc3d","end":"2012-11-25T16:53:11+01:00","duration":0.9600000000000001}],
      sqls: []
    },
    '5ec801dc01e98e8c50ba': {
      request: {transactionId:'5ec801dc01e98e8c50ba', path:'/articles/17', method:'PUT', controller:'ArticlesController', action:'update', format:'html', status:'200', view:'10.78', db:'250.10', duration:'260.88'},
      views: [],
      sqls: []
    }
  }
  

  $scope.requests = function() {
    return $scope.transactionKeys.map(function(n) {
      return $scope.transactions[n].request
    });
  }()
  
  $scope.activeKey = '371131b57ce19c8bcc3d'

  $scope.active = function() {
    return $scope.transactions[$scope.activeKey]
  }  

  $scope.setActive = function(transactionId) {
    console.log(transactionId);
    $scope.activeKey = transactionId;
  }

  $scope.activeRequest = $scope.active().request;
  $scope.activeViews = $scope.active().views;
  $scope.activeSqls = $scope.active().sqls;
}
