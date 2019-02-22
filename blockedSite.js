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
        Countdown.init(difference);
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


    // COUNTDOWN ANIMATION/DESIGN FROM: https://codepen.io/doriancami/pen/jEJvaV
        // Create Countdown
    var Countdown = {
    
        // Backbone-like structure
        $el: $('.countdown'),
        
        // Params
        countdown_interval: null,
        total_seconds     : 0,
        
        // Initialize the countdown  
        init: function(difference) {

            var hour = Math.floor(difference / 3600);
            var minute = Math.floor((difference % 3600) / 60);
            var second = Math.floor(difference % 60);   
        // DOM
        this.$ = {
            hours  : this.$el.find('.bloc-time.hours .figure'),
            minutes: this.$el.find('.bloc-time.min .figure'),
            seconds: this.$el.find('.bloc-time.sec .figure'),
        };
    
        // Init countdown values (modified)
        this.values = {
            hours  : hour,
            minutes: minute,
            seconds: second,
            // hours  : this.$.hours.parent().attr('data-init-value'),
            // minutes: this.$.minutes.parent().attr('data-init-value'),
            // seconds: this.$.seconds.parent().attr('data-init-value'),
        };
        
        // Initialize total seconds
        // this.total_seconds = this.values.hours * 60 * 60 + (this.values.minutes * 60) + this.values.seconds;
        this.total_seconds = difference + 2;   // ~ 2 seconds off, so add 3 sec

        // Animate countdown to the end 
        this.count();    
        },
        
        count: function() {
        
            // var hour = Math.floor(difference / 3600);
            // var minute = Math.floor((difference % 3600) / 60);
            // var second = Math.floor(difference % 60);    
            // var hour_1 = 0, 
            //     hour_2 = 0, 
            //     min_1 = 0, 
            //     min_2 = 0, 
            //     sec_1 = 0, 
            //     sec_2 = 0,
            //     temp = 0;

            // if (hour < 10) {
            //     hour_2 = hour;
            // } else {
            //     hour_1 = 1;  // b/c extension only allows max 12 hrs so max of first digit is '1'
            //     hour_2 = hour - 10;
            // }

            // if (minute < 10) {
            //     min_2 = minute;
            // } else {
            //     temp = minute;
            //     while (temp >= 10) {
            //         temp /= 10;
            //     }  // on loop completion: temp holds the first digit
            //     min_1 = temp;
            //     min_2 = minute % 10;  // returns last digit of 'minute'
            // }

            // if (second < 10) {
            //     sec_2 = second;
            // } else {
            //     temp = second;
            //     while (temp >= 10) {
            //         temp /= 10;
            //     }  // on loop completion: temp holds first digit
            //     sec_1 = temp;
            //     sec_2 = second % 10;
            // }
            // alert(hour_1);
            // alert(hour_2);

        var that    = this,
            $hour_1 = this.$.hours.eq(0),
            $hour_2 = this.$.hours.eq(1),
            $min_1  = this.$.minutes.eq(0),
            $min_2  = this.$.minutes.eq(1),
            $sec_1  = this.$.seconds.eq(0),
            $sec_2  = this.$.seconds.eq(1);
        
            this.countdown_interval = setInterval(function() {
    
            if(that.total_seconds > 0) {
    
                --that.values.seconds;              
    
                if(that.values.minutes >= 0 && that.values.seconds < 0) {
    
                    that.values.seconds = 59;
                    --that.values.minutes;
                }
    
                if(that.values.hours >= 0 && that.values.minutes < 0) {
    
                    that.values.minutes = 59;
                    --that.values.hours;
                }
    
                // Update DOM values
                // Hours
                that.checkHour(that.values.hours, $hour_1, $hour_2);
    
                // Minutes
                that.checkHour(that.values.minutes, $min_1, $min_2);
    
                // Seconds
                that.checkHour(that.values.seconds, $sec_1, $sec_2);
    
                --that.total_seconds;
            }
            else {
                clearInterval(that.countdown_interval);
            }
        }, 1000);    
        },
        
        animateFigure: function($el, value) {
        
        var that         = this,
            $top         = $el.find('.top'),
            $bottom      = $el.find('.bottom'),
            $back_top    = $el.find('.top-back'),
            $back_bottom = $el.find('.bottom-back');
    
        // Before we begin, change the back value
        $back_top.find('span').html(value);
    
        // Also change the back bottom value
        $back_bottom.find('span').html(value);
    
        // Then animate
        TweenMax.to($top, 0.8, {
            rotationX           : '-180deg',
            transformPerspective: 300,
                ease                : Quart.easeOut,
            onComplete          : function() {
    
                $top.html(value);
    
                $bottom.html(value);
    
                TweenMax.set($top, { rotationX: 0 });
            }
        });
    
        TweenMax.to($back_top, 0.8, { 
            rotationX           : 0,
            transformPerspective: 300,
                ease                : Quart.easeOut, 
            clearProps          : 'all' 
        });    
        },
        
        checkHour: function(value, $el_1, $el_2) {
        
        var val_1       = value.toString().charAt(0),
            val_2       = value.toString().charAt(1),
            fig_1_value = $el_1.find('.top').html(),
            fig_2_value = $el_2.find('.top').html();
            
        if(value >= 10) {
    
            // Animate only if the figure has changed
            if(fig_1_value !== val_1) this.animateFigure($el_1, val_1);
            if(fig_2_value !== val_2) this.animateFigure($el_2, val_2);
        }
        else {
    
            // If we are under 10, replace first figure with 0
            if(fig_1_value !== '0') this.animateFigure($el_1, 0);
            if(fig_2_value !== val_1) this.animateFigure($el_2, val_1);
        }    
        }
    };
    
    // Let's go !
    // Countdown.init();


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