## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# NestJS Movies API

## Features

- Create, update, delete lists
- Retrieve all items or a single item by ID
- Search by params, query
- Input validation and error handling
- Swagger API documentation

## Endpoints

- POST ```/auth/register```
- POST ```/auth/login```


- GET ```/movies```
- GET ```/movies/:id```
- POST ```/movies```
- PATCH ```/movies/:id```
- DELETE ```/movies/:id```
- GET ```/movies/genre/:genre```
- GET ```/movies/search?title={title}```


- GET ```/users```
- GET ```/users?role={role}```
- GET ```/users/:id```
- PATCH ```/users/:id```
- DELETE ```/users/:id```


- GET ```/reviews```
- GET ```/reviews/:id```
- POST ```/reviews```
- PATCH ```/reviews/:id```
- DELETE ```/reviews/:id```
- GET ```/reviews/user/:userId```
- GET ```/reviews/movie/:movieId```

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
