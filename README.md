# Boss Machine

This project is an exercise from Codecademy's "Build APIs" path, where the task was to build the entire Express server and its routes from scratch on top of a provided React frontend and a simple file-based database.

## Project Overview

Boss Machine is a REST API-driven management application for today's most successful (evil) entrepreneurs. The API manages three resources: `minions` (your henchmen), `ideas` (your million-dollar ideas), and `meetings` (all the annoying meetings that keep getting added to your schedule).

You can view a video demonstration of the final app here:

<video width="100%" height="100%" controls>
   <source src="https://s3.amazonaws.com/codecademy-content/programs/build-apis/solution-videos/BossMachine480.mov" type="video/mp4">
 The markdown processor does not support the video tag.
</video>

## Tech/framework used

<b>Built with</b>

- [Express](https://expressjs.com/) – API server
- [body-parser](https://www.npmjs.com/package/body-parser) – JSON parsing of request bodies
- [cors](https://www.npmjs.com/package/cors) – CORS middleware
- [Mocha](https://mochajs.org/) / [Chai](https://www.chaijs.com/) / [Supertest](https://www.npmjs.com/package/supertest) – test suite
- React frontend (provided, built with Webpack)

## Features

- Full CRUD API for `minions` and `ideas`
- `meetings` endpoints to create, list, and clear meetings
- Custom `checkMillionDollarIdea` middleware that validates an idea is actually worth at least one million dollars (`numWeeks * weeklyRevenue >= 1,000,000`) before it can be created or updated
- Simple in-memory database (`server/db.js`) that reseeds on every server restart

## API Reference

All routes are mounted under `/api`.

### `/api/minions`

| Method | Path               | Description         |
| ------ | ------------------ | -------------------- |
| GET    | `/api/minions`     | Get all minions       |
| POST   | `/api/minions`     | Create a new minion    |
| GET    | `/api/minions/:id` | Get a single minion    |
| PUT    | `/api/minions/:id` | Update a minion         |
| DELETE | `/api/minions/:id` | Delete a minion         |

**Schema:**

```
{
  id: string,
  name: string,
  title: string,
  salary: number
}
```

### `/api/ideas`

| Method | Path             | Description                             |
| ------ | ---------------- | ----------------------------------------- |
| GET    | `/api/ideas`     | Get all ideas                             |
| POST   | `/api/ideas`     | Create a new idea (must clear million-dollar check) |
| GET    | `/api/ideas/:id` | Get a single idea                         |
| PUT    | `/api/ideas/:id` | Update an idea (must clear million-dollar check)    |
| DELETE | `/api/ideas/:id` | Delete an idea                             |

**Schema:**

```
{
  id: string,
  name: string,
  description: string,
  numWeeks: number,
  weeklyRevenue: number
}
```

> POST and PUT go through the `checkMillionDollarIdea` middleware, which rejects ideas where `numWeeks * weeklyRevenue < 1,000,000` with a `400 Bad Request`.

### `/api/meetings`

| Method | Path            | Description                     |
| ------ | --------------- | --------------------------------- |
| GET    | `/api/meetings` | Get all meetings                  |
| POST   | `/api/meetings` | Create a new (auto-generated) meeting |
| DELETE | `/api/meetings` | Delete all meetings                |

**Schema:**

```
{
  time: string,
  date: Date,
  day: string,
  note: string
}
```

> Meetings are generated automatically via `createMeeting()` in `server/db.js` – POST requests don't need a body.

## Installation

1. Clone/download the project and open the root directory in your terminal.
2. Install dependencies and build the frontend:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm run start
   ```

   The server listens on port `4001` (`Server is listening on port: 4001`). Changes to **app.js/main.js** and the **server/** folder are automatically picked up via nodemon.

4. Open **index.html** in a browser (Chrome 60+ or Firefox 55+) to view the frontend application.

## Tests

The project has a full test suite covering all routes and edge cases.

```bash
npm run test        # run the whole suite in watch mode
npx mocha           # run the suite once
npm run test:minions
npm run test:ideas
npm run test:meetings
npm run test:checkMillionDollarIdea
npm run test:work
```

## Credits

The original project scaffold, frontend, and test suite are provided by [Codecademy](https://www.codecademy.com/) as part of their "Build APIs" skill path.
