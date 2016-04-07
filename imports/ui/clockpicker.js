import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'

import '../clockpicker/jquery-clockpicker.min.js'
import './clockpicker.html'
import './main.js'

Template.clockpicker.onRendered(function(){

    var cp = $(".clockpicker");

    cp.clockpicker({
        donetext: 'Let\'s start practice!',
        autoclose : false,
        default: 'now',
        fromnow: 60000,
        afterDone:function(){
            var targetTimeStr = moment().format('YYYY\/MM\/DD ')
                + $("#time").val()
                + moment().format(':ss');

            var timestamp = moment(targetTimeStr,"YYYY\/MM\/DD HH:mm:ss");

            if (timestamp < moment().unix()){
                timestamp += 86400000; // add 24 hours
            }

            initializeTimers(timestamp);

            cp.html("");
            cp.clockpicker('remove');
        }
    });
});

var initializeTimers = function(timestamp){

    var timeElapsed = moment.duration(0,'seconds');
    var timeRemains = moment.duration(2,'minutes');
    var interval = 200;
    var tid = setInterval (startCounting, interval);

    function startCounting(){
        $("#timeElapsed").html(timeElapsed.humanize());
        $("#timeRemains").html(timeRemains.humanize());
        if ($("#switchAudio").hasClass("practicing")){
            timeElapsed.add(interval);
            console.log(1);
        }
        timeRemains.subtract(interval);

        if(timeRemains.unix == 0){
            clearInterval(tid);
        }
    }



    /*
    clock1.countdown(new Date().valueOf(), {elapse: true})
        .on('update.countdown', function(event) {
            $(this).html(event.strftime('Practice time: <span>%H:%M:%S</span>'));
        });
    $("#clock2").countdown(timestamp)
        .on('update.countdown', function(event){
            $(this).html(event.strftime('Remaining time: <span>%H:%M:%S</span>'));
        })
        .on('finish.countdown', function(event){
            $(this).html(event.strftime('Remaining time: <span>%H:%M:%S</span>'));
        });
    // invisible, set to monitor html text
    $('#clock3').countdown(timestamp)
        .on('update.countdown', function(event){
            if (document.getElementById("switch").innerHTML === 'Idling'){
            }
            else{
                initMoment.add(1000);
                console.log(initMoment.seconds());
                $("#timeElapsed").html(initMoment.seconds());
            }
        })
    */
};