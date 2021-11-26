const Router = require('koa-router');
const version = require('../../package.json').version;

const newsRouter = require('./news');

const router = new Router({ prefix: '/api' });

router.get('/version', (ctx) => (ctx.body = { version }));
router.use(newsRouter.routes());

module.exports = router;
