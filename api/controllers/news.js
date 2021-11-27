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
  ctx.status = result.matchedCount ? 200 : 404;
};

const list = async (ctx, _next) => {
  // TODO: add filtering and ordering
  const result = await news.list();

  ctx.body = { news: result };
};

const fetch = async (ctx, _next) => {
  const findResult = await news.fetch(ctx.params.id);
  ctx.status = findResult ? 200 : 404;
  if (findResult) ctx.body = findResult;
};

const del = async (ctx, _next) => {
  const deleteResult = await news.del(ctx.params.id);
  ctx.status = deleteResult.deletedCount ? 204 : 404;
};

module.exports = {
  create,
  update,
  list,
  fetch,
  del,
};
