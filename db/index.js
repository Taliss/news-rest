const { MongoClient } = require('mongodb');
const config = require('config');

let db;
const establishDBConnection = async () => {
  const { user, pass, host, name, port } = config.get('db');

  const mongoClient = new MongoClient(
    `mongodb://${user}:${pass}@${host}:${port}/`
  );
  await mongoClient.connect();
  db = mongoClient.db(name);
  console.log(`Connection to DB:${name} established.`);
};

module.exports = {
  establishDBConnection,
  collection: (collection) => db.collection(collection),
};
