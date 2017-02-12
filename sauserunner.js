var MochaSauce = require("mocha-sauce");
var uuid = require("uuid/v4");

// configure
var sauce = new MochaSauce({
    name: "pygame.sk", // your project name
    username: "albertjan", // Sauce username
    accessKey: "38ad6ff9-a776-47d6-9f93-4afa0d865e1b", // Sauce access key
    host: "localhost", // or http://ondemand.sauce.com if not using Sauce Connect
    port: 4445, // 80
    // the test url
    build: uuid(),
    url: "http://localhost:3030/tests-saucelabs.html" // point to the site running your mocha tests
});

// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 7" });
sauce.browser({ browserName: "internet explorer", platform: "Windows 7", version: "10.0" });
sauce.browser({ browserName: "firefox", platform: "Windows 7" });
sauce.browser({ browserName: "chrome", platform: "macOS 10.12" });
sauce.browser({ browserName: "safari", platform: "macOS 10.12" });
sauce.browser({ browserName: "firefox", platform: "macOS 10.12" });
sauce.browser({ browserName: "MicrosoftEdge", platform: "Windows 10" });

sauce.on('init', function(browser) {
  console.log('  init : %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('  start : %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
});

sauce.start();