const Router = require('koa-router');
const news = require('../controllers/news');

const router = new Router({ prefix: '/news' });

router
  .get('/', news.list)
  .post('/', news.create)
  .get('/:id', news.fetch)
  .put('/:id', news.update)
  .patch('/:id', news.update)
  .del('/:id', news.del);

module.exports = router;
