
var blockedSites = [];  // array of blocked sites stored as strings

// helper function that loads blocked sites from cookies into blockedSites[]
function loadBlockedSites() {
    chrome.cookies.getAll({ url: "http://example.com/" }, function(cookies) {
        // if (cookies.length == 0) {
            blockedSites = [];
        // } 
        for (var i = 0; i < cookies.length; i++) {
            var cookieStr = JSON.stringify(cookies[i]);
            var obj = JSON.parse(cookieStr);
            var website = obj.name.substring(0, obj.name.length - 1).substr(1);
            if (!blockedSites.includes(website)) {
                blockedSites.push(website);
            }
        }
    });
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        loadBlockedSites();
        for (var i = 0; i < blockedSites.length; i++) {
            console.log(blockedSites[i]);
            var regex1 = RegExp(blockedSites[i], "i");
            var regex2 = RegExp(details.url, "i");
            if (regex1.test(details.url) || regex2.test(blockedSites[i])) {
                return {redirectUrl: chrome.runtime.getURL("blockedSite.html?website=" + blockedSites[i])};
            }
        }
    }, {
        urls: ["<all_urls>"], 
        types: ['main_frame', 'sub_frame']
    }, ["blocking"]);