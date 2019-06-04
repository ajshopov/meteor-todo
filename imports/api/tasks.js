import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    //  only runs on server
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            // only tasks that are public or belong to user
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

Meteor.methods({
    'tasks.insert'(text){
        check(text, String);

        // check user logged in before writing to db
        if (! Meteor.userId()) {
            throw new Meteor.Error('not authorized');
        }
        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },

    'tasks.remove'(taskId){
        check(taskId, String);

        //  make sure only owner can delete private task
        const task = Meteor.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not authorised');
        }

        Tasks.remove(taskId);
    },

    'tasks.setChecked'(taskId, setChecked){
        check(taskId, String);
        check(setChecked, Boolean);

        //  make sure only owner can check private task
        const task = Meteor.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not authorised');
        }

        Tasks.update(taskId, { $set: { checked: setChecked } });
    },

    'tasks.setPrivate'(taskId, setToPrivate){
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        // only task owner can make task private
        if (task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not authorised');
        }

        Tasks.update(taskId, { $set: { private: setToPrivate } });
    },
});