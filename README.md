
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
- Exposes a JSON REST API under `/api/meetings` for programmatic access (CORS enabled for all origins)

## Architecture

Both the HTML routes and the JSON API share a single service layer (`services/meetingservice.js`) that wraps the Mongoose model. Controllers never touch the model directly.

```
routes/index.js          ─┐
routes/meetings.js       ─┼──► services/meetingservice.js ──► models/Meeting.js
routes/api/api-meetings.js ┘
```

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

## HTML routes

- `GET /` - home page, lists all meetings
- `GET /meetings/new` - form to add a meeting
- `POST /meetings` - saves a new meeting and redirects to home
- `GET /meetings/:id/edit` - form to edit a meeting
- `POST /meetings/:id` - updates a meeting
- `POST /meetings/:id/delete` - deletes a meeting

## JSON API

Base URL: `/api/meetings`. Accepts and returns JSON. CORS is enabled, so any browser origin can call it.

| Method | Path | Success | Failure |
|---|---|---|---|
| `GET`    | `/api/meetings`       | `200` — array of meetings | — |
| `GET`    | `/api/meetings/:id`   | `200` — meeting object    | `404` if not found or malformed id |
| `POST`   | `/api/meetings`       | `201` — created meeting   | `400` if `title` or `videoUrl` missing |
| `PUT`    | `/api/meetings/:id`   | `200` — updated meeting   | `404` if not found or malformed id |
| `DELETE` | `/api/meetings/:id`   | `200` — `{ message }`     | `404` if not found or malformed id |

### Request body (POST and PUT)

```json
{
  "title": "Select Board Meeting",
  "videoUrl": "https://example.com/video.mp4",
  "meetingDate": "2026-04-15"
}
```

`title` and `videoUrl` are required; `meetingDate` is optional.

### Example

```bash
# create
curl -X POST http://localhost:3000/api/meetings \
  -H "Content-Type: application/json" \
  -d '{"title":"Town Hall","videoUrl":"https://example.com/v.mp4"}'

# list
curl http://localhost:3000/api/meetings
```

## Deployment

Deployed on Render: 


