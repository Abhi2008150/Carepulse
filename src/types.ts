export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient extends User {
  bloodGroup: string;
  age: number;
  gender: string;
  emergencyContact: string;
}

export interface Doctor extends User {
  specialty: string;
  experience: string;
  rating: number;
  availability: string[];
  hospital: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
}

export interface Report {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  title: string;
  category: string;
  fileUrl: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  remaining: number;
  total: number;
}

export interface HealthMetric {
  date: string;
  bp_systolic: number;
  bp_diastolic: number;
  heartRate: number;
  glucose: number;
  spo2: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface SOAPNote {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  visitType: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  status: 'draft' | 'finalized';
}

export interface FastingRecord {
  id: string;
  patientId: string;
  startTime: string;
  endTime?: string;
  type: 'water-only' | 'juice-only' | 'intermittent' | 'pre-surgery';
  status: 'active' | 'completed';
  notes?: string;
}
