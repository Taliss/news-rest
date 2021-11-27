const { MongoClient } = require('mongodb');
const config = require('config');

let _db;
let _client;
const { URL, name } = config.get('db');

const establishDBConnection = async () => {
  _client = new MongoClient(URL);
  await _client.connect();
  _db = _client.db(name);
  console.log(`Connection to DB:${name} established.`);
};

module.exports = {
  establishDBConnection,
  closeConnection: async () => await _client.close(),
  getCollection: (col) => _db.collection(col),
};
