const { ObjectId } = require('mongodb');
const _isEmpty = require('ramda').isEmpty;
const { getCollection } = require('../../db');

// constant for news collection, some sort of dependancy injection can be done here as an improvement
const NEWS = 'news';

const create = async (news) => {
  const newsWithDate = news.map((x) => ({
    ...x,
    date: new Date().toISOString(),
  }));
  const { insertedIds } = await getCollection(NEWS).insertMany(newsWithDate);
  return Object.values(insertedIds).map((objId) => objId.toString());
};

const update = async (id, doc) => {
  const result = await getCollection(NEWS).updateOne(
    { _id: ObjectId(id) },
    { $set: doc }
  );
  return result;
};

const list = async (filters, order) => {
  let query = {};
  if (!_isEmpty(filters)) {
    if (filters.from) query.date = { $gte: filters.from.toISOString() };
    if (filters.to)
      query.date = { ...query.date, $lte: filters.to.toISOString() };
    if (filters.title) query.title = { $regex: new RegExp(filters.title, 'i') };
  }

  let sort = {};
  if (!_isEmpty(order)) {
    if (order.byDate) sort.date = order.byDate === 'asc' ? 1 : -1;
    if (order.byTitle) sort.title = order.byTitle === 'asc' ? 1 : -1;
  }

  const news = await getCollection(NEWS).find(query).sort(sort).toArray();
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
