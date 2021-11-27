const news = require('../models/news');

const create = async (ctx, _next) => {
  const { news: requestNews } = ctx.request.body;
  const insertedIds = await news.create(requestNews);

  ctx.status = 201;
  ctx.body = {
    insertedIds,
  };
};

const update = async (ctx, _next) => {
  const result = await news.update(ctx.params.id, ctx.request.body);

  ctx.assert(result.matchedCount, 404);
  ctx.body = {};
};

const list = async (ctx, _next) => {
  // TODO: add filtering and ordering
  const result = await news.list();
  ctx.body = result;
};

const fetch = async (ctx, _next) => {
  const findResult = await news.fetch(ctx.params.id);

  ctx.assert(findResult, 404);
  ctx.body = findResult;
};

// delete will not be idempotent with this behavior
const del = async (ctx, _next) => {
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
