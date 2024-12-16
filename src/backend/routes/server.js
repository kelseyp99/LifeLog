const express = require('express');
const Realm = require('realm');

const app = express();

const realmConfig = {
  schema: [
    {
      name: 'MyObject',
      properties: {
        name: 'string',
        age: 'int',
      },
    },
  ],
  path: '/sdcard/myapp/realm/myrealm.realm',
};

app.get('/objects', (req, res) => {
  const realm = new Realm(realmConfig);
  const objects = realm.objects('MyObject');
  res.json(objects);
});

app.post('/objects', (req, res) => {
  const realm = new Realm(realmConfig);
  const object = realm.create('MyObject', req.body);
  res.json(object);
});

app.put('/objects/:id', (req, res) => {
  const realm = new Realm(realmConfig);
  const id = req.params.id;
  const object = realm.objectForPrimaryKey('MyObject', id);
  if (object) {
    realm.write(() => {
      object.name = req.body.name;
      object.age = req.body.age;
    });
    res.json(object);
  } else {
    res.status(404).json({ error: 'Object not found' });
  }
});

app.delete('/objects/:id', (req, res) => {
  const realm = new Realm(realmConfig);
  const id = req.params.id;
  const object = realm.objectForPrimaryKey('MyObject', id);
  if (object) {
    realm.write(() => {
      realm.delete(object);
    });
    res.json({ message: 'Object deleted' });
  } else {
    res.status(404).json({ error: 'Object not found' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});