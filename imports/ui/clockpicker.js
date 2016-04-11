import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor'

import '../clockpicker/bootstrap-clockpicker.js'
import './clockpicker.html'
import '../pitchdetection/pitchdetect.js'

Template.timeForm.onCreated(function (){
    // this is where you set the default values for the form
    this.hours = new ReactiveVar(1);
    this.minutes = new ReactiveVar(30);
});

Template.timeForm.onRendered(function(){

    $(".clockpicker").clockpicker({
        donetext: 'OK',
        autoclose : false,
        default: 'now',
        fromnow: Template.instance().hours.get() * 1000 * 60 * 60
        + Template.instance().minutes.get() * 1000 * 60,
        twelvehour: true
    });
});

Template.timeForm.helpers({
    hours() {
        return Template.instance().hours.get();
    },
    minutes() {
        return Template.instance().minutes.get();
    },
    hoursEqualsZero(){
        return Template.instance().hours.get() == 0;
    },
    hoursEqualsOne(){
        return Template.instance().hours.get() == 1;
    },
    minutesEqualsZero(){
        return Template.instance().minutes.get() == 0;
    },
    minutesEqualsOne(){
        return Template.instance().minutes.get() == 1;
    }
});

Template.timeForm.events({
    'change .clockpickerform'(event, instance){
        var endTimeDate = moment($("#time").val(), "hh:mmaa");
        if (endTimeDate.isBefore(moment())){
            endTimeDate.add(1,'days');
        }
        var duration = moment.duration(endTimeDate.diff(moment()));
        instance.hours.set(duration.hours());
        instance.minutes.set(duration.minutes());
    },
    'submit' (event){
        event.preventDefault();
    },
    'click button'(event){

    }
});

Template.soundIndicator.helpers({
    hasSound: function(){
        return Session.get('noteElem') !== '-';
    }
});

/*

Template.clockpicker.onRendered(function(){

    var cp = $(".clockpicker");


    if (timerIsRunning == false){
        cp.clockpicker({
            donetext: 'Let\'s start practice!',
            
            autoclose : false,
            
            default: 'now',
            
            fromnow: 60000,
            
            twelvehour: true,

            afterDone:function(){
                var targetTimeStr = moment().format('YYYY\/MM\/DD ')
                    + $("#time").val()
                    + moment().format(':ss');

                var timestamp = moment(targetTimeStr,"YYYY\/MM\/DD HH:mm:ss");

                if (timestamp.isBefore(moment())){
                    timestamp.add(1,'days');
                }

                initializeTimers(timestamp);

                Scores.insert({
                    userId: Meteor.userId(),
                    score: 0,
                    startDate: new Date()
                }, function(err, _id){
                    scoreRecordId = _id;
                });


                $(".clockpickerform").hide();
                timerIsRunning = true;
            }
        });
    } else{
        $(".clockpickerform").hide();
    }
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
                te("You have about " + timeRemainsInHours + " hours and " + timeRemainsInMinutes + " minutes left.");
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

            if (Session.get('noteElem') !== '-') {
                timeElapsed.add(interval);
            }

            timeRemains.subtract(interval);

            if (Math.floor(timeRemains.asSeconds()) == 0) {

                clearInterval(tid);

                te("Times up! You did great!");

                var totalPoints = timeElaspedInHours * 3600 + timeElaspedInMinutes * 60 + timeElaspedInSeconds;

                tr("You earned " + totalPoints + " points!");

                timerIsRunning = false;
            }
        }
    };



var insertScoreToDB = function(){
    Scores.insert({
        userId: Meteor.userId(),
        score: 0,
        startDate: new Date()
    }, function(err, _id){

    });
};

*/

