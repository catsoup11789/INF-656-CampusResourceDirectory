# Campus Resource Directory

A Node.js web application that displays useful campus resources for Fort Hays State University students.

## Running the Server

**Production mode:**
```bash
npm start
```

**Development mode (with file watcher):**
```bash
npm dev
```

Server runs on `http://localhost:3000`

## Routes

- `GET /` - Homepage with all resources
- `GET /resource?id=1` - Individual resource detail page
- `GET /api/resources` - JSON API with all resources
- `GET /unknown-route` - Returns 404 error