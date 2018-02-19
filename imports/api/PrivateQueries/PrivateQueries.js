/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const PrivateQueries = new Mongo.Collection('PrivateQueries');

PrivateQueries.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

PrivateQueries.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

PrivateQueries.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this query belongs to.',
  },
  sessionId: {
    type: String,
    label: 'The ID of the session this query belongs to.',
  },
  createdAt: {
    type: String,
    label: 'The date this query was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this document was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  query: {
    type: String,
    label: 'The query itself.',
  },
});

PrivateQueries.attachSchema(PrivateQueries.schema);

export default PrivateQueries;
