// @ts-ignore
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({
  name: 'mydatabase.db',
  location: 'default',
});

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Creates a table named "LogEntry" in the SQLite database if it does not already exist.
 * The table includes the following columns:
 * - id: INTEGER, serves as the primary key.
 * - category: TEXT, represents the category of the log entry.

/******  af730251-1a61-423b-b439-90209c62813d  *******/
const createTable = async () => {
  await db.transaction((tx) => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS LogEntry (
        id INTEGER PRIMARY KEY,
        category TEXT,
        description TEXT,
        timestamp DATE
      );
    `);
  });
};

const insertData = async (data: any[]) => {
  await db.transaction((tx) => {
    data.forEach((entry) => {
      tx.executeSql(`
        INSERT INTO LogEntry (id, category, description, timestamp)
        VALUES (?, ?, ?, ?);
      `, [entry.id, entry.category, entry.description, entry.timestamp]);
    });
  });
};

const testData = [
  { id: 1, category: 'test', description: 'test description', timestamp: new Date() },
  { id: 2, category: 'test2', description: 'test description2', timestamp: new Date() },
];

createTable().then(() => {
  insertData(testData);
});