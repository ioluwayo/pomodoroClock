/**
 * Created by ibukun on 11/21/2016.
**/
$(document).ready(function () {
    "use strict";
    // creating prototype datastructure with method to handle time formating
    function Pomodoro(sesionLength, breakLength) {
        this.sesionLength = sesionLength;
        this.breakLength = breakLength;
        this.timeformat = function (value) {
            var hours = parseInt(value / 3600),
            remainder = parseInt(value - hours * 3600),
            minutes = parseInt(remainder / 60);
            remainder = parseInt(remainder - minutes * 60);
            var seconds = parseInt(remainder);
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (hours < 10) {
                hours = "0" + hours;
            }
            return (hours + ":" + minutes + ":" + seconds);
        };
    }
    
    var Apomodoro = new Pomodoro(),
    sessionCountDown; // purposely made global
    $('#reset').hide(); // shouldnt be able to reset the timer before it starts
   
    /**
    onclick functions to set session and break times on click
    **/
    $('#session-minus').click(function () {
        var value = parseInt($('#session-length').val());
        if (value <= 1) {
            value = 2;
        }
        $('#session-length').val(value - 1);
    });
    
    $('#session-plus').click(function () {
        var value = parseInt($('#session-length').val());
        if (value >= 120) {
            value = 119; // decided to limit a session to 2 hours
        }
        $('#session-length').val(value + 1);
    });
    
    $('#break-minus').click(function () {
        var value = parseInt($('#break-length').val());
        if (value <= 1) {
            value = 2;
        }
        $('#break-length').val(value - 1);
    });
    
    $('#break-plus').click(function () {
        var value = parseInt($('#break-length').val());
        if (value >= 60) {
            value = 59; //decided to limit abreaks to an hour
        }
        $('#break-length').val(value + 1);
    });
    
    
    /**
    The follwing fucntiona handle to time logic.
    Once the start button is cliicked, the values in the session time
    and break time input tags are retrieved and stored in the prototype object.
    the start button is hidden and the reset button is revealed.
    a session count variable, breakcount variable and totaalcount variable are 
    initiated with the values retrieved also. all calculations are done in seconds, so the values are multiplied by 60.
    totalcount is the sume of break and session count.
    The session timer function will be called at fixed intervals(1s).
    everytime its called, it decrements the count variables starting with the 
    sessioncount and then the breakcount to complete a full cycle.
    The logic is such that the break commmences riht after the session elabse.
    The totalcount varable is the main control. while break and session count are the secondary controls. once all counts elapse, the function calls the reset function which stops the repeated calling u=of the sessiontimer function by clearing the interval method.
    **/
    
    
    $('#start').click(function () {
        Apomodoro.sesionLength = $('#session-length').val() * 60;
        Apomodoro.breakLength = $('#break-length').val() * 60;
        
        $('#start').hide();
        $('#reset').show();
        
        var sessionCount = Apomodoro.sesionLength,
        breakCount = Apomodoro.breakLength,
        totalCount = sessionCount + breakCount;
        
        function sessionTimer() {
            
            if (totalCount > 0) {
                // the cycle is not done yet
                if (totalCount > breakCount) {
                    //the sesson time is not done yet. because totalCount is greater than breakCount.
                    totalCount -= 1;
                    sessionCount -= 1;
                    $('#time').text(Apomodoro.timeformat(sessionCount));
                    $('#session-text').css('color', 'red');
                    //once the totalCount is equal to the breakCount then the session time is done and the break should begin
                    if (totalCount == breakCount+2) {
                        // this condtion plays the audio file a little early because the file is long.
                        $('#buzzer')[0].play();
                    }
                }
                //since the total count is not greater thsn the break count, then the sssion is done.
                //and the breakCount is now decreamented along with the totalCount.
                else {
                    // on break
                    breakCount -= 1;
                    totalCount -= 1;
                    $('#time').text(Apomodoro.timeformat(breakCount));
                    $('#break-text').css('color', 'red');
                    $('#session-text').css('color', 'white');
                }
            }
            //totalCount <= 0 so start over
            else {
                //re initialize the counters.
                $('#session-text').css('color', 'white');
                $('#break-text').css('color', 'white');
                sessionCount = Apomodoro.sesionLength,
                    breakCount = Apomodoro.breakLength,
                    totalCount = sessionCount + breakCount;            }
        }
        sessionCountDown = setInterval(sessionTimer, 1000); // interval method
        
    });
    
    
    $('#reset').click(function () {
        clearInterval(sessionCountDown);
        $('#session-text').css('color', 'white');
        $('#break-text').css('color', 'white');
        $('#start').show();
        $('#reset').hide();
        $('#session-length').val(25);
        $('#break-length').val(5);
        $('#time').text('00:25:00');
    });
});