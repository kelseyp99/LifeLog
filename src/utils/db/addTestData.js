import Realm from 'realm';

const MySchema = {
  name: 'MyObject',
  properties: {
    name: 'string',
    age: 'int',
  },
};

const realm = new Realm({ schema: [MySchema] });

realm.write(() => {
  const myObject1 = realm.create('MyObject', {
    name: 'John Doe',
    age: 30,
  });

  const myObject2 = realm.create('MyObject', {
    name: 'Jane Smith',
    age: 25,
  });

  // Add more test data here
});