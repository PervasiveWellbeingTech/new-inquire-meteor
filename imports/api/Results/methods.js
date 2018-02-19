import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Results from './Results';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'results.insert': function sessionsInsert(doc,sessionId) {
    check(doc, {
      query: String,
      result_count: Number,
      query_results: Array,
    });
    check(sessionId,String);
    console.log("we inn this biatch for results");
    try {
      console.log(doc);
      return Results.insert({ owner: this.userId, sessionId: sessionId, ...doc });
    } catch (exception) {
      console.log(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'results.update': function sessionsUpdate(doc) {
    check(doc, {
      _id: String,
      query: String,
      result_count: Number,
      query_results: Array,
    });

    try {
      const sessionId = doc._id;
      Results.update(sessionId, { $set: doc });
      return sessionId; // Return _id so we can redirect to session after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'results.remove': function sessionsRemove(sessionId) {
    check(sessionId, String);

    try {
      return Results.remove(sessionId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'results.insert',
    'results.update',
    'results.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
