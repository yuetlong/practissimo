import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'

import './scheduler.js'
import './clockpicker.js'
import './progress.js'
import './body.html'

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
});

Template.body.events({
    'click .btn': function(event, template){
        Session.set('page', event.currentTarget.getAttribute('data-page'))
    }
});