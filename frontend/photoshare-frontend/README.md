# Photoshare Frontend

React (Vite) single-page application for the photo-storing app. Built to work
with the Node/Express/MongoDB/Cloudinary backend from the previous ICE task.

## Tech stack

- React (via Vite)
- React Router v7 (`react-router`, not `react-router-dom`)
- Axios
- jwt-decode
- Tailwind CSS + DaisyUI

## Project structure

```
src/
  main.jsx                     Entry point; sets axios base URL
  App.jsx                      Routes: /login, /register, and protected routes (/, /profile, /profiles)
  App.css                      Tailwind + DaisyUI imports
  index.css                    Vite boilerplate styling cleared (Tailwind handles styling now)
  utils/
    isLoggedIn.js              Decodes the JWT in localStorage and checks expiry
    ProtectedRoute.jsx          Redirects to /login if isLoggedIn() is false
  components/
    Navbar.jsx                  Top nav with links + logout
    auth/
      Login.jsx
      Register.jsx
      Logout.jsx
    users/
      Profile.jsx               View/update the logged-in user's own profile
      Profiles.jsx               Admin-only table: promote/demote/delete users
    photos/
      Gallery.jsx                Upload form + photo grid, delete own/any photo
```

## Setup

1. Make sure the backend from the previous task is running on
   `http://localhost:5000` (this is hardcoded as the axios base URL in
   `main.jsx` -- change it there if your backend runs elsewhere).
2. Install dependencies:
   ```
   npm install
   ```
3. Run the dev server:
   ```
   npm run dev
   ```
4. Open the printed local URL (usually `http://localhost:5173`).

## Notes on how it fits the backend

- **Auth**: on login/signup, the JWT is stored in `localStorage` under the key
  `token` and attached as an `Authorization: Bearer <token>` header on every
  protected request.
- **Routing**: `/login` and `/register` are public. `/`, `/profile`, and
  `/profiles` are wrapped in `ProtectedRoute`, which checks `isLoggedIn()` and
  redirects to `/login` if the token is missing or expired.
- **Gallery**: `GET /api/photos` returns an array of photos directly (per the
  backend's contract), so `Gallery.jsx` treats the response as `photo[]`
  rather than `{ photos: [] }`.
- **Admin table**: `GET /api/users` similarly returns a plain array, so
  `Profiles.jsx` maps over `profiles` directly, not `profiles.users`. This
  page will show a "not authorized" message for any non-admin user, since the
  backend restricts that route to admins with a 403.
- **Photo upload**: the file input's `name="photo"` in the form, but it's
  appended to `FormData` under the key `"image"` -- this matches the
  backend's Multer config (`upload.single('image')`).
- **Error handling**: components read `err.response.data.message` on failed
  requests, matching the shape your backend's error handler returns
  (`{ message: "..." }`).

## Known gaps / things to build out further

- No dedicated "Update Photo" UI yet (the backend supports
  `PUT /api/photos/:photoId`, but Gallery.jsx currently only wires up upload
  and delete). Add an edit form/modal if your assignment needs full CRUD in
  the UI.
- No pagination or loading skeleton on the Gallery grid.
- No client-side role check to hide the "Users" nav link from non-admins
  (the page itself blocks access, but the link is always visible).
