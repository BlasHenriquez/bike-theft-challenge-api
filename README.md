<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Bikes theft challenge framework TypeScript starter repository.

## Installation

1. Clone the repository:

   `git clone git@github.com:BlasHenriquez/bike-theft-challenge-api.git`

2. Open a terminal in the repository API folder:

   `cd bike-theft-challenge`

3. Install dependencies:

   `npm install`

## Project configuration

1. Copy the `.env.example` file to `.env` in the same root folder:

   `cp .env.example .env`

## Database configuration

1. In the root of the API project, edit the file `.env` and configure these parameters using your Postgres configuration.

   ```
   POSTGRES_NAME=controlBikes
   POSTGRES_PORT=5432
   POSTGRES_PASSWORD=controlBikesPassword
   POSTGRES_USER=controlBikesUser
   POSTGRES_HOST=localhost
   ```
2. Start the database with docker

```
$ npm run infra:up
```

3. Database without install docker: in the root of the API project, edit the file `.env` and configure these parameters using this configuration to connect database of Heroku.

   ```
   NODE_ENV=production
   POSTGRES_URL= <url database>
   ```

## Running the app

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e

```

### Migrations.

To create a migration and implement changes in the db.

//**run old migrations, this project by default has alls migrations needed**

```
$ npm run migration:run
```

//generate a migration

```
$ npm run migration:generate name_new_migration
```

//run the migration

```
$ npm run migration:run
```

### Seeds.

To run the seeds and implement changes in the db.

//**run seeds in database**
```
$ npm run seed:run
```

## Documentation

This template uses swagger for documentation.
To see swagger, if you are using port 8080 for the api, it would be for example => localhost:8080/api

![imagen](https://ibb.co/WVrwqjk)

## Endpoint security

This challenge uses jwt tokens.

There are three types of validations on the endpoints.

- That it has a valid token, access-token.
- That it has a valid token and is role x, example delete user can only be done by the admin role, Roles decorator.
- That it has the correct user of the tables: polices and bike owners.