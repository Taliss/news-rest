const request = require('supertest');
const app = require('../../api/app');
const news = require('../../api/models/news');
const testData = require('../../test-post-data.json');

const {
  closeConnection,
  getCollection,
  establishDBConnection,
} = require('../../db');

beforeAll(async () => {
  try {
    await establishDBConnection();
    await news.create(testData.map((x) => ({ ...x })));
  } catch (err) {
    console.error('Unable to run tests duo to error while doing test setup');
    throw err;
  }
});

afterAll(async () => {
  await getCollection('news').drop();
  await closeConnection();
});

describe('Fetching list of news records', () => {
  test('should return all news', async () => {
    await request(app.callback())
      .get(`/api/news`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(testData.length);
        expect(res.body[0]).toEqual(expect.objectContaining(testData[0]));
        expect(res.body[0]._id).toEqual(expect.any(String));
        expect(res.body[0]._id).toHaveLength(24);
        expect(res.body[0].date).toEqual(expect.any(String));
      });
  });
});

//allowed filters from, to, title -> all optional
describe('Fetching list of news records with filters', () => {
  test('should reject request when invalid filter is given', async () => {
    await request(app.callback())
      .get('/api/news?noSuchFilter=123')
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/is not allowed/);
      });
  });

  test('should reject request from or to are invalid ISO dates', async () => {
    await request(app.callback())
      .get('/api/news?from=2021-abc')
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/must be in ISO/);
      });

    await request(app.callback())
      .get('/api/news?to=2021-abc')
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/must be in ISO/);
      });
  });

  test('should reject request when from is greater than to', async () => {
    await request(app.callback())
      .get('/api/news?from=2021-11-28&to=2021-10-28')
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/must be greater/);
      });
  });

  test('should reject request when title filter greater than 50', async () => {
    await request(app.callback())
      .get(
        '/api/news?title=somethingLongerThanFiftySymbolsSendAndThisCanCauseTroublesButWeCatchItHopeNowThisIsLongEnought'
      )
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/must be less than or equal to 50/);
      });
  });

  test('should return all dummy data when using word that exist in every title', async () => {
    await request(app.callback())
      .get('/api/news/?title=pokemon')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(testData.length);
      });
  });

  test('should return only one specific doc', async () => {
    await request(app.callback())
      .get('/api/news/?title=bulba')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
      });
  });
});

describe('Fetching list of news with ordering', () => {
  test('should reject request when invalid order value is given', async () => {
    await request(app.callback())
      .get('/api/news?byTitle=strange')
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/asc, desc/);
      });
  });

  test('should return sorted records by title in ASC order', async () => {
    await request(app.callback())
      .get('/api/news?byTitle=asc')
      .expect(200)
      .expect((res) => {
        expect(res.body[0].title).toEqual(testData[0].title);
      });
  });

  test('should return sorted records by title in DESC order', async () => {
    await request(app.callback())
      // not case sensitive
      .get('/api/news?byTitle=DESC')
      .expect(200)
      .expect((res) => {
        expect(res.body[0].title).toEqual(testData[2].title);
      });
  });
});
