const Koa = require('koa');
const apiRouter = require('./routes/api');

const app = new Koa();

app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

module.exports = app;
