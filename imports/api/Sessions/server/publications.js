import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Sessions from '../Sessions';

Meteor.publish('sessions', function sessions() {
  return Sessions.find({ owner: this.userId });
});
// TODO: consider below for returning public sessions as well
// db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )


// Note: sessions.view is also used when editing an existing session.
Meteor.publish('sessions.view', function sessionsView(sessionId) {
  check(sessionId, String);
  return Sessions.find({ _id: sessionId, owner: this.userId });
});
