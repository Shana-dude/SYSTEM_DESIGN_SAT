const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite database file path
const DB_PATH = path.resolve(__dirname, 'medicare.db');

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
  }
});

// Helper for db.run with Promises
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

// Helper for db.all with Promises
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Helper for db.get with Promises
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Initialize tables and seed initial sample data
async function initDb() {
  try {
    // 1. Doctors Table
    await run(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        specialization TEXT NOT NULL,
        experience INTEGER NOT NULL,
        consultation_fee REAL NOT NULL,
        fee REAL NOT NULL,
        rating REAL DEFAULT 4.8,
        available_days TEXT NOT NULL,
        available_hours TEXT NOT NULL,
        bio TEXT NOT NULL,
        image_url TEXT,
        contact_email TEXT
      )
    `);

    // 2. Appointments Table
    await run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT NOT NULL,
        patient_age INTEGER DEFAULT 30,
        patient_phone TEXT DEFAULT '555-0100',
        doctor_id INTEGER NOT NULL,
        appointment_date TEXT NOT NULL,
        appointment_time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Confirmed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors (id)
      )
    `);

    // 3. Prescriptions Table
    await run(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        doctor_id INTEGER NOT NULL,
        consultation_date TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        medicines TEXT NOT NULL,
        dosage TEXT,
        instructions TEXT NOT NULL,
        is_demo INTEGER DEFAULT 1,
        FOREIGN KEY (doctor_id) REFERENCES doctors (id)
      )
    `);

    // Seed sample doctors if table is empty
    const doctorCount = await get(`SELECT COUNT(*) as count FROM doctors`);
    if (doctorCount.count === 0) {
      console.log('Seeding initial sample doctors...');
      const sampleDoctors = [
        {
          name: 'Dr. Sarah Jenkins',
          specialization: 'Cardiology',
          experience: 14,
          fee: 80,
          rating: 4.9,
          available_days: 'Mon, Wed, Fri',
          available_hours: '09:00 AM - 03:00 PM',
          bio: 'Board-certified cardiologist specializing in preventive cardiology, heart failure management, and advanced cardiovascular diagnostics.',
          image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
          contact_email: 'sarah.jenkins@medicare-demo.com'
        },
        {
          name: 'Dr. Marcus Vance',
          specialization: 'Dermatology',
          experience: 9,
          fee: 65,
          rating: 4.8,
          available_days: 'Tue, Thu, Sat',
          available_hours: '10:00 AM - 04:00 PM',
          bio: 'Specialist in medical and cosmetic dermatology with expertise in acne therapies, eczema management, and skin cancer screening.',
          image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
          contact_email: 'marcus.vance@medicare-demo.com'
        },
        {
          name: 'Dr. Priya Patel',
          specialization: 'Pediatrics',
          experience: 11,
          fee: 55,
          rating: 4.9,
          available_days: 'Mon, Tue, Thu, Fri',
          available_hours: '08:30 AM - 02:30 PM',
          bio: 'Dedicated pediatrician focused on infant care, developmental milestones, adolescent wellness, and childhood vaccinations.',
          image_url: 'https://images.unsplash.com/photo-1594824813571-638f02636192?auto=format&fit=crop&q=80&w=400',
          contact_email: 'priya.patel@medicare-demo.com'
        },
        {
          name: 'Dr. David Kim',
          specialization: 'Orthopedics',
          experience: 16,
          fee: 90,
          rating: 4.7,
          available_days: 'Wed, Fri, Sat',
          available_hours: '09:30 AM - 04:30 PM',
          bio: 'Orthopedic surgeon and sports injury specialist with extensive experience in joint preservation and rehabilitation.',
          image_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
          contact_email: 'david.kim@medicare-demo.com'
        },
        {
          name: 'Dr. Elena Rostova',
          specialization: 'Neurology',
          experience: 12,
          fee: 95,
          rating: 4.9,
          available_days: 'Mon, Tue, Wed',
          available_hours: '10:00 AM - 03:00 PM',
          bio: 'Consultant neurologist with deep clinical focus on migraine management, peripheral neuropathies, and cognitive wellness.',
          image_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
          contact_email: 'elena.rostova@medicare-demo.com'
        },
        {
          name: 'Dr. Robert Chen',
          specialization: 'General Medicine',
          experience: 8,
          fee: 50,
          rating: 4.8,
          available_days: 'Mon, Tue, Wed, Thu, Fri',
          available_hours: '08:00 AM - 05:00 PM',
          bio: 'Primary care physician providing holistic care for acute illnesses, chronic disease management, and annual wellness checks.',
          image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
          contact_email: 'robert.chen@medicare-demo.com'
        }
      ];

      for (const doc of sampleDoctors) {
        await run(
          `INSERT INTO doctors (name, specialization, experience, consultation_fee, fee, rating, available_days, available_hours, bio, image_url, contact_email)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [doc.name, doc.specialization, doc.experience, doc.fee, doc.fee, doc.rating, doc.available_days, doc.available_hours, doc.bio, doc.image_url, doc.contact_email]
        );
      }
      console.log('Sample doctors seeded successfully.');
    }

    // Seed sample appointments if none exist
    const apptCount = await get(`SELECT COUNT(*) as count FROM appointments`);
    if (apptCount.count === 0) {
      console.log('Seeding initial sample appointments...');
      const sampleAppointments = [
        {
          patient_name: 'John Miller',
          patient_age: 38,
          patient_phone: '+1 555-0192',
          doctor_id: 1,
          appointment_date: '2026-10-18',
          appointment_time: '10:00 AM',
          status: 'Confirmed'
        },
        {
          patient_name: 'Emily Davis',
          patient_age: 29,
          patient_phone: '+1 555-0184',
          doctor_id: 2,
          appointment_date: '2026-10-19',
          appointment_time: '11:30 AM',
          status: 'Confirmed'
        },
        {
          patient_name: 'Alex Turner',
          patient_age: 45,
          patient_phone: '+1 555-0177',
          doctor_id: 4,
          appointment_date: '2026-10-20',
          appointment_time: '02:00 PM',
          status: 'Cancelled'
        }
      ];

      for (const appt of sampleAppointments) {
        await run(
          `INSERT INTO appointments (patient_name, patient_age, patient_phone, doctor_id, appointment_date, appointment_time, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [appt.patient_name, appt.patient_age, appt.patient_phone, appt.doctor_id, appt.appointment_date, appt.appointment_time, appt.status]
        );
      }
    }

    // Seed sample prescriptions if none exist
    const prescCount = await get(`SELECT COUNT(*) as count FROM prescriptions`);
    if (prescCount.count === 0) {
      console.log('Seeding sample prescriptions...');
      const samplePrescriptions = [
        {
          patient_id: 'P101',
          patient_name: 'John Miller',
          doctor_id: 1,
          consultation_date: '2026-10-10',
          diagnosis: 'Mild Essential Hypertension & High Cholesterol',
          medicines: JSON.stringify([
            { name: 'Amlodipine Besylate', dosage: '5 mg', frequency: 'Once daily (morning)', duration: '30 days', instructions: 'Take with or without food' },
            { name: 'Atorvastatin Calcium', dosage: '10 mg', frequency: 'Once daily (evening)', duration: '30 days', instructions: 'Take after dinner' },
            { name: 'Omega-3 Fish Oil', dosage: '1000 mg', frequency: 'Twice daily', duration: '60 days', instructions: 'Take with plenty of water' }
          ]),
          dosage: '5 mg daily / 10 mg evening',
          instructions: 'Maintain low sodium diet, avoid saturated fats, brisk walking for 30 minutes daily. Follow up in 4 weeks with lipid profile test.'
        },
        {
          patient_id: 'P102',
          patient_name: 'Emily Davis',
          doctor_id: 2,
          consultation_date: '2026-10-08',
          diagnosis: 'Contact Dermatitis & Skin Barrier Irritation',
          medicines: JSON.stringify([
            { name: 'Hydrocortisone Cream 1%', dosage: 'Thin layer', frequency: 'Twice daily', duration: '7 days', instructions: 'Apply gently to affected area only' },
            { name: 'Cetirizine Hydrochloride', dosage: '10 mg', frequency: 'Once daily at bedtime', duration: '10 days', instructions: 'May cause mild drowsiness' },
            { name: 'Ceramide Barrier Moisturizer', dosage: 'Generous amount', frequency: '3 times daily', duration: 'Ongoing', instructions: 'Apply within 3 minutes of washing' }
          ]),
          dosage: 'Topical twice daily',
          instructions: 'Avoid fragranced soaps, hot showers, and synthetic fabrics. Use lukewarm water and gentle pat drying.'
        },
        {
          patient_id: 'demo',
          patient_name: 'Demo Patient',
          doctor_id: 6,
          consultation_date: '2026-10-12',
          diagnosis: 'Acute Seasonal Bronchial Allergy with Dry Cough',
          medicines: JSON.stringify([
            { name: 'Levocetirizine + Montelukast', dosage: '5mg / 10mg', frequency: 'Once daily at bedtime', duration: '14 days', instructions: 'Take before sleeping' },
            { name: 'Dextromethorphan Syrup', dosage: '10 ml', frequency: 'Every 8 hours as needed', duration: '5 days', instructions: 'Shake well before use' },
            { name: 'Vitamin C + Zinc Chewable', dosage: '500 mg', frequency: 'Once daily in morning', duration: '30 days', instructions: 'Chew thoroughly after breakfast' }
          ]),
          dosage: '1 tablet nightly + 10ml syrup SOS',
          instructions: 'Drink warm fluids, steam inhalation twice a day, avoid dusty environments and cold beverages. Rest adequately.'
        }
      ];

      for (const p of samplePrescriptions) {
        await run(
          `INSERT INTO prescriptions (patient_id, patient_name, doctor_id, consultation_date, diagnosis, medicines, dosage, instructions, is_demo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [p.patient_id, p.patient_name, p.doctor_id, p.consultation_date, p.diagnosis, p.medicines, p.dosage, p.instructions]
        );
      }
    }

    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Run initialization
initDb();

module.exports = {
  db,
  run,
  all,
  get
};
