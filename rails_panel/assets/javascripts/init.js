$(function() {
  
  // Initializes UI
  //
  var uiInit = function () {
    $('#tabs').tabs();
    $('.stupidtable').stupidtable(); 
    dividers.init();
  };

  // Checks if the panel is in the standalone (mock data) mode 
  //
  var isStandaloneMode = function() {
    return typeof chrome.devtools == 'undefined';
  };
  
  // get the scope
  //
  var scope = angular.element('.split-view').scope();

  // 
  // Here we go ...
  // 

  uiInit();
  key('⌘+k, ctrl+l', function(){ panel.clearData(scope) });

  new TransactionsCtrl(scope);   // wire angular controller

  if (isStandaloneMode()) {      // add mock data if standalone ...
    panel.addMockData(scope);
  } else {                       // ... or bind a listener for incoming requests
    requests.bindListener(scope);
  }

});

