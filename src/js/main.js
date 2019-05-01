$(document).ready(function () { // must put in "$(document).ready()" because this will wait for all html elements to load first, can also do $(function())

    
// *****         FUNCTIONS FOR THE TABS        ******
	// Variables
	var clickedTab = $(".tabs > .active");
	var tabWrapper = $(".tab_content");
	var activeTab = tabWrapper.find(".active");
	var activeTabHeight = activeTab.outerHeight();

	// Show tab on page load
	activeTab.show();

	// Set height of wrapper on page load
	tabWrapper.height(activeTabHeight);

	$(".tabs > li").on("click", function () {

		// Remove class from active tab
		$(".tabs > li").removeClass("active");

		// Add class active to clicked tab
		$(this).addClass("active");

		// Update clickedTab variable
		clickedTab = $(".tabs .active");

		// fade out active tab
		activeTab.fadeOut(250, function () {

			// Remove active class all tabs
			$(".tab_content > li").removeClass("active");

			// Get index of clicked tab
			var clickedTabIndex = clickedTab.index();

			// Add class active to corresponding tab
			$(".tab_content > li").eq(clickedTabIndex).addClass("active");

			// update new active tab
			activeTab = $(".tab_content > .active");

			// Update variable
			activeTabHeight = activeTab.outerHeight();

			// Animate height of wrapper to new tab height
			tabWrapper.stop().delay(50).animate({
				height: activeTabHeight },
			500, function () {

				// Fade in active tab
				activeTab.delay(50).fadeIn(250);

			});
                  
		});    
	});
    
    
	var colorButton = $(".colors li");

	colorButton.on("click", function () {

		// Remove class from currently active button
		$(".colors > li").removeClass("active-color");

		// Add class active to clicked button
		$(this).addClass("active-color");

		// Get background color of clicked
		var newColor = $(this).attr("data-color");

		// Change background of everything with class .bg-color
		$(".bg-color").css("background-color", newColor);

		// Change color of everything with class .text-color
		$(".text-color").css("color", newColor);
	});
    
    
    
    
// *****        FUNCTION FOR RANGE SLIDER        ******
    
    $('.range_slider').on('mouseup', function() {
        var sliderValue = $('.range_slider_range').val();

        //    $('#intermediate').removeClass('activeOption');
        //    $('.range_labels').css("background-color", "blue");

        //        alert(sliderValue);
        $('.range_labels > .activeOption').removeClass('activeOption');

        switch(sliderValue) {
            case "100":   
                $('#basic').addClass('activeOption');
                break;
            case "200":
                $('#intermediate').addClass('activeOption');
                break;
            case "300":
                $('#advanced').addClass('activeOption');
                break;
        }                                    
    });
    
    
// *****         FUNCTION FOR TIMER       ******
    // function that corrects the timer options if user selected special cases
    $(".form-control").on("change", function() {
        // "$(this).val()" is the value of the option selected from whichever select drop-down user clicked
        if ($(this).val() == '-1') {
            // selected 'no timer' option on .hour, changing .minute to 'no timer' option as well
            $(".minute").find('option[value="-2"]').prop('selected', true);
        } else if ($(this).val() == '-2') {
            // selected 'no timer' option on .minute, changing .hour to 'no timer' option as well
            $(".hour").find('option[value="-1"]').prop('selected', true);
        } else if ($(this).val() != '-1' && $('.minute').val() == '-2') {
            // 'no timer' on both selectors, .hour is changed to other val, change .minute to 'Minute'
            $(".minute").find('option[value="Minute"]').prop('selected', true);
        } else if ($(this).val() != '-2' && $('.hour').val() == '-1') {
            // 'no timer' on both selectors, .minute is changed to other val, change .hour to 'Hour'
            $(".hour").find('option[value="Hour"]').prop('selected', true);
        }
    });
    

    // function from: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    function isValidURL(string) {
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if (res == null) {
            return false;
        } else {
            return true;
        }
    };

    // set of brute force functions to check if URL str is valid
    function checkEndsWith(str) {
        return str.endsWith(".com") || str.endsWith(".ca") || str.endsWith(".com/") || str.endsWith(".ca/") 
            || str.endsWith(".org") || str.endsWith(".org/") || str.endsWith(".net") || str.endsWith(".net/")
            || str.endsWith(".int") || str.endsWith(".int/") || str.endsWith(".edu") || str.endsWith(".edu/")
            || str.endsWith(".gov") || str.endsWith(".gov/") || str.endsWith(".io") || str.endsWith(".io/")
            || str.endsWith(".co") || str.endsWith(".co/") || str.endsWith(".site") || str.endsWith(".site/")
            || str.endsWith(".tech") || str.endsWith(".tech/") || str.endsWith(".ai") || str.endsWith(".ai/");
    }
    function checkStartsWith(str) {
        // must start with https://www. in order for redirecting to work in blockedSite.js and maintain consistency
        return str.startsWith("https://www.");
    }
    function validURL(str) {
        return checkEndsWith(str) && checkStartsWith(str);
    }

    
    // Helper function that checks if all form fields have been completed
    function allFieldsComplete(website, difficulty, hour, minute) {
        if (website == '') {
            $('.missingBlankPrompt').find('span').text('website not inputted');
            $('.missingBlankPrompt').removeClass('hide');
            return false;
        } 
        
        if (!validURL(website)) {
            $('.missingBlankPrompt').find('span').text('please input valid URL in SPECIFIED FORMAT (e.g https://www.youtube.com)');
            $('.missingBlankPrompt').removeClass('hide');
            return false;
        }

        if (hour == 'Hour') {
            $('.missingBlankPrompt').find('span').text('hour not selected');
            $('.missingBlankPrompt').removeClass('hide');
            return false;
        }
        
        if (minute == 'Minute') {
            $('.missingBlankPrompt').find('span').text('minute not selected');
            $('.missingBlankPrompt').removeClass('hide');
            return false;
        }
        
        // hide missingBlankPrompt if all inputs are filled
        $('.missingBlankPrompt').addClass('hide');
        return true;
    }
    
    // function that prevents form submission on 'enter' key press for .siteToBlock input
    $('.siteToBlock').keydown(function(event) {
        var website = $('.siteToBlock').val();
        var difficulty = $('.activeOption').text();
        var hour = $('.hour').val();
        var minute = $('.minute').val();
        
        if (event.keyCode == 13) {
            event.preventDefault();
            allFieldsComplete(website, difficulty, hour, minute);
            // if (allFieldsComplete(website, difficulty, hour, minute) == false) {
            //     $('.missingBlankPrompt').find('span').text('website not inputted');
            //     $('.missingBlankPrompt').removeClass('hide');
            //     return false;
            // }
        }
    });
    
    // Helper function that returns a promise for the asynchronous callback of cookies.getAll 
    // to allow search for website through cookies to complete before function terminates
    // Note: w/o a promise, the async callback will only complete after everything else in the 
    //       caller function has executed
    function hasWebsiteBeenEntered(website) {
        return new Promise(function(resolve, reject) {
            chrome.cookies.getAll({ url: "http://example.com/" }, function(cookies) {
                for (var n = 0; n < cookies.length; n++) {
                    var cookieStr = JSON.stringify(cookies[n]);
                    var obj = JSON.parse(cookieStr);
                    var website_temp = obj.name.substring(0, obj.name.length - 1).substr(1);
                    // must use regex b/c URL could have preceding/trailing components
                    // creating 2 RegExp objs to consider both cases where form input is either longer/shorter than value in cookie
                    var regex_website_temp = new RegExp(website_temp, "i");  
                    var regex_website = new RegExp(website, "i");
                    if (regex_website_temp.test(website) || regex_website.test(website_temp)) {
                        alert("website entered 1");
                        resolve(true);
                        $('.missingBlankPrompt').find('span').text('website has already been entered!');
                        $('.missingBlankPrompt').removeClass('hide');
                        return;
                    }
                }
                resolve(false);
                return;
            }); 
        });

        // promise.then(function(result) {
        //     // promise is sucessful (resolved condition)
        //     alert("result is " + result);
        //     return result;
        // }).catch(function(error) {
        //     // promise is unsuccessful (rejected condition)
        //     alert("catch statement " + result);
        //     return false;
        // })
        
        // var getCookiesCallback = function(cookies) {
        //     return new Promise(function(resolve, reject) {
        //         for (var i = 0; i < cookies.length; i++) {
        //             var cookieStr = JSON.stringify(cookies[i]);
        //             var obj = JSON.parse(cookieStr);
        //             var website_temp = obj.name.substring(0, obj.name.length - 1).substr(1);
        //             var regex_website = RegExp(".*" + website + ".*");  // must use regex b/c url could have preceding/trailing components 
        //             if (regex_website.test(website_temp)) {
        //                 alert("website entered 1");
        //                 websiteExists = true;
        //             }
        //         }
        //         if (websiteExists) {
        //             resolve();
        //         } else {
        //             reject(Error("Retrieving cookies failed"));
        //         } 
        //     });
        // }
        // chrome.cookies.getAll({ url: "http://example.com/" }, function(cookies) {
        //     getCookiesCallback(cookies);
        // });
        // return websiteExists;
    }

    // Function that executes when form submit btn is clicked, will set cookies with details from form
    $('.focusBtn').on('click', function() {
        
        var website = $('.siteToBlock').val();
        var difficulty = $('.activeOption').text();
        var hour = $('.hour').val();
        var minute = $('.minute').val();
        if (!allFieldsComplete(website, difficulty, hour, minute)) {
            return;
        } 
        // using function returned promise to check if website has been entered already
        // if not, then submit form, o.w. return
        hasWebsiteBeenEntered(website).then(function(result) { 
            if (!result) {
                // if all inputs are filled & website has not been entered, submit and save form inputs into cookies
                var dataset = { "website": website, 
                                "difficulty": difficulty, 
                                "hour": hour, 
                                "minute": minute };
                var cookie_str = JSON.stringify(dataset);
                var website_str = JSON.stringify(website);
                //        var obj = {}
                //        setCookie(website, cookie_str, '365');

                var currentTime = new Date().getTime() / 1000;    // currentTime in seconds
                var timerLength = (hour * 3600) + (minute * 60);  // timerLength in seconds
                var expirationDate;

                //         if (hour == '-1' || minute == '-2') {
                //             // 'Until Problem Solved' option selected, set expirationDate to 12 months from now
                // //            alert('selected');
                //             expirationDate = currentTime + 31540000;
                //         } else {
                // otherwise, set expirationDate to length of timer
                //            alert('else case');
                expirationDate = currentTime + timerLength;   // set expirationDate to length of timer
                //            alert(currentTime);
                //            alert(timerLength); 
                //            alert(expirationDate); 
                // }
                chrome.cookies.set({ url: "http://example.com/", name: website_str, value: cookie_str, expirationDate: expirationDate});     // expirationDate starts from UNIX epoch time
                // NOTE: investigate expiration date setting of this function; why not use setCookie() defined at bottom?
                location.reload();  // refreshes the page
            } else {
                // alert("website already entered!");
                return;
            }
        });
        // alert(websiteEntered);
        // alert("line before check");
        // if (websiteEntered) {
        //     alert("GOAL");
        //     return;
        // }
        // alert("line after hasWebsiteBeenEntered");
  
    });
    
    

    var timers = [];  // array to keep track of timers, since setInterval() runs on a different thread and persists after caller function is finished
    function createTimer(difference, i) {
        var hour;
        var minute;
        var second;
        function setTime() {
            if (--difference) {
                hour = Math.floor(difference / 3600);
                minute = Math.floor((difference % 3600) / 60);
                second = Math.floor(difference % 60);
                $('#timerHour' + i).text(hour);
                $('#timerMin' + i).text(minute);
                $('#timerSec' + i).text(second);
            }
        }
        setTime();  // call once first to prevent initial delay in displaying time
        timers[i] = setInterval(setTime, 1000);
    }
    
    
    // load blocked websites from cookies on page load
    chrome.cookies.getAll({ url: "http://example.com/" }, function(cookies) {
        for (var i = 0; i < cookies.length; i++) {
            var cookieStr = JSON.stringify(cookies[i]);
            var obj = JSON.parse(cookieStr);
            var expirationDate = obj.expirationDate;
            var difference = expirationDate - (new Date().getTime() / 1000);  // in seconds 
            var website = obj.name.substring(0, obj.name.length - 1).substr(1);
            $('ul.websitesList').append("<li class='liElmt'><h2><b class='websiteURL'>" + website + "</b><br><div class='siteListTimer'><b>Time Left:" + "\xa0\xa0\xa0" + "</b><b id='timerHour" + i + "'></b> hr \xa0" + "<b id='timerMin" + i + "'></b> min \xa0" + "<b id='timerSec" + i + "'></b> sec" + "</div></h2></li>");
            createTimer(difference, i);
        }
    });
    
    
    $('.inputTab').on('click', function() {
        chrome.cookies.getAll({ url: "http://example.com/" }, function(cookies) {
            for (var i = 0; i < cookies.length; i++) {
                window.clearInterval(timers[i]);
            }
        });
    });
    
    
    // monitor if user has navigated onto mainTab (first tab), then load cookies 
    $('.mainTab').on('click', function() {
//        alert('first tab clicked')
        $('ul.websitesList').empty();  // clear list of websites before rendering cookies
//            window.clearInterval(timers[i]);
        chrome.cookies.getAll({ url: "http://example.com/" }, function(cookies) {
            for (var i = 0; i < cookies.length; i++) {
                clearInterval(timers[i]);  // clear timer before creating new one again
                
                var cookieStr = JSON.stringify(cookies[i]);
                var obj = JSON.parse(cookieStr);
                var expirationDate = obj.expirationDate;
                var difference = expirationDate - (new Date().getTime() / 1000);  // in seconds 
                var website = obj.name.substring(0, obj.name.length - 1).substr(1);
//                    alert(cookies.length);
                $('ul.websitesList').append("<li class='liElmt'><h2><b class='websiteURL'>" + website + "</b><br><div class='siteListTimer'><b>Time Left:" + "\xa0\xa0\xa0" + "</b><b id='timerHour" + i + "'></b> hr \xa0" + "<b id='timerMin" + i + "'></b> min \xa0" + "<b id='timerSec" + i + "'></b> sec" + "</div></h2></li>");
                createTimer(difference, i); 
            }
        });

    });
    
    // monitor if blocked website list elmt has been clicked
    // if clicked, redirect to blocked site page w/ timer
    $('.websitesList').on('click', 'li.liElmt', function() {
        var website = $(this).find('.websiteURL').text();
        $.post('blockedSite.html', website, function(data) {
                // var tab = window.open('blockedSite.html', '_blank');
                window.open('blockedSite.html?website=' + website, '_blank');
        });
            // URL params: https://stackoverflow.com/questions/5998425/url-format-with-get-parameters
            // window.open('blockedSite.html?website=' + website, '_blank');
    });


    // IMPLEMENT url mandatory input or smth and auto fill 'http'
    // enter url, when hit enter, the missingPrompt still retains...
    // long website names pushing the timer indicator out of the list element box
    
    // the most recent added cookie's time is displayed across all li elements
    // b/c using the same class to insert, fix css or classing
});



// *****         FUNCTIONS FOR COOKIES        ******  
// code taken from: https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}



    // monitor if user has navigated onto mainTab, then load cookies 
//    clickedTab.click(function() {
//        if ($(clickedTab.hasClass('.mainTab'))) {
//            alert('first tab clicked')
//            $('ul.websitesList').empty();  // clear list of websites before rendering cookies
////            window.clearInterval(timers[i]);
//            chrome.cookies.getAll({ url: "http://example.com/" }, function(cookies) {
//                for (var i = 0; i < cookies.length; i++) {
//                    var cookieStr = JSON.stringify(cookies[i]);
//                    var obj = JSON.parse(cookieStr);
//                    var expirationDate = obj.expirationDate;
//                    var difference = expirationDate - (new Date().getTime() / 1000);  // in seconds 
//                    var website = obj.name.substring(0, obj.name.length - 1).substr(1);
////                    alert(cookies.length);
//                    $('ul.websitesList').append("<li><h2><b class='websiteURL'>" + website + "</b><br /><div class='siteListTimer'><b>Time Left:" + "\xa0\xa0\xa0" + "</b><b id='timerHour" + i + "'></b> hr \xa0" + "<b id='timerMin" + i + "'></b> min \xa0" + "<b id='timerSec" + i + "'></b> sec" + "</div></h2></li>");
////                    createTimer(difference, i); 
//                }
//            });
//        }
//    });
    