const router = require('koa-joi-router');
const newsRouter = require('./news');
const version = require('../../package.json').version;

const apiRouter = router();
apiRouter.prefix('/api');

apiRouter
  .get('/version', (ctx) => (ctx.body = { version }))
  .use(newsRouter.middleware());

module.exports = apiRouter;
