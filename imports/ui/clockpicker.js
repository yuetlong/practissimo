import { Template } from 'meteor/templating'

import './clockpicker.html'

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