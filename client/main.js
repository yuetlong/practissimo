import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tasks } from '../imports/api/tasks.js';
import '../imports/startup/accounts-config.js';
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
  scheduler.attachEvent("onEventSave",function(id,ev,is_new){
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

    var clock = $("#clock");
    var ev;

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
           ev = event;
       });
   }

    $('#btn-pause').click(function() {
        clock.countdown('pause');
    });

    $('#btn-resume').click(function() {
        initializeCountdown(new Date().valueOf() +
            1000 * (ev.offset.hours*60*60 + ev.offset.minutes*60 + ev.offset.seconds));
        clock.countdown('resume');
    });

    initializeCountdown(new Date().valueOf() + 65 * 1000);
});

Template.clockpicker.onRendered(function(){
    $('.clockpicker').clockpicker();
});