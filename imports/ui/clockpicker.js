import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor'
import { Blaze  } from 'meteor/blaze'
import { Scores } from '../api/scores.js'

import '../clockpicker/bootstrap-clockpicker.js'
import './clockpicker.html'
import '../pitchdetection/pitchdetect.js'

/*applications used:
* moment.js
*
* Documentation can be located http://momentjs.com/docs/
*
*Clockpicker developed by YuetLong Leung
*Progress developed by Zachery Wong
*
*/


Template.clockpicker.onCreated(function(){
    this.currentPage = new ReactiveVar("timeForm");
});

Template.clockpicker.helpers({
    currentPage(){
        return Template.instance().currentPage.get();
    }
});

/*
 * When timeform is created, it instantiates variables to reactively store number
 * of hours and minutes. When other components modify the values of them, the autotracker
 * inside ReactiveVar fires changes to the view, changing the value on display.
 */

Template.timeForm.onCreated(function (){
    // this is where you set the default values for the form
    // allows the inputs to show on start
    this.hours = new ReactiveVar(1);
    this.minutes = new ReactiveVar(15);
    this.showForm = new ReactiveVar(true);
});

/*
 * When timeform finishes rendering, it initializes the clockpicker using JQuery.
 */

Template.timeForm.onRendered(function(){

    $(".clockpicker").clockpicker({
        donetext: 'OK',
        autoclose : false,
        twelvehour: true
    });
});

/*
 * The helpers are the backbones of front end frameowrk logic.
 * When the value of a reactive variable changes,
 * the returns of helpers below would change accordingly.
 */

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
    },
    hoursMinutesNotSet(){
        var instance = Template.instance();
        return (instance.hours.get() == null && instance.minutes.get() == null);
    },
    showForm(){
        return Template.instance().showForm.get();
    }
});

/*
 * The sound indicator is the gadget that visualizes sound detection.
 * The hasSound function below listens to Session variable changes,
 * published by the sound detecter in another folder.
 */

Template.soundIndicator.helpers({
    hasSound: function(){
        return Session.get('noteElem') !== '-';
    }
});

/*
 * This function initializes the timers.
 * It contains the time duration counters using MmomentJS library.
 * Those counters does not natively change the values themselves.
 * A global setInterval function changes them instead.
 * The "timer" that shows duration on view was just JQuery.html edits over time.
 */

var initializeTimers = function(timestamp,hours,minutes) {

    var timeElapsed = moment.duration(0, 'seconds');
    var timeRemains = moment.duration(timestamp.diff(moment()));
    var interval = 200;
    var tid = setInterval(startCounting, interval);

    var timeElaspedInSeconds;
    var timeElaspedInMinutes;
    var timeElaspedInHours;

    var timeRemainsInMinutes;
    var timeRemainsInHours;

    var start_time = timeRemains;
    //capture the time  input by the user before the timer starts

    function te(string) {
        $("#timeElapsed").html(string);
    }

    function tr(string) {
        $("#timeRemains").html(string);
    }


    //main function that runs our two counters.  outputs messages based on the time remaining and time elapsed.
    function startCounting() {

        timeElaspedInSeconds = timeElapsed.seconds();
        timeElaspedInMinutes = timeElapsed.minutes();
        timeElaspedInHours = timeElapsed.hours();
        var start_time = new Date();
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
            tr("A minute and " + timeElaspedInSeconds + "seconds in! Good job!");
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

        /*
         * When the time is up, users are notified,
         * total points are calculated and stored into the database for record.
         * It also stops the countdown functions from firing.
         */

        if (Math.floor(timeRemains.asSeconds()) < 1) {

            clearInterval(tid);

            te("Times up! You did great!");

            var totalPoints = timeElaspedInHours * 3600 + timeElaspedInMinutes * 60 + timeElaspedInSeconds;

            tr("You earned " + totalPoints + " points!");

            timerIsRunning = false;

            //We finished the run, insert results into a database
            insertScoreToDB(totalPoints, timeElapsed, hours, minutes);
        }
    }
};

/*
 * The timeform event handlers binds the duration and end time display on view together.
 * Say if a user changes the end time, the first function calculates the time difference,
 * changes the instance variables according to the result, which changes the view
 * because it is binded to the helpers. Other functions are serving the same purpose.
 */

Template.timeForm.events({
    'change .input-group'(event, instance){
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
    'click button'(event, instance){
        instance.showForm.set(false);
        initializeTimers(moment()
            .add(instance.hours.get(),"hours")
            .add(instance.minutes.get(),"minutes"),
            instance.hours.get(),
            instance.minutes.get()
        );
    },
    'change #input-hours'(event, instance){
        instance.hours.set($("#input-hours").val());
        $("#time").val(moment().add(instance.hours.get(),"hours").add(instance.minutes.get(),"minutes")
            .format("hh:mmA"));
    },
    'change #input-minutes'(event, instance){
        instance.minutes.set($("#input-minutes").val());
        $("#time").val(moment().add(instance.hours.get(),"hours").add(instance.minutes.get(),"minutes")
            .format("hh:mmA"));
    }
});

//grabs information and stores it into the database and formats it nicely.
//time_prac - grabs the time that the user input
//actual_prac = grabs the time counted up from the start of the practice session.

var insertScoreToDB = function(scr, prac_time, hr, min){
    var end_time = new Date();
    var actual_inMilli = prac_time.asMilliseconds();
    var time_prac = moment('2000-01-01 00:00:00').add(hr, "hours").add(min, "minutes").format('HH:mm:ss');
    var actual_prac = moment('2000-01-01 00:00:00').add(actual_inMilli).format('HH:mm:ss');

    var datePracticed = moment(end_time).format('MM/DD/YYYY');
    Scores.insert({
        userId: Meteor.userId(),
        score: scr,
        date: datePracticed,
        totalTime: time_prac,
        actualTime: actual_prac
    }, function(err, _id){

    });
};