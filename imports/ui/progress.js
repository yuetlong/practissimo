import { Template } from 'meteor/templating';

import { Scores } from '../api/scores.js';

import './progress.html';

Template.progress.helpers({
    scores() {
        return Scores.find();

    }
});