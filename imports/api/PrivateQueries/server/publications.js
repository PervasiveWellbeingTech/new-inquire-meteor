import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import PrivateQueries from '../PrivateQueries';

Meteor.publish('privateQueries', function documents(sessionId) {
  check(sessionId, String);
  return PrivateQueries.find({ sessionId: sessionId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('privateQueries.view', function documentsView(queryId) {
  check(queryId, String);
  return PrivateQueries.find({ _id: queryId, owner: this.userId });
});
