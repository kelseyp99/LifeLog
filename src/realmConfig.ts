// frontend/src/RealmConfig.ts

import { Configuration } from 'Realm';

const ActivityLogSchema = {
  name: 'ActivityLog',
  properties: {
    id: 'int',
    discussionId: 'int', // Add this line
    category: 'string',
    description: 'string',
    timestamp: 'date',
  },
  primaryKey: 'id',
};

const DiscussionSchema = {
  name: 'Discussion',
  properties: {
    id: 'int',
    timestamp: 'date',
    description: 'string',
    cleared: 'bool',
    activityLogs: 'ActivityLog[]', 
  },
  primaryKey: 'id'
};

const ParametersSchema = {
  name: 'parameters',
  properties: {
    paramName: 'string',
    paramValue: 'string?',
  },
  primaryKey: 'paramName',
};

const config: Configuration = {
  path: '/data/data/com.lifelog/databases/ActivityLog.realm',
  schema: [ActivityLogSchema, DiscussionSchema, ParametersSchema],
  schemaVersion: 1, // Increment when schema changes
};

const realm = new Realm(config);

export { realm, ActivityLogSchema, DiscussionSchema, ParametersSchema };