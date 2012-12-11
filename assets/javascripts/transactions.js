function TransactionsCtrl($scope) {
  $scope.transactionKeys = [];
  $scope.requestsMap = {};  // {transactionKey: {...}, ... }
  $scope.exceptionsMap = {} // {transactionKey: {...}, ... }
  $scope.viewsMap = {};     // {transactionKey: [{...}, {...}], ... }
  $scope.sqlsMap = {};      // {transactionKey: [{...}, {...}], ... }
  
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

  $scope.activeException = function() {
    return $scope.exceptionsMap[$scope.activeKey];
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
      key = Math.floor(Math.random()*100000000); // TODO improve
      $scope.setActive(key);
      break;
    case "process_action.action_controller":
      key = $scope.activeKey;
      $scope.requestsMap[key] = data;
      $scope.transactionKeys.push(key);
      break;
    case "process_action.action_controller.exception":
      $scope.pushToMap($scope.exceptionsMap, data);
      $scope.exceptionsMap[key] = data;
      break;
    case "!render_template.action_view":
      $scope.pushToMap($scope.viewsMap, data);
      break;
    case "sql.active_record":
      $scope.pushToMap($scope.sqlsMap, data);
      break;
    default:
      console.log('Notification not supported:' + data.name);
    }
  }

  $scope.pushToMap = function(map, data) {
    key = $scope.activeKey;
    value = map[key];
    if (typeof value == 'undefined') {
      map[key] = [data];
    } else {
      value.push(data) 
    }
  }

}
