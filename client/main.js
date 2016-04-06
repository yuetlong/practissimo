import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Blaze } from 'meteor/blaze'
import { Session } from 'meteor/session'
import { Tasks } from '../imports/api/tasks.js'

import '../imports/countdown/jquery.countdown.js'
import '../imports/startup/accounts-config.js'
import './main.html';


Template.welcome.helpers({
  username: function(){
    return Meteor.user().username;
  }
});

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  }
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  }
});

Template.scheduler.onRendered(function(){
  // A hack that stores userId to the event that user specifies
  scheduler.attachEvent("onEventSave",function(id,ev){
    ev.userId = Meteor.userId();
    return true;
  });

  scheduler.init("scheduler_here", new Date(),"month");

  //Init dhtmlxScheduler data adapter.
  scheduler.meteor(Tasks.find({userId: Meteor.userId()}), Tasks);
});

Template.scheduler.onDestroyed(function(){
  scheduler.meteorStop();
  scheduler.clearAll();
});

Template.countdown.onRendered(function(){
    var fiveSeconds = new Date().getTime() + 5000;
    $('#clock').countdown(fiveSeconds, {elapse: true})
    .on('update.countdown', function(event) {
           var $this = $(this);
           if (event.elapsed) {
                 $this.html(event.strftime('After end: <span>%H:%M:%S</span>'));
               } else {
                 $this.html(event.strftime('To end: <span>%H:%M:%S</span>'));
               }
         });
});

Template.clockpicker.onRendered(function(){
    $('.clockpicker').clockpicker({
        donetext: '',
        autoclose : true,
        default: "13:15"
    });
});

Template.clockpicker.events({
    'submit .clockpickerform'(event){}
});

Session.setDefault('page', 'clockpicker');

Template.body.helpers({
    currentPage: function(page){
        return Session.get('page')
    }
});

Template.body.events({
    'click .clickChangesPage': function(event, template){
        Session.set('page', event.currentTarget.getAttribute('data-page'))
    }
});

Template.stopwatch.onRendered(function(){

    var clock = $("#stopwatch");
    var time_elapsed = 0;
    var start_timeStamp = new Date().valueOf();

    function initializeCountdown(timeStamp){

        clock.countdown(new Date(timeStamp), function(event) {
            if(event.offset.hours != 0){
                $(this).html(event.strftime('%-H hour%!H:s; %-M minute%!M:s; %-S second%!S:s;'));
            }
            else if (event.offset.minutes != 0){
                $(this).html(event.strftime('%-M minute%!M:s; %-S second%!S:s;'));
            }
            else{
                $(this).html(event.strftime('%-S second%!S:s;'));
            }
            time_elapsed = event.timeStamp - start_timeStamp;
            console.log(time_elapsed);
            //initializeCountdown(new Date().valueOf() + time_elapsed);
        });

    }

    initializeCountdown(new Date().valueOf() + 5 * 1000);
});