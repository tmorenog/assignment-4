
## Brookline Town Meeting Transcriber

A small Express + EJS app for collecting Brookline Town Meeting video links.

## What the app does

- Shows a home page with a list of submitted meetings
- Lets users add a meeting with:
  - title (required)
  - video URL (required)
  - meeting date (optional)
- Lets users edit and delete meetings
- Stores meetings in MongoDB

## Tech stack

- Node.js
- Express
- EJS templates
- MongoDB / Mongoose
- Morgan request logging

## Run locally

1. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/yourdbname
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```
4. Open:
   `http://localhost:3000`

### Development mode

Run with nodemon and inspector enabled:

```bash
npm run dev
```

## Routes

- `GET /` - home page, lists all meetings
- `GET /meetings/new` - form to add a meeting
- `POST /meetings` - saves a new meeting and redirects to home
- `GET /meetings/:id/edit` - form to edit a meeting
- `POST /meetings/:id` - updates a meeting
- `POST /meetings/:id/delete` - deletes a meeting

## Deployment

Deployed on Render: (https://assignment-3-7jlk.onrender.com/)
