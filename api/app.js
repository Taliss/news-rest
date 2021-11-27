const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const apiRouter = require('./routes/api');
const errorHandler = require('./middlewares/error-handler');

const app = new Koa();

app
  .use(bodyParser())
  // .use(errorHandler)
  .use(apiRouter.middleware())
  .use(apiRouter.router.allowedMethods());

module.exports = app;
