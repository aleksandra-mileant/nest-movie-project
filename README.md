## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# NestJS Movies API

## Features

- Create, update, delete movies
- Retrieve all movies or a single movie by ID
- Search movies by genre
- Input validation and error handling
- Swagger API documentation

## Endpoints

- GET ```/movies```
- GET ```/movies/:id```
- POST ```/movies```
- PATCH ```/movies/:id```
- DELETE ```/movies/:id```
- GET ```/movies/genre/:genre```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Sequelize ORM
- npm or yarn

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Project Structure

```src/
├── app.module.ts
├── main.ts
├── movies/
│   ├── dto/
│   │   ├── create-movie.dto.ts
│   │   ├── update-movie.dto.ts
│   │   └── movie-response.dto.ts
│   ├── movies.controller.ts
│   ├── movies.model.ts
│   ├── movies.module.ts
│   ├── movies.service.ts
│   └── movies.constants.ts
└── configs/
└── server.config.ts
```

## SWAGGER

http://localhost:${APPLICATION_PORT}/api#/

## License

Nest is [MIT licensed](LICENSE).
