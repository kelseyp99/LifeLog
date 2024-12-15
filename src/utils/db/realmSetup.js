import Realm from 'realm';
import testEntries from './testData'; // Adjust path as needed


// Define the LogEntry schema
const LogEntrySchema = {
  name: 'LogEntry',
  properties: {
    id: 'int', // Primary Key, unique identifier for each entry
    category: 'string', // Category (e.g., Nutrition, Physical Health, etc.)
    description: 'string', // User-provided description
    timestamp: 'date', // When the entry was created
  },
  primaryKey: 'id', // Set the primary key to 'id'
};

// Create a new Realm instance with the schema
const realm = new Realm({ schema: [LogEntrySchema] });

// Sample test entries
const testEntries = [
  { category: 'Nutrition', description: 'Breakfast - Oatmeal and fruit', timestamp: '2024-12-13T07:30:00Z' },
  { category: 'Physical Health', description: 'Blood pressure: 125/80', timestamp: '2024-12-13T08:00:00Z' },
  { category: 'Mental Health', description: 'Feeling relaxed after yoga', timestamp: '2024-12-13T08:30:00Z' },
  { category: 'Body Functions', description: 'Normal bowel movement', timestamp: '2024-12-13T09:00:00Z' },
  { category: 'Exercise', description: 'Morning jog for 30 minutes', timestamp: '2024-12-13T06:30:00Z' },
  // Add more test entries as needed
];

// Function to add test entries into the Realm database
const addTestEntries = () => {
  realm.write(() => {
    testEntries.forEach(entry => {
      realm.create('LogEntry', {
        id: Date.now() + Math.random(), // Ensure a unique ID for each entry
        category: entry.category,
        description: entry.description,
        timestamp: new Date(entry.timestamp),
      });
    });
  });
};

// Add the test entries
addTestEntries();

// Retrieve and log all entries to verify the data insertion
const allEntries = realm.objects('LogEntry');
console.log(allEntries); // Logs all the LogEntry entries in the database

// Optionally: You can also return the entries from the function or export them if needed
export { allEntries };
