function TransactionsCtrl($scope) {

  $scope.transactionKeys   = [];
  $scope.requestsMap       = {}; // {transactionKey: {...}, ... }
  $scope.exceptionCallsMap = {}; // {transactionKey: {...}, ... }
  $scope.logsMap           = {}; // {transactionKey: [{...}, {...}], ... }
  $scope.viewsMap          = {}; // {transactionKey: [{...}, {...}], ... }
  $scope.paramsMap         = {}; // {transactionKey: [{...}, {...}], ... }
  $scope.sqlsMap           = {}; // {transactionKey: [{...}, {...}], ... }
  
  $scope.requests = function() {
    return $scope.transactionKeys.map(function(n) {
      request = $scope.requestsMap[n];
      request.key = n;
      return request;
    });
  }
  
  $scope.activeKey = null;

  $scope.clear = function() {
    $scope.transactionKeys = [];
    $scope.requestsMap = {};
    $scope.logsMap = {};
    $scope.exceptionCallsMap = {};
    $scope.viewsMap = {};
    $scope.paramsMap = {};
    $scope.sqlsMap = {};
    $scope.activeKey = null;
  }

  $scope.activeViews = function() {
    return $scope.viewsMap[$scope.activeKey];
  }

  $scope.activeSqls = function() {
    return $scope.sqlsMap[$scope.activeKey];
  }

  $scope.activeParams = function() {
    return $scope.paramsMap[$scope.activeKey];
  }

  $scope.activeLog = function() {
    return $scope.logsMap[$scope.activeKey];
  }

  $scope.activeExceptionCalls = function() {
    return $scope.exceptionCallsMap[$scope.activeKey];
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

  $scope.parseNotification = function(key, data) {
    switch(data.name) {
    case "process_action.action_controller":
      data.durationRounded = function() {
        return data.duration ? data.duration.round() : 0;
      }();
      data.payload.dbRuntimeRounded = function() {
        return data.payload.db_runtime ? data.payload.db_runtime.round() : 0;
      }();
      data.payload.viewRuntimeRounded = function() {
        return data.payload.view_runtime ? data.payload.view_runtime.round() : 0;
      }();
      data.payload.otherRuntimeRounded = function() {
        return data.durationRounded - data.payload.dbRuntimeRounded - data.payload.viewRuntimeRounded;
      }();
      $scope.requestsMap[key] = data;
      Object.keys(data.payload.params).each(function(n) { 
        $scope.pushToMap($scope.paramsMap, key, {name:n, value:data.payload.params[n]});
      });
      $scope.transactionKeys.push(key);
      $scope.setActive(key);
      break;
    case "process_action.action_controller.exception":
      $scope.pushToMap($scope.exceptionCallsMap, key, data);
      break;
    case "render_template.action_view":
      $scope.pushToMap($scope.viewsMap, key, data);
      break;
    case "render_partial.action_view":
      $scope.pushToMap($scope.viewsMap, key, data);
      break;
    case "meta_request.log":
      $scope.pushToMap($scope.logsMap, key, data);
      break;
    case "sql.active_record":
      if (data.payload.name !== "SCHEMA") {
        $scope.pushToMap($scope.sqlsMap, key, data);
      }
      break;
    default:
      console.log('Notification not supported:' + data.name);
    }
  }

  $scope.pushToMap = function(map, key, data) {
    var value = map[key];
    if (typeof value == 'undefined') {
      map[key] = [data];
    } else {
      value.push(data) 
    }
  }

}
