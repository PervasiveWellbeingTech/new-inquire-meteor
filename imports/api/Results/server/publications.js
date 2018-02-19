import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Results from '../Results';

Meteor.publish('results', function results(sessionId) {
  return Results.find({ sessionId: sessionId });
});
// TODO: consider below for returning public sessions as well
// db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )


// Note: sessions.view is also used when editing an existing session.
Meteor.publish('results.view', function resultsView(sessionId) {
  check(sessionId, String);
  return Results.find({ _id: sessionId, owner: this.userId });
});
