const router = require('koa-joi-router');
const joiObjectId = require('joi-objectid');
const news = require('../controllers/news');

const newsRouter = router();
const joi = router.Joi;
joi.objectId = joiObjectId(joi);

newsRouter.prefix('/news');

const newsSchema = {
  title: joi.string().required().min(2).max(200),
  description: joi.string().required().min(2).max(350),
  text: joi.string().required().min(10),
};

const orderScheme = joi.string().lowercase().valid('asc', 'desc');

newsRouter
  .get(
    '/',
    {
      validate: {
        query: joi.object({
          from: joi.date().iso(),
          to: joi
            .date()
            .iso()
            .when('from', {
              is: joi.exist(),
              then: joi.date().greater(joi.ref('from')),
            }),
          title: joi.string().max(50),
          byDate: orderScheme,
          byTitle: orderScheme,
        }),
      },
    },
    news.list
  )
  .post(
    '/',
    {
      validate: {
        body: joi.object({
          news: joi
            .array()
            .items(joi.object({ ...newsSchema }))
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
    { validate: { params: { id: joi.objectId().required() } } },
    news.fetch
  )
  .put(
    '/:id',
    {
      validate: {
        body: joi.object({ ...newsSchema }),
        params: { id: joi.objectId().required() },
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
          .object({ ...newsSchema })
          .fork(Object.keys(newsSchema), (schema) => schema.optional())
          .min(1),
        params: { id: joi.objectId().required() },
        type: 'json',
      },
    },
    news.update
  )
  .delete(
    '/:id',
    {
      validate: {
        params: { id: joi.objectId().required() },
      },
    },
    news.del
  );

module.exports = newsRouter;
