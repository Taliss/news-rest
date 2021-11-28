const news = require('../models/news');
const _pick = require('ramda').pick;

const create = async (ctx) => {
  const { news: requestNews } = ctx.request.body;
  const insertedIds = await news.create(requestNews);

  ctx.status = 201;
  ctx.body = {
    insertedIds,
  };
};

const update = async (ctx) => {
  const result = await news.update(ctx.params.id, ctx.request.body);

  ctx.assert(result.matchedCount, 404);
  ctx.body = {};
};

// utility functions just for list
const list = async (ctx) => {
  // TODO: add ordering
  const result = await news.list(_pick(['from', 'to', 'title'], ctx.query));
  ctx.body = result;
};

const fetch = async (ctx) => {
  const findResult = await news.fetch(ctx.params.id);

  ctx.assert(findResult, 404);
  ctx.body = findResult;
};

// delete will not be idempotent with this behavior
const del = async (ctx) => {
  const deleteResult = await news.del(ctx.params.id);

  ctx.assert(deleteResult.deletedCount, 404);
  ctx.body = {};
};

module.exports = {
  create,
  update,
  list,
  fetch,
  del,
};
