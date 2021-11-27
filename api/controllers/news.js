const { ObjectId } = require('bson');
const { getCollection } = require('../../db');

// constant for news collection, some sort of dependancy injection can be done here as an improvement
const NEWS = 'news';

const create = async (ctx, _next) => {
  const { news } = ctx.request.body;
  const { insertedIds } = await getCollection(NEWS).insertMany(news);
  ctx.status = 201;
  ctx.body = {
    insertedIds: Object.values(insertedIds).map((objId) => objId.toString()),
  };
};

const update = async (ctx, _next) => {
  const result = await getCollection(NEWS).updateOne(
    { _id: ObjectId(ctx.params.id) },
    { $set: ctx.request.body }
  );

  ctx.stauts = result.matchedCount ? 200 : 204;
};

const list = async (ctx, _next) => {
  const news = await getCollection(NEWS).find().toArray();
  ctx.body = {
    news,
  };
};

const fetch = async (ctx, _next) => {
  const findResult = await getCollection(NEWS).findOne({
    _id: ObjectId(ctx.params.id),
  });
  ctx.status = findResult ? 200 : 404;
  if (findResult) ctx.body = findResult;
};

const del = async (ctx, _next) => {
  await getCollection(NEWS).deleteOne({
    _id: ObjectId(ctx.params.id),
  });
  ctx.status = 204;
};

module.exports = {
  create,
  update,
  list,
  fetch,
  del,
};
