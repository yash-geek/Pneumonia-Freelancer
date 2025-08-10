# Pneumonia Freelancer - Online Marketplace for Freelancers

An end-to-end online marketplace for freelancers and clients—built with the MERN stack—designed to replicate and extend the functionality of leading platforms like Fiverr and Upwork.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Skills Demonstrated](#skills-demonstrated)
- [License](#license)

---

## Overview

Pneumonia Freelancer is a comprehensive platform where:

- **Freelancers** can create, edit, and manage service "gigs"
- **Clients** can browse, search, and purchase gigs
- Both can communicate in real time, manage orders, and leave reviews

The project demonstrates real-world experience in building multi-role systems, e-commerce logic, payment processing, role-based dashboards, and more.

---

## Key Features

- **User Registration & Login:** Secure JWT authentication for freelancers and clients
- **Gig Management:** Freelancers can create, update, and delete gigs (title, description, price, delivery time, images)
- **Gig Browsing & Search:** Clients can filter gigs by keyword, category, price, etc.
- **Order & Payment Flow:** Order status tracking (Pending, In Progress, Delivered, Completed)
- **Real-time Messaging:** Socket.io-based chat for instant communication
- **Reviews & Ratings:** Clients can rate and review completed gigs
- **Role-Based Dashboards:** Separate dashboards for freelancers and clients (manage gigs, orders, etc.)

---

## Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- React Router
- React Hook Form (+ 6pp for validation)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication

**Other Technologies:**
- Cloudinary (image uploads)
- Socket.io (real-time chat)
- Multer (file uploads)
- Render + Vercel (deployment)

---

## Project Structure

```
/freelance-marketplace
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── constants/
│   ├── app.js
│   ├── .env.example
│   └── package.json
├── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js
- MongoDB instance
- Git
- Cloudinary account (for images)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Pneumonia-Freelancer
```

### 2. Backend Setup

```bash
cd server
npm install
```

- Copy `.env.example` to `.env` and fill in the required values:

  ```
  JWT_SECRET=YOUR_JWT_SECRET
  MONGO_URI=YOUR_MONGO_URI
  PORT=YOUR_BACKEND_PORT
  CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
  CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
  CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
  CLIENT_URL=YOUR_CLIENT_URL
  ```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

- (Optional) Copy `.env.example` to `.env` and set up frontend environment variables:

  ```
  VITE_APP= OPTIONAL
  VITE_SERVER=YOUR_BACKEND_BASE_URL
  ```

---

## Running the Application

### 1. Start the Backend Server

From the `server` directory:

```bash
npm run dev
# or
node app.js
# or
nodemon app.js
```

The server will run on `http://localhost:<PORT>`.

### 2. Start the Frontend Development Server

From the `client` directory:

```bash
npm run dev
```

The frontend app should open at `http://localhost:5173`.

---

## Deployment

The project is ready for deployment using:

- **Backend:** Render, Railway, etc.
- **Frontend:** Vercel, Netlify, etc.

**Important:** Configure your `.env` files and environment variables on deployment platforms before going live.

---

## Skills Demonstrated

- **Authentication:** JWT, role-based access controls
- **E-Commerce:** Gig management, order flow
- **Realtime Systems:** Socket.io chat integration
- **API Design:** RESTful APIs for all modules
- **Frontend:** Modern React, state management, Tailwind CSS
- **DevOps:** .env management, full-stack deployment
- **Team System:** Multi-role architecture (client/freelancer)

---

## License

This project is for educational and portfolio purposes. Please check with the repository owner for reuse or commercial deployment.

---

Happy freelancing! 🚀
