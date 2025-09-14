# Event Management Platform

A full-stack web application for managing events, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Create, view, and manage events
- Book and manage tickets
- User profile management
- Event image uploads (Cloudinary)
- Payment integration
- Chatbot support

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- File Uploads: Multer, Cloudinary
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB

### Setup

1. **Clone the repository:**
git clone <your-repo-url>
```cd Event```
2. **Install dependencies:**
    - Backend:
      ```
      cd server
      npm install
      ```
    - Frontend:
      ```
      cd ../client
      npm install
      ```

3. **Environment Variables:**
    - Create a `.env` file in `server/` with:
      ```
      PORT=5000
      MONGO_URI=mongodb://localhost:27017/Event_Management
      JWT_SECRET=your_secret_key
      CLOUDINARY_CLOUD_NAME=your_cloud_name
      CLOUDINARY_API_KEY=your_api_key
      CLOUDINARY_API_SECRET=your_api_secret
      ```

4. **Run the app:**
    - Backend:
      ```
      cd server
      node index.js
      ```
    - Frontend:
      ```
      cd ../client
      npm run dev
      ```

5. **Access the app:**
    - Frontend: [http://localhost:5173](http://localhost:5173)
    - Backend API: [http://localhost:5000](http://localhost:5000)

## Folder Structure

- `client/` - React frontend
- `server/` - Express backend

## License

MIT
