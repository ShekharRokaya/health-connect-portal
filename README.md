# Doctor Appointment System

An end-to-end modern application for tracking, booking, and processing hospital/clinic appointments.

## Features Designed:
- **Role-Based Auth (JWT):** Clear separation for `Patient`, `Doctor`, and `Admin`.
- **Dynamic Dashboards:** Each role accesses tailored stats and controls instantly upon login.
- **RESTful API Structure:** Secure Node.js + Express backend interacting seamlessly with a MongoDB database.
- **Modern User Interface:** React interface composed entirely with responsive Tailwind CSS micro-animations and clean aesthetics.

## Pre-Requisites
- **Node.js** installed on your system.
- **MongoDB** running locally continuously on `127.0.0.1:27017` (If you desire external Atlas DBs, merely edit `MONGO_URI` directly in `backend/.env`).

## Setup Instructions

### 1. Launch the Backend Backend
Navigate to the `backend` folder via terminal:
```bash
cd backend
npm install
node server.js
```
The server will boot up and bind to `localhost:5000`.

### 2. Launch the Frontend UI
Open a secondary terminal process simultaneously:
```bash
cd frontend
npm install
npm run dev
```

### 3. Open Application
Navigate to your provided Vite URL (typically `http://localhost:5173/`).
Register as an Admin, a Doctor, or simply as a Patient to experience different layouts.
