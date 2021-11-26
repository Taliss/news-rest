const Router = require('koa-router');
const news = require('../controllers/news');

const router = new Router({ prefix: '/news' });

// router.get('/').post().put().patch().del().all();
router.get('/', (ctx) => {
  ctx.body = { foo: 'bar' };
});

module.exports = router;
