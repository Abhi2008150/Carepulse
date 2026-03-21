import { Patient, Doctor, Appointment, Report, Medicine, HealthMetric, SOAPNote, FastingRecord } from './types';

export const MOCK_PATIENT: Patient = {
  id: 'p1',
  name: 'Shekar',
  email: 'shekar@example.com',
  role: 'patient',
  bloodGroup: 'O+',
  age: 32,
  gender: 'Male',
  emergencyContact: '+1 234 567 890',
  avatar: 'https://picsum.photos/seed/shekar/200',
};

export const INITIAL_PATIENTS: Patient[] = [
  MOCK_PATIENT,
  {
    id: 'p2',
    name: 'Prajwal',
    email: 'prajwal@example.com',
    role: 'patient',
    bloodGroup: 'A-',
    age: 28,
    gender: 'Male',
    emergencyContact: '+1 987 654 321',
    avatar: 'https://picsum.photos/seed/prajwal/200',
  },
  {
    id: 'p3',
    name: 'Maniteja',
    email: 'maniteja@example.com',
    role: 'patient',
    bloodGroup: 'B+',
    age: 45,
    gender: 'Male',
    emergencyContact: '+1 555 123 456',
    avatar: 'https://picsum.photos/seed/maniteja/200',
  }
];

export const INITIAL_NOTES: SOAPNote[] = [
  {
    id: 'n1',
    patientId: 'p1',
    doctorId: 'd1',
    doctorName: 'Dr. Goutham',
    date: '2026-03-15',
    visitType: 'General Consultation',
    subjective: 'Patient reports recurring headaches and sensitivity to light for the past 3 days.',
    objective: 'BP: 135/85, HR: 72. Pupils reactive. No focal neurological deficits.',
    assessment: 'Migraine without aura. Rule out secondary causes if symptoms persist.',
    plan: 'Prescribed Sumatriptan 50mg. Dark room rest. Follow-up in 1 week.',
    status: 'finalized'
  },
  {
    id: 'n2',
    patientId: 'p2',
    doctorId: 'd1',
    doctorName: 'Dr. Goutham',
    date: '2026-03-14',
    visitType: 'Follow-up',
    subjective: 'Patient feels much better. Cough has subsided.',
    objective: 'Lungs clear on auscultation. No fever.',
    assessment: 'Recovering from acute bronchitis.',
    plan: 'Continue hydration. Finish antibiotic course.',
    status: 'finalized'
  }
];

export const MOCK_DOCTOR: Doctor = {
  id: 'd1',
  name: 'Dr. Goutham',
  email: 'goutham@hospital.com',
  role: 'doctor',
  specialty: 'Cardiologist',
  experience: '12 Years',
  rating: 4.8,
  availability: ['Mon', 'Wed', 'Fri'],
  hospital: 'City General Hospital',
  avatar: 'https://picsum.photos/seed/goutham/200',
};

export const DOCTORS: Doctor[] = [
  MOCK_DOCTOR,
  {
    id: 'd2',
    name: 'Dr. Shekar',
    email: 'shekar.doc@hospital.com',
    role: 'doctor',
    specialty: 'Neurologist',
    experience: '8 Years',
    rating: 4.9,
    availability: ['Tue', 'Thu'],
    hospital: 'St. Mary Medical Center',
    avatar: 'https://picsum.photos/seed/shekar_doc/200',
  },
  {
    id: 'd3',
    name: 'Dr. Prajwal',
    email: 'prajwal.doc@hospital.com',
    role: 'doctor',
    specialty: 'Pediatrician',
    experience: '15 Years',
    rating: 4.7,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    hospital: 'Children\'s Health',
    avatar: 'https://picsum.photos/seed/prajwal_doc/200',
  },
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    doctorName: 'Dr. Goutham',
    date: '2026-03-20',
    time: '10:00 AM',
    status: 'scheduled',
    type: 'consultation',
  },
  {
    id: 'a2',
    patientId: 'p1',
    doctorId: 'd2',
    doctorName: 'Dr. Shekar',
    date: '2026-03-10',
    time: '02:30 PM',
    status: 'completed',
    type: 'follow-up',
    notes: 'Patient showing improvement in sleep patterns.',
  },
];

export const REPORTS: Report[] = [
  {
    id: 'r1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2026-03-01',
    title: 'Blood Test Results',
    category: 'Laboratory',
    fileUrl: '#',
  },
  {
    id: 'r2',
    patientId: 'p1',
    doctorId: 'd2',
    date: '2026-02-15',
    title: 'MRI Brain Scan',
    category: 'Radiology',
    fileUrl: '#',
  },
];

export const MEDICINES: Medicine[] = [
  {
    id: 'm1',
    name: 'Amlodipine',
    dosage: '5mg',
    frequency: 'Daily',
    time: ['08:00 AM'],
    remaining: 12,
    total: 30,
  },
  {
    id: 'm2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice Daily',
    time: ['08:00 AM', '08:00 PM'],
    remaining: 45,
    total: 60,
  },
];

export const HEALTH_METRICS: HealthMetric[] = [
  { date: 'Mar 01', bp_systolic: 120, bp_diastolic: 80, heartRate: 72, glucose: 95, spo2: 98 },
  { date: 'Mar 05', bp_systolic: 122, bp_diastolic: 82, heartRate: 75, glucose: 98, spo2: 97 },
  { date: 'Mar 10', bp_systolic: 118, bp_diastolic: 78, heartRate: 70, glucose: 92, spo2: 99 },
  { date: 'Mar 15', bp_systolic: 121, bp_diastolic: 81, heartRate: 73, glucose: 96, spo2: 98 },
];

export const INITIAL_FASTING_RECORDS: FastingRecord[] = [
  {
    id: 'f1',
    patientId: 'p1',
    startTime: '2026-03-16T20:00:00Z',
    endTime: '2026-03-17T08:00:00Z',
    type: 'pre-surgery',
    status: 'completed',
    notes: 'Fasting for blood work'
  }
];
