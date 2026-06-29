# Koursify

Koursify is a full-stack learning platform with student course purchasing and
progress tracking, plus instructor course and lecture management.

## Stack

- React 18, Vite, Redux Toolkit Query, Tailwind CSS, and Radix UI
- Express, MongoDB, and Mongoose
- JWT Bearer authentication
- Cloudinary for course images and lecture videos
- Razorpay for payments

## Local setup

Requirements: Node.js 18+ and MongoDB.

1. Copy `.env.example` to `.env` and fill in the required credentials.
2. Install dependencies:

   ```sh
   npm install
   npm install --prefix client
   ```

3. Start the API from the repository root:

   ```sh
   npm run dev
   ```

4. In another terminal, start the frontend:

   ```sh
   npm run dev --prefix client
   ```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the
API at `http://localhost:5000`.

For a separately deployed frontend, set `VITE_API_BASE_URL` to the public API
root, for example `https://api.example.com/api`.

## Accounts

Public registration creates student accounts only. Instructor roles must be
assigned by a trusted administrator directly in the database. This prevents a
public user from granting themselves course-management access.

## Production build

```sh
npm run build
npm start
```

The Express server serves the generated `client/dist` application.

## Main API areas

- `/api/user` — registration, login, and profiles
- `/api/course` — course and lecture management and discovery
- `/api/media` — authenticated instructor video uploads
- `/api/purchase` — Razorpay order creation and verification
- `/api/progress` — enrolled-student course progress
