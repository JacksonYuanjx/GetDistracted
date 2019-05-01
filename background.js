
// function redirect(requestDetails) {
//     // alert("true");
//     var blockedSites = [];
//     chrome.cookies.getAll({ url: "http://example.com/" }, function(cookies) {
//         for (var i = 0; i < cookies.length; i++) {
//             var cookieStr = JSON.stringify(cookies[i]);
//             var obj = JSON.parse(cookieStr);
//             var website = obj.name.substring(0, obj.name.length - 1).substr(1);
//             // alert(website);
//             // if (website == requestDetails.url) {
//             //     return {
//             //         redirectUrl: "https://www.google.ca"
//             //     };
//             // }
//             // return {
//             //     redirectUrl: "https://www.google.ca"
//             // };
//             var regex1 = RegExp(".*" + website + ".*");
//             if (regex1.test(requestDetails.url)) {
//                 alert("true");
//             } else {
//                 alert("false");
//             }
//             // blockedSites.push(website); 
//         }
//         // alert(blockedSites[1]);
//         // if (blockedSites.includes(requestDetails.url)) {
//         //     window.post('blockedSite.html', requestDetails.url, function(data) {
//         //         // alert(data);
//         //         // var tab = window.open('blockedSite.html', '_blank');
//         //         var tab = window.open('blockedSite.html?website=' + requestDetails.url, '_blank');
//         //     });
//         //     // return {
//         //     //     // redirectUrl: "blockedSite.html?website=" + requestDetails.url
//         //     //     redirectUrl: "https://www.google.ca",
//         //     // };
//         // }
//     });
// }

// chrome.webRequest.onBeforeRequest.addListener(
//     redirect,
//     {urls: ["<all_urls>"]},
//     ["blocking"]
// );

var blockedSites = [];  // array of blocked sites stored as strings

// helper function that loads blocked sites from cookies into blockedSites[]
function loadBlockedSites() {
    chrome.cookies.getAll({ url: "http://example.com/" }, function(cookies) {
        if (cookies.length == 0) {
            blockedSites = [];
        }
        for (var i = 0; i < cookies.length; i++) {
            // alert(i);
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
        // console.log(details.url);
        // if (!details.url.startsWith('http://time.com/')) {
        //     return {redirectUrl: 'http://time.com'};
        // }
        loadBlockedSites();
        for (var i = 0; i < blockedSites.length; i++) {
            console.log(blockedSites[i]);
            var regex1 = RegExp(".*" + blockedSites[i] + ".*");
            if (regex1.test(details.url)) {
                // alert(details.url);
                // CURRENT BUG: redirecting only works after the first time???
                return {redirectUrl: chrome.runtime.getURL("blockedSite.html?website=" + blockedSites[i])};
                // chrome.tabs.query({active:true, windowType:"normal", currentWindow: true}, function(tabsArray) {
                //     chrome.tabs.remove(tabsArray[0].id, function() {
                //         window.open('blockedSite.html?website=' + website, '_blank');
                //     });
                // });
                // return;
                // return {redirectUrl: chrome.runtime.getURL("blockedSite.html")};   // doesn't work for some reason?
            } else {
                // alert("false");
                // return;
            }
        }
    }, {
        urls: ["<all_urls>"], 
        types: ['main_frame', 'sub_frame']
    }, ["blocking"]);