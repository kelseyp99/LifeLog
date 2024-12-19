import Realm from 'realm';
interface Discussion {
  id: number;
  timestamp: Date;
  description: string;
  cleared: boolean;
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

async function addDiscussion(description: string): Promise<void> {
  console.log('Adding new discussion...');
  const currentTime = new Date();
  let realm: Realm | null = null;
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
    },
  ],
});
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
  } catch (error) {
    console.error('Error adding new discussion:', error);
  } finally {
    if (realm) {
      realm.close();
    }
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

export { getDistinctCategories, insertJsonFile, queryAllFieldsByCategories, addDiscussion, getDiscussions };