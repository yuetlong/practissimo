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

            if (timestamp.isBefore(moment())){
                timestamp.add(1,'days');
            }

            initializeTimers(timestamp);

            cp.html("");
            cp.clockpicker('remove');
        }
    });
});


    var initializeTimers = function(timestamp) {

        var timeElapsed = moment.duration(0, 'seconds');
        var timeRemains = moment.duration(timestamp.diff(moment()));
        var interval = 200;
        var tid = setInterval(startCounting, interval);

        var timeElaspedInSeconds;
        var timeElaspedInMinutes;
        var timeElaspedInHours;

        var timeRemainsInMinutes;
        var timeRemainsInHours;

        function te(string) {
            $("#timeElapsed").html(string);
        }

        function tr(string) {
            $("#timeRemains").html(string);
        }

        function startCounting() {

            timeElaspedInSeconds = timeElapsed.seconds();
            timeElaspedInMinutes = timeElapsed.minutes();
            timeElaspedInHours = timeElapsed.hours();

            if (timeElaspedInHours > 1) {
                tr("You've practiced for " + timeElaspedInHours + " hours and " + timeElaspedInMinutes + " minutes! That's amazing!");
            }
            else if (timeElaspedInHours == 1) {
                tr("You've practiced for an hour and " + timeElaspedInMinutes + " minutes!");
            }
            else if (timeElaspedInMinutes > 1) {
                tr("You've practiced for " + timeElaspedInMinutes + " minutes! Keep going!");
            }
            else if (timeElaspedInMinutes == 1) {
                tr("A minute and " + timeElaspedInSeconds + " in! Good job!");
            }
            else {
                tr("Relax! Play anything you'd like! You're " + timeElaspedInSeconds + " seconds in.");
            }

            timeRemainsInMinutes = timeRemains.minutes();
            timeRemainsInHours = timeRemains.hours();

            if (timeRemainsInHours > 1) {
                te("You have about " + timeRemainsInHours + " hours and " + timeRemainsInMinutes + "left.");
            }
            else if (timeRemainsInHours == 1) {
                te("You have about an hour left.");
            }
            else if (timeRemainsInMinutes > 1) {
                te("You have about " + timeRemainsInMinutes + " minutes left.");
            }
            else if (timeRemainsInMinutes == 1) {
                te("You have about a minute left.");
            }
            else {
                te("Less than a minute!");
            }

            if ($("#switchAudio").hasClass("practicing")) {
                timeElapsed.add(interval);
            }

            timeRemains.subtract(interval);

            if (Math.floor(timeRemains.asSeconds()) == 0) {
                clearInterval(tid);
                te("Times up!");
            }
        }
    };


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
