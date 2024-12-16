import React from 'react';
import { Button, Text } from 'react-native';
import * as fs from 'fs';

// Define the schema for the Realm database
const LogEntrySchema = {
  name: 'LogEntry',
  properties: {
    id: 'int',
    category:  'string',
    description: 'string',
    timestamp: 'date',
  },
  primaryKey: 'id', // Set 'id' as the primary key
};

const exportDatabase = async () => {
  try {
    const response = await fetch('http://localhost:3000/export-realm');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

const handleExportDatabase = async () => {
    await exportDatabase();
  };


  const RealmDb = () => {
    // Create the Realm DB and populate with data when the button is pressed
    const createAndPopulateRealmDb = async () => {
      try {
        // Open the Realm database with the defined schema
        const realmInstance = await RealmDb.open({
          schema: [LogEntrySchema],
        });
  
        // Write the data into the Realm database        
        const testData = JSON.parse(fs.readFileSync('./testData.json', 'utf8'));  
        const data = testData;
        realmInstance.write(() => {
          data.forEach((entry: {
            category: any; id: any; description: any; timestamp: string | number | Date; 
}) => {
            realmInstance.create('LogEntry', {
              id: entry.id,
              category: entry.category,
              description: entry.description,
              timestamp: new Date(entry.timestamp), // Ensure the timestamp is a Date object
            });
          });
        });
  
        // ... rest of the code ...

      console.log('Data successfully populated into Realm!');
      
      // Optionally, log the entries to check if the data was inserted correctly
      const allEntries = realmInstance.objects('LogEntry');
      console.log(allEntries);
    } catch (error) {
      console.error('Error creating or populating Realm DB:', error);
    }
  };

  return (
    <React.Fragment>
      <Button
        title="Create and Populate Realm DB"
        onPress={createAndPopulateRealmDb}
      />
      <Text>Press the button to create and populate the Realm DB.</Text>
      <Button title="Export Database" onPress={handleExportDatabase} />
    </React.Fragment>
  );
};

export default RealmDb;
