import Realm from 'realm';

interface ActivityLog {
  id: number;
  discussionId: number;
  category: string;
  description: string;
  timestamp: Date;
}
interface Discussion {
  id: number;
  timestamp: Date;
  description: string;
  cleared: boolean;
}
interface Parameters {
  parameterName : string;
  parameterValue: string;
}


async function getDistinctCategories(): Promise<string[]> {
  console.log('Getting distinct categories...');
  try {
    const realm = await Realm.open({
      schema: [
        {
          name: 'ActivityLog',
          properties: {
            category: 'string',
            // other properties
          },
        },
      ],
    });

    const categories: string[] = Array.from(
      realm.objects('ActivityLog').snapshot().map((item: any) => item.category as string)
    ).filter((category, index, self) => self.indexOf(category) === index);

    console.log('Categories:', categories);

    return categories;
  } catch (error) {
    console.error('Error getting distinct categories:', error);
    return []; // Return an empty array on error
  }
}
async function insertJsonFile(jsonData: any): Promise<void> {
  try {
    const realm = await Realm.open({
      schema: [
        {
          name: 'ActivityLog',
          properties: {
            category: 'string',
            value: 'string',
          },
        },
      ],
    });

    jsonData.forEach((item: any) => {
      const category = item.category;
      const value = item.value;

      switch (category) {
        case 'Food':
          realm.create('ActivityLog', {
            category: 'Food',
            value: `${value} at ${item.time}`,
          });
          break;
        case 'Vitals':
          realm.create('ActivityLog', {
            category: 'Vitals',
            value: `${value}`,
          });
          break;
        // Add more cases for other categories
        default:
          console.log(`Unknown category: ${category}`);
      }
    });

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

async function queryAllFieldsByCategories(categories: string[]): Promise<any[]> {
  console.log('Querying all fields by categories...');
  try {
    const realm = await Realm.open({
      schema: [
        {
          name: 'ActivityLog',
          properties: {
            category: 'string',
            // other properties
          },
        },
      ],
    });

    const results = realm.objects('ActivityLog').filtered(`category IN $0`, categories);

    console.log('Results:', results);

    return Array.from(results);
  } catch (error) {
    console.error('Error querying all fields by categories:', error);
    return Promise.resolve([]); // Return an empty array in case of error
  }
}

async function getLastOpenDiscussion(): Promise<any> {
  console.log('Getting last open discussion...');
  try {
    let realm: Realm;
    realm = await Realm.open({
      schema: [
        {
          name: 'Discussion',
          properties: {
            id: 'int',
            timestamp: 'date',
            description: 'string',
            cleared: 'bool',
          },
        },
      ],
    });
    const discussions = realm.objects('Discussion');
    const lastOpenDiscussion = discussions.filtered('cleared == false').sorted('timestamp', true)[0];
    return lastOpenDiscussion;
  } catch (error) {
    console.error('Error getting last open discussion:', error);
    return Promise.reject(error);
  } finally {
    if (realm && realm.close) {
      realm.close();
    }
  }
}



async function addDiscussion(description: string): Promise<void> {
  //console.log('Adding new discussion...');
  const currentTime = new Date();
 let realm: Realm | null = null;
if (Realm) {
  try {
    realm = await Realm.open({
      schema: [
        {
          name: 'Discussion',
          properties: {
            id: 'int',
            timestamp: 'date',
            description: 'string',
            cleared: 'bool',
          },
        }, // <--- Added the missing closing bracket here
      ],
    });
  } catch (error) {
    console.error('Error opening Realm:', error);
  }
} else {
  console.error('Realm is not defined');
}
//console.log('after realm open')
/* 
 realm = await Realm.open({
  schema: [
    {
      name: 'Discussion',
      properties: {
        id: 'int',
        timestamp: 'date',
        description: 'string',
        cleared: 'bool',
      },
    }, // <--- Added the missing closing bracket here
  ],
});*/
  try {
    if (!realm) {
      console.error('Failed to open Realm instance');
      return;
    }
    realm.write(() => {
      realm?.create('Discussion', {
        id: new Date().getTime(), // Use timestamp as ID
        timestamp: currentTime,
        description,
        cleared: false, // Set cleared to false by default
      });
    });


  // Retrieve all objects from the Discussion table
  const discussions = realm.objects('Discussion');
  //console.log('Discussions:', discussions);

  // You can also loop through the discussions array
  discussions.forEach((discussion) => {
    console.log('Discussion:', discussion);
  });


  } catch (error) {
    console.error('Error adding new discussion:', error);
  } finally {
    if (realm) {
      realm.close();
     // console.log('Discussion added successfully!');
    }
  } 
}



async function getDiscussions(): Promise<Discussion[]> {
  console.log('Getting all discussions...');
  try {
    const realm = await Realm.open({
      schema: [
        {
          name: 'Discussion',
          properties: {
            id: 'int',
            timestamp: 'date',
            description: 'string',
            cleared: 'bool',
          },
        },
      ],
    });
    
  const discussions = realm.objects('Discussion').sorted('timestamp', true).map((discussion) => ({
    id: discussion.id,
    timestamp: discussion.timestamp,
    description: discussion.description,
    cleared: discussion.cleared,
  })) as Discussion[];

  return discussions;
  } catch (error) {
    console.error('Error getting discussions:', error);
    return Promise.reject(error);
  }
}



export function getActivityLogs(): ActivityLog[] {
  return Array.from(realm.objects('ActivityLog'));
}



export function getParameters(): Parameters[] {
  return Array.from(realm.objects('Parameters'));
}

export class DatabaseService {
  // ...

  async parseAndSaveInstructions(jsonData: any) {
    const instructions = jsonData.instructions;
    instructions.forEach(async (instruction: any) => {
      const discussion = await this.getDiscussionById(instruction.id);
      if (discussion) {
        const timestamp = discussion.timestamp;
        const existingLog = await this.getActivityLogByTimestamp(timestamp);
        if (existingLog) {
          // Update existing log
          existingLog.category = instruction.category;
          existingLog.description = instruction.description;
          await this.updateActivityLog(existingLog);
        } else {
          // Create new log
          const newLog: ActivityLog = {
            id: new Date().getTime(),
            discussionId: discussion.id,
            category: instruction.category,
            description: instruction.description,
            timestamp: timestamp,
          };
          await this.addActivityLog(newLog);
        }
      } else {
        console.log(`Discussion with ID ${instruction.id} not found.`);
      }
    });
  }

async getDiscussionById(id: string): Promise<Discussion | null> {
  // Implement logic to retrieve a Discussion by ID from the database
  // Return null if no discussion is found
  const discussion = await this.getDiscussionFromDatabase(id); // Assuming this function exists
  return discussion; // Explicitly return the discussion
}

async getDiscussionFromDatabase(id: string): Promise<Discussion | null> {
  // Implement logic to retrieve a Discussion by ID from the database
  // For example, using Realm:
  const realm = await Realm.open({ /* schema and other options */ });
  const discussion = realm.objectForPrimaryKey('Discussion', id);
  return discussion as Discussion | null;
}

async getExistingLog(timestamp: Date): Promise<ActivityLog | null> {
  // Implement logic to retrieve an existing ActivityLog by timestamp from the database
  // Return null if no log is found
  const log = await this.getActivityLogByTimestamp(timestamp);
  return log; // Explicitly return the log
}

async getActivityLogByTimestamp(timestamp: Date): Promise<ActivityLog | null> {
  // Implement logic to retrieve an ActivityLog by timestamp from the database
  // Return null if no log is found
  const log = await this.getExistingLog(timestamp); // Assuming this function exists
  return log; // Explicitly return the log
}
  async updateActivityLog(log: ActivityLog): Promise<void> {
    // Implement logic to update an existing ActivityLog in the database
  }

  async addActivityLog(log: ActivityLog): Promise<void> {
    // Implement logic to add a new ActivityLog to the database
  }
}

export { getDistinctCategories, insertJsonFile, queryAllFieldsByCategories, addDiscussion, getDiscussions };

//export { addDiscussion };