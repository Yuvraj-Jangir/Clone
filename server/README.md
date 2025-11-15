# YouTube Clone Backend (Node.js & Express)

This is the backend of the YouTube Clone project, built using Node.js, Express, and MongoDB.  
It provides API endpoints for users, channels, videos, and comments.

## Features

- User Authentication with JWT
- Channel management (Create, Read)
- Video management (CRUD)
- Comment management (CRUD)
- Search videos by title
- Filter videos by category

## Technologies Used

- Node.js
- Express.js
- MongoDB (Atlas or local)
- Mongoose
- JWT for authentication

## Setup
## Clone 
    git clone https://github.com/Yuvraj-Jangir/Clone.git


1. Install dependencies:
    cd clone
    cd server
    npm install
    

## Create a .env file with:
Copy this code
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/youtubeClone
    JWT_SECRET=your_secret_key

## Start the server:
    npm run seed
    npm run dev
    The server will run at http://localhost:5001

## API Endpoints
    POST /api/auth/signup – Register user
    POST /api/auth/login – Login user
    GET /api/videos – Get all videos
    GET /api/videos/:id – Get video by ID
    POST /api/videos – Create a video (auth required)
    PUT /api/videos/:id – Update video (auth required)
    DELETE /api/videos/:id – Delete video (auth required)
    POST /api/comments/video/:id – Add comment (auth required)
    PUT /api/comments/:id – Edit comment (auth required)
    DELETE /api/comments/:id – Delete comment (auth required)
    GET /api/channels/owner/:id – Get channels by owner
    POST /api/channels – Create channel (auth required)

## File Structure
```
server/
├── models/
│   ├── Channel.js
│   ├── Comment.js
│   ├── User.js
│   └── Video.js
├── routes/
│   ├── auth.js
│   ├── channels.js
│   ├── comments.js
│   └── videos.js
├── middleware/
│   └── auth.js
├── seed/
│   ├── react.mp4
│   └── seed.js
├── utils/
│   └── dsa.js
├── .env
├── server.js
├── package.json
└── README.md
```


