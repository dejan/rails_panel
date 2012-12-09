function TransactionsCtrl($scope) {
  $scope.transactionKeys = [];
  $scope.requestsMap = {}; // {transactionKey: {...}, ... }
  $scope.viewsMap = {};    // {transactionKey: [{...}, {...}], ... }
  $scope.sqlsMap = {};     // {transactionKey: [{...}, {...}], ... }
  
  $scope.requests = function() {
    return $scope.transactionKeys.map(function(n) {
      request = $scope.requestsMap[n];
      request.key = n;
      return request;
    });
  }
  
  $scope.activeKey = null;

  $scope.activeViews = function() {
    return $scope.viewsMap[$scope.activeKey];
  }

  $scope.activeSqls = function() {
    return $scope.sqlsMap[$scope.activeKey];
  }

  $scope.setActive = function(transactionId) {
    $scope.activeKey = transactionId;
  }

  $scope.getClass = function(transactionId) {
    if (transactionId == $scope.activeKey) {
      return 'selected';
    } else {
      return '';
    }
  }

  $scope.parseNotification = function(data) {
    switch(data.name) {
    case "start_processing.action_controller":
      key = Math.floor(Math.random()*100000000);
      $scope.setActive(key);
      break;
    case "process_action.action_controller":
      key = $scope.activeKey;
      $scope.requestsMap[key] = data;
      $scope.transactionKeys.push(key);
      break;
    case "render_template.action_view":
      key = $scope.activeKey; // data.transaction_id
      value = $scope.viewsMap[key];
      if (typeof value == 'undefined') {
        $scope.viewsMap[key] = [data];
      } else {
        value.push(data) 
      }
      break;
    case "sql.active_record":
      key = $scope.activeKey; // data.transaction_id
      value = $scope.sqlsMap[key];
      if (typeof value == 'undefined') {
        $scope.sqlsMap[key] = [data];
      } else {
        value.push(data);
      }
      break;
    default:
      console.log('Notification not supported:' + data.name);
    }
  }

}
