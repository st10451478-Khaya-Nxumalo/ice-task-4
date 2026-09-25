# Photo Storing API

Backend REST API for a photo-storing MERN application. Supports user
signup/login with JWT auth, profile management, an admin console for user
management, and a Cloudinary-backed photo gallery.

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (jsonwebtoken)
- Cloudinary (image storage)
- Multer (multipart/form-data handling, in-memory storage)
- bcryptjs (password hashing)

## Project structure

```
config/db.js              MongoDB connection
models/User.js            User schema (hashed password, role)
models/Photo.js           Photo schema
middleware/auth.js         protect (JWT check) + requireAdmin
middleware/upload.js       Multer config (memory storage, image-only, 5MB limit)
middleware/errorHandler.js Centralized error handling (validation, duplicate key, cast, multer)
controllers/               Route logic for auth, users, photos
routes/                    Express routers
util/cloudinary.js         Provided Cloudinary upload/delete helpers
util/generateToken.js      JWT signing helper
app.js                     Express app (middleware + route wiring)
server.js                  Entry point (connects DB, starts server)
postman/                   Postman collection covering every route
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
   - `MONGO_URI`: your MongoDB connection string (Atlas or local)
   - `JWT_SECRET`: any long random string
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`:
     from your Cloudinary dashboard (cloudinary.com)
3. Run the server:
   ```
   npm run dev      # with nodemon
   npm start        # plain node
   ```
   Server starts on `PORT` (default `5000`).

## Creating the first admin

New accounts always default to the `user` role via the schema, and promoting
a user requires an existing admin — so the very first admin has to be set
manually. After signing up a user through `/api/auth/signup`, flip their role
directly in MongoDB, e.g. via `mongosh`:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

That account can then log in and promote/demote others through the API.

## Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | - | Register (default role: user) |
| POST | /api/auth/login | - | Log in, returns JWT |
| GET | /api/users/me | User | Get own profile |
| PUT | /api/users/me | User | Update own username/email |
| GET | /api/users | Admin | List all users |
| DELETE | /api/users/:userId | Admin | Delete a user |
| PUT | /api/users/:userId/promote | Admin | Promote user to admin |
| PUT | /api/users/:userId/demote | Admin | Demote admin to user |
| GET | /api/photos | User | Gallery (all photos) |
| GET | /api/photos/all | Admin | All photos (admin view) |
| POST | /api/photos | User | Upload photo (`multipart/form-data`: `image`, `title`, `description`) |
| PUT | /api/photos/:photoId | Owner/Admin | Update title/description/image |
| DELETE | /api/photos/:photoId | Owner/Admin | Delete photo + Cloudinary asset |

All routes except signup/login require `Authorization: Bearer <token>`.

## Design notes / assumptions

- **Password security**: hashed with bcrypt in a pre-save hook; `select:
  false` on the field plus a `toJSON` override ensure hashes never leak in
  API responses even if a query explicitly selects it.
- **Role safety**: `role` is never accepted from client input on signup —
  the schema default (`user`) is always used, so a client can't self-promote
  by sending `"role": "admin"` in the signup body.
- **JWT payload**: contains `id`, `role`, and an expiry (`exp`, embedded
  automatically by the `expiresIn` option), per the spec.
- **Image replacement ordering**: on `PUT /api/photos/:photoId` with a new
  file, the new image is uploaded to Cloudinary and the DB record saved
  *before* the old Cloudinary asset is deleted, so a failed upload never
  leaves the photo without a valid image.
- **Route ordering**: `/api/photos/all` is declared before
  `/api/photos/:photoId` so Express doesn't try to parse `"all"` as an ID.
- **`GET /api/photos/all`**: kept as a distinct admin-only route from `GET
  /api/photos` as specified, even though both currently return the same
  photo set — this keeps room for the public gallery view to later diverge
  (e.g. pagination, moderation flags) without breaking the admin route's
  contract.

## Postman collection

`postman/photo-storing-api.postman_collection.json` covers every route,
including expected-failure cases (missing token, wrong role, wrong owner,
duplicate email, bad login). It chains requests using collection variables
(`userToken`, `adminToken`, `userId`, `photoId`, etc.) set by test scripts,
so running folder-by-folder (Auth → Users → Photos) populates everything
needed for later requests automatically.

Two things need manual action in Postman before running the full suite:

1. **First admin**: see "Creating the first admin" above — do this, then
   run `Login - Regular User` again with that account's credentials (or add
   a login request for it) to populate `adminToken` from a genuine admin.
2. **Upload Photo**: open the request, go to the `image` form field, and
   attach a real image file from your machine (binary file references can't
   be bundled inside a portable collection export).

Import the collection into Postman, set `baseUrl` if not running on
`localhost:5000`, and run.

## Submission checklist

- [ ] Push this repo to GitHub
- [ ] Confirm `.env` is **not** committed (already in `.gitignore`)
- [ ] Export/commit the Postman collection (already included under `postman/`)
- [ ] Submit the GitHub repo link
