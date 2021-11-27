const { ObjectId } = require('bson');
const { getCollection } = require('../../db');

// constant for news collection, some sort of dependancy injection can be done here as an improvement
const NEWS = 'news';

const create = async (news) => {
  const { insertedIds } = await getCollection(NEWS).insertMany(news);
  return Object.values(insertedIds).map((objId) => objId.toString());
};

const update = async (id, doc) => {
  const result = await getCollection(NEWS).updateOne(
    { _id: ObjectId(id) },
    { $set: doc }
  );
  return result;
};

// TODO: add filtering and ordering
const list = async () => {
  const news = await getCollection(NEWS).find().toArray();
  return news;
};

const fetch = async (id) => {
  const findResult = await getCollection(NEWS).findOne({
    _id: ObjectId(id),
  });
  return findResult;
};

const del = async (id) => {
  const result = await getCollection(NEWS).deleteOne({
    _id: ObjectId(id),
  });
  return result;
};

module.exports = {
  create,
  update,
  list,
  fetch,
  del,
};
