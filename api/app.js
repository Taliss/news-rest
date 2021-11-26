const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const apiRouter = require('./routes/api');
const errorHandler = require('./middlewares/error-handler');

const app = new Koa();

app
  .use(errorHandler)
  .use(bodyParser())
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods());

module.exports = app;
