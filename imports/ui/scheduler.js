import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Tasks } from '../api/tasks.js'

import './scheduler.html'

Template.scheduler.onRendered(function(){
    // A hack that stores userId to the event that user specifies
    scheduler.attachEvent("onEventSave",function(id,ev){
        ev.userId = Meteor.userId();
        return true;
    });
    scheduler.init("scheduler_here", new Date(),"week");

    //Init dhtmlxScheduler data adapter.
    scheduler.meteor(Tasks.find({userId: Meteor.userId()}), Tasks);
});

Template.scheduler.onDestroyed(function(){
    scheduler.meteorStop();
    scheduler.clearAll();
});