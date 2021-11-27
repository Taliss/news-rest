const router = require('koa-joi-router');
const news = require('../controllers/news');

const newsRouter = router();
const joi = router.Joi;
newsRouter.prefix('/news');

const userSchema = {
  title: joi.string().required().min(2).max(200),
  description: joi.string().required().min(2).max(350),
  text: joi.string().required().min(10),
};

newsRouter
  .get('/', news.list)
  .post(
    '/',
    {
      validate: {
        body: joi.object({
          news: joi
            .array()
            .items(joi.object({ ...userSchema }))
            .min(1)
            .max(1000)
            .required(),
        }),
        type: 'json',
      },
    },
    news.create
  )
  .get(
    '/:id',
    { validate: { params: { id: joi.string().min(24).max(24).required() } } },
    news.fetch
  )
  .put(
    '/:id',
    {
      validate: {
        body: joi.object({ ...userSchema }),
        params: { id: joi.string().min(24).max(24).required() },
        type: 'json',
      },
    },
    news.update
  )
  .patch(
    '/:id',
    {
      validate: {
        body: joi
          .object({ ...userSchema })
          .fork(Object.keys(userSchema), (schema) => schema.optional())
          .min(1),
        params: { id: joi.string().min(24).max(24).required() },
        type: 'json',
      },
    },
    news.update
  )
  .delete(
    '/:id',
    {
      validate: {
        params: { id: joi.string().min(24).max(24).required() },
        type: 'json',
      },
    },
    news.del
  );

module.exports = newsRouter;
