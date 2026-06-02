# HealthConnect: Advanced Doctor Appointment & Telemedicine System

An end-to-end modern healthcare application built for a Final Year Project. This platform connects patients with verified doctors, facilitates secure appointment booking, integrates an AI Symptom Checker, provides an Emergency SOS alerting system, and features real-time chat for telemedicine.

---

## 🚀 Key Features

### 1. Role-Based Access Control (RBAC)
The system strictly defines access and interfaces for three distinct roles:
- **Patient**: Can search for doctors, book available slots, use the AI symptom checker, send Emergency SOS alerts, and view medical notes.
- **Doctor**: Can define available time slots, approve/reject appointment requests, respond to emergency alerts, and provide medical notes (prescriptions) to patients.
- **Admin**: Has a centralized dashboard to monitor system-wide statistics, manage users (delete accounts), approve pending doctor registrations, and monitor all appointments and emergency logs.

### 2. Emergency SOS System 🚨
- Patients have access to a floating SOS button.
- Captures the patient's exact **GPS Location** via the browser's Geolocation API (with a manual typing fallback).
- Instantly alerts all available doctors in the system. Doctors can view the patient's location and click "Respond Now" to acknowledge the emergency.

### 3. AI-Powered Symptom Checker 🤖
- Patients can input their symptoms in plain text.
- Integrated with AI to analyze the symptoms and provide instant preliminary guidance, triage recommendations, and indicate whether a doctor's visit is necessary.

### 4. Real-Time Telemedicine Chat 💬
- Integrated **Socket.io** allows seamless, real-time messaging between patients and doctors once an appointment is approved.
- Enables quick consultations and follow-ups without needing external messaging applications.

### 5. Premium UI/UX Design ✨
- Built with React and Tailwind CSS.
- Features modern design trends including **Glassmorphism**, dynamic gradients, micro-animations, and responsive layouts across all devices.

---

## 🛠️ Technology Stack

This project is built using the **MERN** Stack.

**Frontend:**
- **React.js** (v18)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **React Router DOM** (Navigation)
- **Axios** (API Requests)
- **Lucide React** (Icons)
- **Socket.io-client** (Real-time communication)

**Backend:**
- **Node.js** & **Express.js** (v5)
- **MongoDB** & **Mongoose** (Database & ODM)
- **Socket.io** (WebSockets)
- **JWT (JSON Web Tokens)** (Authentication)
- **Bcrypt.js** (Password Hashing)
- **Dotenv** (Environment variables)

---

## 📂 Project Structure

```
final year project/
│
├── backend/                  # Node.js + Express Backend
│   ├── controllers/          # Business logic for routes
│   ├── middleware/           # JWT Auth & Role checks
│   ├── models/               # Mongoose schemas (User, Doctor, Appointment, Emergency)
│   ├── routes/               # Express API endpoints
│   ├── utils/                # Helpers (e.g., token generation)
│   ├── server.js             # Main entry point & Socket.io setup
│   └── .env                  # Environment configurations
│
└── frontend/                 # React + Vite Frontend
    ├── public/               # Static assets & images
    ├── src/
    │   ├── api/              # Axios instance setup
    │   ├── components/       # Reusable UI (Navbar, SOSButton, Chat)
    │   ├── context/          # React Context (AuthContext)
    │   ├── pages/            # Main views (Home, Dashboard, Login, etc.)
    │   ├── App.jsx           # App routing
    │   └── index.css         # Tailwind directives
    ├── package.json
    └── tailwind.config.js    # Tailwind theme configuration
```

---

## ⚙️ Installation & Setup Instructions

### Pre-Requisites
- **Node.js** installed on your machine.
- **MongoDB** running locally on `127.0.0.1:27017` (Or replace `MONGO_URI` in `backend/.env` with your MongoDB Atlas URL).

### 1. Launch the Backend Server
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Launch the Frontend UI
Open a secondary terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## 🔐 API Endpoints Overview

* **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
* **Patients**: `/api/patients/doctors` (Fetch approved doctors), `/api/patients/appointments` (Book & view)
* **Doctors**: `/api/doctors/profile` (Manage slots), `/api/doctors/appointments` (Approve/Reject & Prescribe)
* **Admins**: `/api/admin/stats`, `/api/admin/users`, `/api/admin/doctor/approve/:id`
* **Emergency**: `/api/emergency` (Create), `/api/emergency/:id/respond`
* **Symptoms**: `/api/symptoms/check` (AI analysis)

---
*Developed as a Final Year Project showcasing Full-Stack Web Development, Real-Time Communication, and AI Integration.*
