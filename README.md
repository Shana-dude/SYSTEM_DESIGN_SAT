# 🏥 MediCare – Doctor Appointment System

MediCare is a simple healthcare web application that allows patients to search for doctors, check doctor details, book appointments, manage bookings, and view sample digital prescriptions.

This project is developed as part of a **System Design SAT Examination** to demonstrate REST API design, database management, and basic healthcare application development.

## ✨ Features

- **Doctor Listing:** View doctors with their specialization, experience, and consultation fees.
- **Doctor Search:** Search doctors by name or specialization.
- **Appointment Booking:** Book appointments by selecting a doctor, date, and time.
- **Appointment Management:** View and cancel booked appointments.
- **Slot Validation:** Prevent duplicate bookings for the same doctor and time slot.
- **Digital Prescription:** View sample prescriptions with medicine names, dosage, and instructions.
- **Responsive UI:** Access the application from desktop and mobile devices.
- **REST APIs:** Communicate between the frontend and backend using JSON.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build tool |
| Tailwind CSS | Styling and responsive design |
| Node.js | Backend runtime |
| Express.js | REST API development |
| SQLite | Database management |
| Git and GitHub | Version control and source code hosting |

## 🏗️ System Architecture

```text
Patient
   |
   v
React Web Application
   |
   v
REST API (Express.js)
   |
   +-------------------+
   |                   |
   v                   v
Doctor Service    Appointment Service
   |                   |
   +---------+---------+
             |
             v
       SQLite Database
             |
             v
   Appointment / Prescription Data
```

## 📂 Project Structure

```text
medicare-doctor-appointment/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── package.json
│   └── routes/
├── README.md
└── .gitignore
```

*Note: The exact folder structure may vary depending on the generated implementation.*

## ⚙️ Prerequisites

Install the following before running the application:

- Node.js and npm
- Git
- A web browser

Check your installation:

```bash
node --version
npm --version
git --version
```

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shana-dude/SYSTEM_DESIGN_SAT.git
cd SYSTEM_DESIGN_SAT
```

### 2. Start the Backend

Open a terminal:

```bash
cd backend
npm install
npm start
```

If the backend uses a different development command, check `backend/package.json` and use its configured script.

The backend should start on the port specified in its configuration, for example `http://localhost:5000`.

### 3. Start the Frontend

Open another terminal:

```bash
cd medicare-doctor-appointment/frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

## 🔗 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/doctors` | Retrieve all doctors |
| GET | `/api/doctors/:id` | Retrieve a specific doctor |
| GET | `/api/appointments` | Retrieve appointments |
| POST | `/api/appointments` | Book a new appointment |
| PATCH | `/api/appointments/:id/cancel` | Cancel an appointment |
| GET | `/api/prescriptions/:patientId` | Retrieve sample prescriptions |

### Example: Book an Appointment

**Request**

```http
POST /api/appointments
Content-Type: application/json
```

```json
{
  "patientName": "Demo Patient",
  "doctorId": 1,
  "date": "2026-11-15",
  "time": "10:30"
}
```

**Example response**

```json
{
  "appointmentId": 1,
  "status": "CONFIRMED",
  "message": "Appointment booked successfully"
}
```

*The exact request fields and response structure depend on the implemented backend.*

## 🗄️ Database Design

The application uses SQLite to store structured application data.

### Doctors
- `id`
- `name`
- `specialization`
- `experience`
- `consultation_fee`

### Appointments
- `id`
- `patient_name`
- `doctor_id`
- `appointment_date`
- `appointment_time`
- `status`

### Prescriptions
- `id`
- `patient_id`
- `doctor_id`
- `medicines`
- `dosage`
- `instructions`

## 🔒 Error Handling

The API uses standard HTTP status codes where appropriate:

- `200 OK` – Request successful.
- `201 Created` – Appointment created.
- `400 Bad Request` – Invalid input.
- `404 Not Found` – Requested resource not found.
- `409 Conflict` – Appointment slot already booked.
- `500 Internal Server Error` – Unexpected server error.

## 📸 Screenshots

Add screenshots of your working application here after running it locally.

Suggested screenshots:
1. Home page and dashboard.
2. Doctor listing and search.
3. Appointment booking form.
4. My Appointments page.
5. Digital prescription page.

Example Markdown:

```markdown
![MediCare Dashboard](screenshots/dashboard.png)
```

## 🔮 Future Enhancements

- Patient and doctor authentication.
- Online consultation through video calls.
- Appointment reminder notifications.
- Secure prescription downloads.
- Online payment integration.
- Cloud deployment and automated testing.

## 🎯 Learning Outcomes

This project demonstrates:

- Low-level and high-level system design concepts.
- REST API creation using Express.js.
- CRUD operations and database integration.
- Frontend and backend communication.
- Appointment validation and error handling.
- Version control and GitHub repository management.

## ⚠️ Disclaimer

MediCare is an educational demonstration project. It uses sample data and is not intended for real medical consultations, diagnosis, prescription, or patient-data management.

## 👩‍💻 Author

**Rakshana M.**

Artificial Intelligence and Data Science  
Sri Eshwar College of Engineering

---

⭐ If you find this project useful, consider giving the repository a star on GitHub.