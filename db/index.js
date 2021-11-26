const { MongoClient } = require('mongodb');
const config = require('config');

let db;
const establishDBConnection = async () => {
  const { URL, name } = config.get('db');

  const mongoClient = new MongoClient(URL);
  await mongoClient.connect();
  db = mongoClient.db(name);
  console.log(`Connection to DB:${name} established.`);
};

module.exports = {
  establishDBConnection,
  getCollection: (col) => db.collection(col),
};
