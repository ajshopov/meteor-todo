import { Template } from 'meteor/templating';

import { Tasks } from "../api/tasks.js";

import './task.js';
import './body.html';

Template.body.helpers({
    tasks() {
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },
});

Template.body.events({
    'submit .new-task'(event) {
        // prevent browser submit
        event.preventDefault();

        //  get value from form
        const target = event.target;
        const text = target.text.value;

        //  add to collection
        Tasks.insert({
            text,
            createdAt: new Date(),
        });

        // clear form
        target.text.value = '';
    },
});