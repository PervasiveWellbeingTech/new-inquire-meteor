import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import PublicQueries from '../PublicQueries';

Meteor.publish('publicQueries', function documents() {
  return PublicQueries.find({ owner: this.userId });
});

// Note: documents.view is also used when editing an existing document.
Meteor.publish('publicQueries.view', function documentsView(queryId) {
  check(queryId, String);
  return PublicQueries.find({ _id: queryId, owner: this.userId });
});
