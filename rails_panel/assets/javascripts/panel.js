var mockDataIndex = 0;
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
    this.addData(mockDataIndex + 1, scope, mockTransactions1());
    this.addData(mockDataIndex + 2, scope, mockTransactions2());
    this.addData(mockDataIndex + 3, scope, mockTransactions3());
    this.addData(mockDataIndex + 4, scope, mockTransactions4());
    mockDataIndex = mockDataIndex + 4;

    // Simulate new requests coming in every couple of seconds
    panel.mockDataTimer(scope);
  },

  mockDataTimer: function(scope) {
    setTimeout(
      function() { panel.addMockData(scope) },
      5000
    );
  }
};

