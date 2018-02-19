import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Results = new Mongo.Collection('Results');

// TODO: take notes for each result, mark as intersting, for deletion, important etc

Results.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Results.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Results.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this result belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this session was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this session was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  sessionId: {
    type: String,
    label: 'The id of the session.',
  },
  query: {
    type: String,
    label: 'The id of the session.',
  },
  result_count: {
    type: Number,
    label: 'The number of results.',
  },
  query_results: {
    type: Array,
    label: "Results from the query",
    optional: true
  },
  'results.$': {
    type: Object,
    blackbox: true
  },
  queryParams: {
    type: Object,
    optional: true,
    blackbox: true
  },
});

Results.attachSchema(Results.schema);

export default Results;



// # Design Document
//
// 1. Click on sentences to reuse as  a query
// 2. History - up/down arrows OR dropdown OR both
// 3. Highlight words in results with cursor (get highlighted everywhere)
// 4. Sort results alphabetically/numerically
// 5. Zoom - context on hover + link to original page
// 6. Color-based POS tagging
// 7. temporal scale (perhaps a histogram of contributions over time)
// 8. tfidf-based highlighting (most important words)
// 9. bookmarking sentences (assigning sentences to groups)
// 10. cross-dataset search
// 11. switching between models (lstm, word2vec etc.)
//
//
// client to store preferences (aka bookmarking) (users and sentences) for each session
//
// Ask for python server to implement an API - simple queries (text) to more complex( multiple sentences with preferred users).
//
// Pilot studies in one week before formal approval.
//
// Functionality for exporting the data - csv, json, etc.
//
// Workshop soon (May 15th): Aid the process of causal inference.
// Work out a join from the front end
