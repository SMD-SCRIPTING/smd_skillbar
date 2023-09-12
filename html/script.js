$(document).ready(function(){
    window.addEventListener('message', function(event){
        var action = event.data.action;
        switch(action) {
            case "start":
                StartGame(event.data);
                break;
            case "stop":
                StopGame();
                break;
            case "check":
                CheckGame(event.data);
                break;
        }
    });

    var GamesPlayed = 0;
    StartGame = function(data) {
        $(".button").css({"right": data.position + "%"});
        $(".button").css({"width": data.width + "%"});
        $(".container").fadeIn('fast', function() {
            $(".thing").stop().css({"width": 0}).animate({width: '100%'}, {
                duration: parseInt(data.time),
                easing: 'linear',
                complete: function() {
                    $(".button").css({"background-color": "rgba(180, 0, 0, 0.9)"});
                    $(".thing").stop();
                    $(".container").fadeOut('fast', function() {
                        $(".thing").css("width", 0);
                        $(".button").css({"background-color": "rgba(65, 65, 65, 0.5)"});
                        $( ".container2" ).animate({opacity: 1,}, 1000);
                        $(".icon").html(`<i class=\"fa-sharp fa-solid fa-xmark\" style=\"color:red\"></i>`);
                        $( ".container2" ).animate({opacity: 0,}, 1000);
                        $.post('http://smd_skillbar/check', JSON.stringify({success: false}));
                        GamesPlayed = 0;
                    });
                }
            });
        });
    }
    
    StopGame = function() {
        $(".container").fadeOut('fast', function() {
            $(".thing").css("width", 0);
        })
    }

    CheckGame = function(data) {
        $(".icon").html(`<i class=\"fa-solid fa-bars-progress\" style=\"color:green\"></i>`);
        var Percentage = (($(".thing").width() / $(".container").width()) * 100);
        var Check = 100 - data.data.position
        var Minimum = Check - (data.data.width) - 5
        var GamesWanted = data.data.games

        $(".thing").stop();
        if (Percentage + 2 >= Minimum && Percentage - 2 <= Check) {
            $(".button").css({"background-color": "rgba(0, 150, 15, 0.9)"});
            GamesPlayed++;

            if (GamesWanted === GamesPlayed) {
                $( ".container2" ).animate({opacity: 1,}, 1000);
                $(".icon").html(`<i class=\"fa-solid fa-check\" style=\"color:green\"></i>`);
                $( ".container2" ).animate({opacity: 0,}, 1000);
                $.post('http://smd_skillbar/check', JSON.stringify({success: true}));
                GamesPlayed = 0;
            } else {
                StopGame()
                setTimeout(function() {StartGame({time : RandomNumber(1000, 2000), position : RandomNumber(15, 50), width : RandomNumber(10, 15), games : GamesPlayed})}, 500);
            }
        } else {
            $(".button").css({"background-color": "rgba(180, 0, 0, 0.9)"});
            $( ".container2" ).animate({opacity: 1,}, 1000);
            $(".icon").html(`<i class=\"fa-sharp fa-solid fa-xmark\" style=\"color:red\"></i>`);
            $( ".container2" ).animate({opacity: 0,}, 1000);
            $.post('http://smd_skillbar/check', JSON.stringify({success: false}));
            GamesPlayed = 0;
        }
        
        $(".container").fadeOut('fast', function() {
            $(".thing").css("width", 0);
            $(".button").css({"background-color": "rgba(65, 65, 65, 0.5)"});
        });
    }

    RandomNumber = function(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
});