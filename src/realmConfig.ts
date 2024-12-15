const LogEntrySchema = {
    name: 'LogEntry',
    properties: {
      id: 'int', // Primary Key, unique identifier for each entry
      category: 'string', // Category (Nutrition, Physical Health, etc.)
      description: 'string', // User-provided description
      timestamp: 'date', // When the entry was created
    },
    primaryKey: 'id', // Set the primary key to 'id'
  };
  