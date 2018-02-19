import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import PrivateQueries from './PrivateQueries';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'privateQueries.insert': function documentsInsert(doc) {
    check(doc, {
      query: String,
      sessionId: String,
    });

    try {
      return PrivateQueries.insert({ owner: this.userId, ...doc });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'privateQueries.update': function documentsUpdate(doc) {
    check(doc, {
      _id: String,
      query: String,
    });

    try {
      const documentId = doc._id;
      PrivateQueries.update(documentId, { $set: doc });
      return documentId; // Return _id so we can redirect to document after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
  'privateQueries.remove': function documentsRemove(documentId) {
    check(documentId, String);

    try {
      return PrivateQueries.remove(documentId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: [
    'privateQueries.insert',
    'privateQueries.update',
    'privateQueries.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
