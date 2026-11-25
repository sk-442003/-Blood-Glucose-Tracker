# Sweety – Blood Glucose Tracker

Sweety is a full-stack web application designed to help patients track their daily blood glucose levels and monitor their health through reports and visualizations. It also provides doctors with read-only access to the glucose reports of their assigned patients.

The project was built using React, Node.js, Express, and PostgreSQL, with authentication and role-based access control.

## Features

- Patient registration and login
- Secure authentication using JWT
- Role-based access for patients and doctors
- Add, edit, view, and delete glucose readings
- Track readings across four daily time slots
- Validation for glucose values, dates, duplicate readings, and daily limits
- Daily, month-to-date, and previous-month reports
- Glucose statistics including average, highest, and lowest values
- Charts to visualize glucose trends
- Doctor dashboard with assigned patient details
- Doctors can view patient reports without modifying readings
- Responsive interface built with React and Bootstrap

## Tech Stack

Frontend: React, Vite, JavaScript, Bootstrap, Recharts

Backend: Node.js, Express.js

Database: PostgreSQL

Authentication: JWT, bcrypt

## Project Structure

```text
Sweety/
├── client/          # React frontend
├── server/          # Express backend and APIs
├── database/        # SQL schema and seed data
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 18 or later
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Sweety
```

### 2. Set up PostgreSQL

Create a database named `sweety`.

```sql
CREATE DATABASE sweety;
```

Run the database schema:bash
psql -d sweety -f database/schema.sql


### 3. Configure environment variables

Copy the example environment file:

bash
copy .env.example .env

Update the database connection details and JWT secret in `.env`.

### 4. Install dependencies

```bash
npm install
```

### 5. Insert demo data

```bash
node database/seed.js
```

### 6. Start the application

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Patient | patient@sweety.app | Patient123! |
| Doctor | doctor@sweety.app | Doctor123! |

## Glucose Reading Rules

- Glucose values must be whole numbers between 40 and 600 mg/dl.
- A maximum of four readings can be recorded per day.
- Only one reading is allowed for each time slot on a given date.
- Future dates are not allowed.

### Daily Time Slots

- Morning (fasting)
- After breakfast
- After lunch
- After dinner

## Reports

Sweety provides three types of reports:

- **Daily Report:** Readings for a selected date.
- **Month-to-Date Report:** Readings from the beginning of the selected month through the selected date.
- **Previous Month Report:** Readings from the complete previous calendar month.

Reports include average, highest, lowest, and total readings.

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Glucose Readings

- `POST /api/readings`
- `GET /api/readings`
- `GET /api/readings/:id`
- `PUT /api/readings/:id`
- `DELETE /api/readings/:id`

### Reports

- `GET /api/reports/daily`
- `GET /api/reports/month-to-date`
- `GET /api/reports/previous-month`

### Doctor

- `GET /api/doctor/patients`
- `GET /api/doctor/patients/:patientId/readings`
- Doctor-specific report endpoints

## Testing

Run the available backend tests:

```bash
npm test
```

## Screenshots

Screenshots of the application can be added here to demonstrate the dashboard, reading management, reports, and doctor dashboard.

## Build

To create the production frontend build:

```bash
npm run build
```

The generated frontend files will be available in `client/dist`.

---

Built as a full-stack development project to practice React, REST APIs, PostgreSQL, authentication, database design, and role-based access control.
