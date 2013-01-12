
chrome.devtools.panels.create("RailsPanel",
                              "assets/images/toolbarIcon.png",
                              "panel.html",
                              function(panel) { 
                                console.log("Panel created.");
                                button = panel.createStatusBarButton("assets/images/clear.png", "Clear");
                                button.onClicked.addListener(function() {
                                  chrome.extension.sendMessage('kffdbfpgejbmghnnenkbjfidmagdhbaf', {greeting: "hello"}, function(response) {
                                  });
                                });
                              });

