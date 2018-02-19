import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import PublicQueries from './PublicQueries';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'publicQueries.insert': function documentsInsert(doc) {
    check(doc, {
      query: String,
    });

    try {
      return PublicQueries.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'publicQueries.update': function documentsUpdate(doc) {
    check(doc, {
      _id: String,
      query: String,
    });

    try {
      const documentId = doc._id;
      PublicQueries.update(documentId, { $set: doc });
      return documentId; // Return _id so we can redirect to document after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'publicQueries.remove': function documentsRemove(documentId) {
    check(documentId, String);

    try {
      return PublicQueries.remove(documentId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'publicQueries.insert',
    'publicQueries.update',
    'publicQueries.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
