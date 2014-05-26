var panel = {

  clearData: function(scope) {
    scope.$apply(function() {
      scope.clear();
    });
  },

  addData: function(requestId, scope, data) {
    data.each(function(n) { 
      scope.$apply(function() {
        scope.parseNotification(requestId, n);
      }); 
    });
  },

  addMockData: function(scope) {
    this.addData('1', scope, mockTransactions1());
    this.addData('2', scope, mockTransactions2());
    this.addData('3', scope, mockTransactions3());
    this.addData('4', scope, mockTransactions4());
  }
  
};

