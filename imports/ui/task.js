import { Template } from "meteor/templating";

import { Tasks } from "../api/tasks.js";

import './task.html';

Template.task.events({
    'click .toggle-checked'(){
        // checked property is reversed
        console.log(this)
        Tasks.update(this._id, {
            $set: { checked: ! this.checked },
        });
    },
    'click .delete'(){
        console.log(this)
        Tasks.remove(this._id)
    },
});