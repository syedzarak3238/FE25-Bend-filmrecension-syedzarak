# FilmRecension

REST API for browsing movies, writing reviews and keeping a personal watchlist.
Built with Node.js, Express, MySQL (mysql2), bcrypt and JWT.

## Installation
1. `npm install express@^4 mysql2 bcrypt jsonwebtoken dotenv`
2. Copy `.env.example` to `.env` and fill in your values.

## Database setup
`mysql -u root -p < database/setup.sql`

## Start
`npm start`  (server runs on http://localhost:3000)

## Routes
| Method | Route | Purpose | Auth |
|---|---|---|---|
| POST | /api/auth/register | Create an account | Public |
| POST | /api/auth/login | Log in, receive token | Public |
| GET | /api/movies | List movies | Public |
| GET | /api/movies/:id | Get one movie | Public |
| GET | /api/movies/:movieId/reviews | List reviews | Public |
| POST | /api/movies/:movieId/reviews | Create review | Signed in |
| PUT | /api/reviews/:id | Update own review | Owner |
| GET | /api/watchlist | My saved movies | Signed in |
| POST | /api/watchlist/:movieId | Save a movie | Signed in |
| DELETE | /api/watchlist/:movieId | Remove saved movie | Signed in |

## Design decisions
- One review per user per movie because ...
- JWT because ...
- PUT/PATCH because ...

## ER diagram
See `docs/`.
