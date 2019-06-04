import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

// import { Tasks } from "../api/tasks.js";

import './task.html';

Template.task.helpers({
    isOwner(){
        return this.owner === Meteor.userId();
    },
});

Template.task.events({
    'click .toggle-checked'(){
        // checked property is reversed
        Meteor.call('tasks.setChecked', this._id, !this.checked);
        // console.log(this)
        // Tasks.update(this._id, {
        //     $set: { checked: ! this.checked },
        // });
    },
    'click .delete'(){
        Meteor.call('tasks.remove', this._id);
        // console.log(this)
        // Tasks.remove(this._id)
    },
    'click .toggle-private'(){
        Meteor.call('tasks.setPrivate', this._id, !this.private);
    }
});