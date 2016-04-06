import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'

import '../clockpicker/jquery-clockpicker.min.js'
import '../countdown/jquery.countdown.js'
import './clockpicker.html'
import '../../client/lib/audiodetection/audioSwitch.js'
import '../../client/lib/audiodetection/main.js'

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

            var timestamp = moment(targetTimeStr,"YYYY\/MM\/DD HH:mm:ss").valueOf();

            if (timestamp < moment().valueOf()){
                timestamp += 86400000; // add 24 hours
            }

            initializeTimers(timestamp);

            cp.html("");
            cp.clockpicker('remove');
        }
    });
});

var initializeTimers = function(timestamp){
    $('#clock1').countdown(new Date().valueOf(), {elapse: true})
        .on('update.countdown', function(event) {
            $(this).html(event.strftime('Practice time: <span>%H:%M:%S</span>'));
        });
    $('#clock2').countdown(timestamp)
        .on('update.countdown', function(event){
            $(this).html(event.strftime('Remaining time: <span>%H:%M:%S</span>'));
        })
        .on('finish.countdown', function(event){
            $(this).html(event.strftime('Remaining time: <span>%H:%M:%S</span>'));
            console.log("finished!");
        })
};