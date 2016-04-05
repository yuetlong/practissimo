import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Session } from 'meteor/session';
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

Template.main_menu.events({
  'click #start'(event){
    //event.preventDefault();
    Session.set('showButtons', true);
    Session.set('newWindow', false);
  }

});

Template.main_menu.helpers({
  showButtons : true,
  newWindow: false
});

Session.setDefault('page', 'main_menu');

Template.body.helpers({
  currentPage: function(page){
    return Session.get('page')
  }
})

Template.body.events({
  'click .btn': function(event, template){
    Session.set('page', event.currentTarget.getAttribute('data-page'))
  }
})
