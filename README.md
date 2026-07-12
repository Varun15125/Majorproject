# StayEasy

StayEasy is a full-stack hotel booking web application built with Node.js, Express, MongoDB, and EJS. It allows users to browse accommodation listings, create and manage listings, add reviews, and authenticate with local accounts. Images are uploaded to Cloudinary and sessions are persisted with MongoDB.

## Features

- User authentication with Passport.js and Passport-Local-Mongoose
- Create, read, update, and delete hotel listings
- Image upload support via Cloudinary and Multer
- Listing reviews with rating and comments
- Server-side validation with Joi
- Flash messages and session handling
- MongoDB session store via connect-mongo
- Responsive views using EJS templates

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- EJS + ejs-mate
- Passport.js
- Joi
- Multer + Cloudinary
- express-session + connect-mongo
- connect-flash
- method-override

## Project Structure

- `app.js` - main application entrypoint
- `cloudConfig.js` - Cloudinary configuration and storage setup
- `middleware.js` - custom route and validation middleware
- `schema.js` - Joi validation schemas
- `models/` - Mongoose models for listings, reviews, and users
- `routes/` - Express routers for listings, reviews, and users
- `controllers/` - business logic separated from route definitions
- `views/` - EJS templates and layouts
- `public/` - static CSS and client-side JavaScript

## Installation

1. Clone the repository

```bash
git clone <repo-url>
cd Majorproject
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file at the project root with these variables:

```env
NODE_ENV=development
ATLASDB_URL=<your-mongodb-connection-string>
SECRET=<your-session-secret>
CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUD_API_KEY=<your-cloudinary-api-key>
CLOUD_API_SECRET=<your-cloudinary-api-secret>
```

## Running the App

Start the server:

```bash
node app.js
```

Then open:

```text
https://hotel-project-68mz.onrender.com
```

## Usage

- Visit `/signup` to create a new account
- Visit `/login` to sign in
- Browse listings on the homepage
- Add new listings once logged in
- Edit or delete your own listings
- Submit reviews for listings

## Notes

- Image uploads are sent to Cloudinary, so valid Cloudinary credentials are required
- Sessions are stored in MongoDB through `connect-mongo`
- The application expects `NODE_ENV` to be set to `production` only in a deployed environment

## Dependencies

- `cloudinary`
- `connect-flash`
- `connect-mongo`
- `cookie-parser`
- `dotenv`
- `ejs`
- `ejs-mate`
- `express`
- `express-session`
- `joi`
- `method-override`
- `mongoose`
- `multer`
- `multer-storage-cloudinary`
- `passport`
- `passport-local`
- `passport-local-mongoose`

## License

This project is licensed under ISC.

