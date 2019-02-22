$(document).ready(function() {
    
    var urlParamWebsite = getUrlVars()['website'];
    var urlParamWebsite_JSONStr = JSON.stringify(urlParamWebsite);
    // alert(urlParamWebsite_JSONStr);
    $('.title').text(urlParamWebsite);
    chrome.cookies.get({"url": "http://example.com/", "name": urlParamWebsite_JSONStr}, function(cookie) {   
        alert(cookie.value);
        var cookieStr = JSON.stringify(cookie);
        var obj = JSON.parse(cookieStr);
        var expirationDate = obj.expirationDate;
        var difference = expirationDate - (new Date().getTime() / 1000);  // in seconds 


        $('ul.websitesList').append("<li class='liElmt'><h2><b class='websiteURL'>"
                                 + urlParamWebsite + "</b><br><div class='siteListTimer'><b>Time Left:" 
                                 + "\xa0\xa0\xa0" + "</b><b id='timerHour'></b> hr \xa0" 
                                 + "<b id='timerMin'></b> min \xa0" + "<b id='timerSec'></b> sec" + "</div></h2></li>");
        createTimer(difference);
    });
    // INVESTIGATE: cookie is not being set correctly? the name has quotations included??



    var timers = [];  // array to keep track of timers, since setInterval() runs on a different thread and persists after caller function is finished
    function createTimer(difference) {
        var hour;
        var minute;
        var second;
        function setTime() {
            if (--difference) {
                hour = Math.floor(difference / 3600);
                minute = Math.floor((difference % 3600) / 60);
                second = Math.floor(difference % 60);
                $('#timerHour').text(hour);
                $('#timerMin').text(minute);
                $('#timerSec').text(second);
            }
        }
        setTime();
        setInterval(setTime, 1000);
    }

});



// FROM: http://jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
    // functions that get URL params and returns an associative array if calling getUrlVars()
    // Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}