import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Tasks} from '../imports/api/tasks.js';

import './main.html';

// runs when the client starts up
Meteor.startup(function() {
  //Init dhtmlxScheduler.
  scheduler.init("scheduler_here", new Date(),"month");

  //Init dhtmlxScheduler data adapter.
  scheduler.meteor(Tasks);
  //or
  scheduler.meteor(Tasks.find(/*[anything]*/), Tasks);
});

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});