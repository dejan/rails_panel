
chrome.devtools.panels.create("Rails",
                              "assets/images/toolbarIcon.png",
                              "panel.html",
                              function(panel) { 
                                console.log("Panel created.");
                                var extensionId = chrome.i18n.getMessage('@@extension_id');
                                console.log("Extension ID: " + extensionId);
                                button = panel.createStatusBarButton("assets/images/clear.png", "Clear");
                                button.onClicked.addListener(function() {
                                  chrome.extension.sendMessage(extensionId, {}, function(response) {
                                  });
                                });
                              });

