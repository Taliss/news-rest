# news-rest

simple rest-api with CRUD operations for dummy news

## Running project

# Running the project outside of a docker

This rest api requires **node v12.18.4** or higher
It's using mongo as DB, so either local installation or container will be required in order to connect.

```
$ npm start
```

or running it with nodemon for dev

```
$ npm run dev
```

## Running the project with docker-compose

If you have docker and docker-composed on your machine:

```
docker-compose up --build -d
```

This will run _mongo_, _mongo web-client_ -> (_MongoExpress_), and the _rest-api_

Than you can attach to our rest-api:

```
docker attach res-api
```

This setup is exposing default ports:

- node (_rest-api_): 3000
- mongo (_DB_): 27017
- mongo-client (_MongoExpress_): 8081

It's also utilizing npm [_config_](https://github.com/lorenwest/node-config) module in order to handle and configure env variables for different envs (prod, dev, test, etc.)

## Running tests

The project contains integration test, which are not containarized. In order to run them, you will need to have node installed. It's also using **Jest** as test engine, which by default sets your **NODE_ENV** to **test** if it's not already set.

```
npm run test
```

## Linting

```
npm run lint
npm run lint:fix
```

## Env variables

Be free to look aroud and change some of them. Keep in mind that some of the env variables can be passed down from our _docker-compose.yml_ file or another npm module (_jest_).

## About this project

- using [Koa](https://github.com/koajs/koa) as web-server.
- using [koa-joi-router](https://github.com/koajs/joi-router) for routing and validation.
- using [jest](https://github.com/facebook/jest) with [supertest](https://github.com/visionmedia/supertest) for integration testing.

## Things that should be improved

- the integration setup is kinda bad (no global setup and teardown files for jest)
- the documentation needs to be improved (currently the routes definition and scheme are serving as doc for the api)

## Things that can be improved

- Adding _openAPI_ ( swagger v3). Also look around if it's possible to auto generate openapi schemes from joi.
- Dockerized integration-tests (big topic)
- More documentation
- Maybe some unit tests
- Adding versioning to our api-endpoints
- Expose something else as id for the endpoints ( slug, or title ) instead of mongodb native objectId.
- Maybe some CI/DI
- Volume for our DB
- Possibly make title unique
- Maybe some initial data-seeding for the DB (docker entrypoint with init script)
- Currently the api is very restictive ( this can be good or bad, depending on the situation )
- Maybe allow timestamps to be passed also ( currently only ISODate is valid)
