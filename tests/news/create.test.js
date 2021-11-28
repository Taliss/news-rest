const request = require('supertest');
const app = require('../../api/app');
const testData = require('../../test-post-data.json');
const {
  closeConnection,
  getCollection,
  establishDBConnection,
} = require('../../db');

const validNews = {
  title: 'test title',
  description: 'test description',
  text: 'test text !',
};
// there is nothing we can do if error occurs in beforeAll or afterAll, so... let it pop
beforeAll(async () => {
  await establishDBConnection();
});

afterAll(async () => {
  await getCollection('news').drop();
  await closeConnection();
});

describe('Testing with invalid or missing types', () => {
  test.each([[], {}, '', null, undefined])(
    'should not create when news prop is: %s',
    async (testValue) => {
      await request(app.callback())
        .post('/api/news')
        .send({ news: testValue })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(expect.any(String));
        });
    }
  );

  test.each([[], '', null, undefined])(
    'should not create when body is %s',
    async (testValue) => {
      await request(app.callback())
        .post('/api/news')
        .send(testValue)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toEqual(expect.any(String));
        });
    }
  );
});

/* eslint-disable no-unused-vars */
describe('Testing with failing validation data', () => {
  test.each([
    { news: { foo: 'foo', ...validNews }, description: 'extra prop' },
    {
      news: { title: validNews.title, description: validNews.description },
      description: 'missing prop',
    },
  ])('should not create when $description', async ({ news, description }) => {
    await request(app.callback())
      .post('/api/news')
      .send({ news: [news] })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(expect.any(String));
      });
  });

  test.each([
    { news: { ...validNews, title: 10 }, description: 'title' },
    {
      news: { ...validNews, description: 10 },
      description: 'description',
    },
    { news: { ...validNews, text: 10 }, description: 'text' },
  ])(
    'should not create when one or more props are different than strings.Invalid: $description',
    async ({ news, description }) => {
      await request(app.callback())
        .post('/api/news')
        .send({ news: [news] })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toMatch(/must be a string/);
        });
    }
  );

  test.each([
    { news: { ...validNews, title: '1' }, description: 'title' },
    {
      news: { ...validNews, description: '1' },
      description: 'description',
    },
    { news: { ...validNews, text: '123456789' }, description: 'text' },
  ])(
    'should not create when min chararacters are not provided for: $description',
    async ({ news, description }) => {
      await request(app.callback())
        .post('/api/news')
        .send({ news: [news] })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toMatch(/length must be at least/);
        });
    }
  );

  //  with more than max characters
  test.each([
    {
      news: {
        ...validNews,
        title: Array(20).fill('qwerty123456qwerty20').join(),
      },
      description: 'title',
    },
    {
      news: {
        ...validNews,
        description: Array(20).fill('qwerty123456qwerty20').join(),
      },
      description: 'description',
    },
  ])(
    'should not create when min chararacters are not provided for: $description',
    async ({ news, description }) => {
      await request(app.callback())
        .post('/api/news')
        .send({ news: [news] })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toMatch(/length must be less than/);
        });
    }
  );
});
/* eslint-enable no-unused-vars */

describe('Testing with valid bulk of news', () => {
  test('should not insert when more than 1k news are passed', async () => {
    await request(app.callback())
      .post('/api/news')
      .send({ news: Array(1001).fill(validNews) })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/must contain less than/);
      });
  });

  test('should create news', async () => {
    await request(app.callback())
      .post('/api/news')
      .send({
        news: testData,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.insertedIds).toHaveLength(testData.length);
      });
  });
});
