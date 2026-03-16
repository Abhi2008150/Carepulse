import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Calendar, 
  ClipboardList, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X,
  Phone,
  AlertCircle,
  Stethoscope,
  Users,
  FileText,
  Video,
  Globe,
  Moon,
  Sun,
  Pill,
  HeartPulse,
  Plus,
  ChevronRight,
  Star,
  PhoneCall,
  ShieldAlert,
  Share2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';
import { 
  MOCK_PATIENT, 
  MOCK_DOCTOR, 
  DOCTORS, 
  APPOINTMENTS, 
  REPORTS, 
  MEDICINES, 
  HEALTH_METRICS,
  INITIAL_PATIENTS,
  INITIAL_NOTES
} from './constants';
import { UserRole, Doctor, Appointment, Report, Medicine, HealthMetric, Patient, SOAPNote } from './types';

// --- Components ---

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost', size?: 'sm' | 'md' | 'lg', icon?: any }) => {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10',
    outline: 'bg-white border-2 border-slate-100 text-slate-600 hover:border-brand-500 hover:text-brand-600',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    ghost: 'text-slate-500 hover:bg-slate-50'
  };
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };
  return (
    <button 
      className={cn(
        'rounded-2xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none', 
        variants[variant], 
        sizes[size], 
        className
      )}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300', className)} {...props}>
    {children}
  </div>
);

const StatWidget = ({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  color = 'emerald' 
}: { 
  label: string, 
  value: string | number, 
  unit?: string, 
  icon: any, 
  trend?: { value: string, isUp: boolean },
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple'
}) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  return (
    <Card className="stat-widget p-5 flex flex-col gap-4 border-slate-100/50">
      <div className="flex items-center justify-between">
        <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center border', colors[color])}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={cn('flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full', trend.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')}>
            {trend.isUp ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-mono font-bold text-slate-900 tracking-tight">{value}</span>
          {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 pointer-events-none">
        <Icon size={80} />
      </div>
    </Card>
  );
};

const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger', className?: string }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600 border-slate-200',
    success: 'bg-brand-50 text-brand-600 border-brand-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    danger: 'bg-red-50 text-red-600 border-red-100'
  };
  return (
    <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border', variants[variant], className)}>
      {children}
    </span>
  );
};

const Input = ({ label, icon: Icon, ...props }: { label?: string, icon?: any } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    {label && <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>}
    <div className="relative group">
      {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />}
      <input 
        className={cn(
          "w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 transition-all text-sm font-medium",
          Icon && "pl-12"
        )}
        {...props}
      />
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);
  const [modal, setModal] = useState<{ title: string, content: React.ReactNode } | null>(null);
  
  // Data State
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [notes, setNotes] = useState<SOAPNote[]>(INITIAL_NOTES);
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModal({ title, content });
  };

  // Mock login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    // Simulate network delay
    setTimeout(() => {
      if (email === 'doctor@carepulse.com' && password === 'password123') {
        setRole('doctor');
        setIsLoggedIn(true);
        showNotification("Welcome back, Dr. Smith!");
      } else if (email === 'patient@carepulse.com' && password === 'password123') {
        setRole('patient');
        setIsLoggedIn(true);
        showNotification("Welcome back, John!");
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
      setIsLoggingIn(false);
    }, 1000);
  };

  const quickLogin = (selectedRole: UserRole) => {
    if (selectedRole === 'doctor') {
      setEmail('doctor@carepulse.com');
      setPassword('password123');
    } else {
      setEmail('patient@carepulse.com');
      setPassword('password123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
  };

  const addPatient = (newPatient: Omit<Patient, 'id' | 'role' | 'avatar'>) => {
    const patient: Patient = {
      ...newPatient,
      id: `p${patients.length + 1}`,
      role: 'patient',
      avatar: `https://picsum.photos/seed/p${patients.length + 1}/200`
    };
    setPatients(prev => [patient, ...prev]);
    showNotification("Patient registered successfully!");
    setModal(null);
  };

  const addNote = (newNote: Omit<SOAPNote, 'id' | 'doctorId' | 'doctorName' | 'date' | 'status'>) => {
    const note: SOAPNote = {
      ...newNote,
      id: `n${notes.length + 1}`,
      doctorId: MOCK_DOCTOR.id,
      doctorName: MOCK_DOCTOR.name,
      date: new Date().toISOString().split('T')[0],
      status: 'finalized'
    };
    setNotes(prev => [note, ...prev]);
    showNotification("SOAP note saved successfully!");
    setModal(null);
  };

  const addAppointment = (newAppointment: Omit<Appointment, 'id' | 'status'>) => {
    const appointment: Appointment = {
      ...newAppointment,
      id: `a${appointments.length + 1}`,
      status: 'scheduled'
    };
    setAppointments(prev => [appointment, ...prev]);
    showNotification("Appointment scheduled successfully!");
    setModal(null);
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'cancelled' } : app
    ));
    showNotification("Appointment cancelled successfully.", "error");
    setModal(null);
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    // Also delete notes associated with this patient
    setNotes(prev => prev.filter(n => n.patientId !== id));
    showNotification("Patient deleted successfully!", "info");
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showNotification("Note deleted successfully!", "info");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mb-4">
              <HeartPulse size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">CarePulse</h1>
            <p className="text-slate-500 mt-2">Your health, our priority. Sign in to your portal.</p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle size={18} />
                  {loginError}
                </div>
              )}
              
              <Input 
                label="Email Address"
                type="email"
                placeholder="e.g. doctor@carepulse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input 
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button 
                type="submit" 
                className="w-full py-3" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Demo Credentials</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => quickLogin('doctor')}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-left hover:border-emerald-500 transition-all group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Doctor Login</p>
                  <p className="text-[10px] text-slate-500">doctor@carepulse.com</p>
                </button>
                <button 
                  onClick={() => quickLogin('patient')}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-left hover:border-emerald-500 transition-all group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Patient Login</p>
                  <p className="text-[10px] text-slate-500">patient@carepulse.com</p>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 text-center italic">Password for both: password123</p>
            </div>
          </Card>

          <p className="text-center text-xs text-slate-400 mt-8">
            © 2026 CarePulse Medical Systems. All rights reserved.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen flex bg-slate-50', isDarkMode && 'dark bg-slate-950')}>
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transition-transform lg:relative lg:translate-x-0',
        !isSidebarOpen && '-translate-x-full'
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                <HeartPulse className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">CarePulse</h1>
                <p className="text-[10px] text-brand-600 font-bold uppercase tracking-[0.2em] mt-1">Medical</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <SidebarItem 
              icon={<Activity size={20} />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            {role === 'patient' ? (
              <>
                <SidebarItem 
                  icon={<Calendar size={20} />} 
                  label="Appointments" 
                  active={activeTab === 'appointments'} 
                  onClick={() => setActiveTab('appointments')} 
                />
                <SidebarItem 
                  icon={<ClipboardList size={20} />} 
                  label="Reports" 
                  active={activeTab === 'reports'} 
                  onClick={() => setActiveTab('reports')} 
                />
                <SidebarItem 
                  icon={<Pill size={20} />} 
                  label="Medicines" 
                  active={activeTab === 'medicines'} 
                  onClick={() => setActiveTab('medicines')} 
                />
              </>
            ) : (
              <>
                <SidebarItem 
                  icon={<Users size={20} />} 
                  label="Patients" 
                  active={activeTab === 'patients'} 
                  onClick={() => setActiveTab('patients')} 
                />
                <SidebarItem 
                  icon={<Calendar size={20} />} 
                  label="Schedule" 
                  active={activeTab === 'schedule'} 
                  onClick={() => setActiveTab('schedule')} 
                />
                <SidebarItem 
                  icon={<FileText size={20} />} 
                  label="Clinical Notes" 
                  active={activeTab === 'notes'} 
                  onClick={() => setActiveTab('notes')} 
                />
              </>
            )}
            {/* {role === 'patient' && (
              <SidebarItem 
                icon={<MessageSquare size={20} />} 
                label="Messages" 
                active={activeTab === 'messages'} 
                onClick={() => setActiveTab('messages')} 
              />
            )} */}
            <SidebarItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500 p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-2 sm:gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">{role === 'patient' ? MOCK_PATIENT.name : MOCK_DOCTOR.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{role}</p>
              </div>
              <img 
                src={role === 'patient' ? MOCK_PATIENT.avatar : MOCK_DOCTOR.avatar} 
                alt="Profile" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (role === 'patient' ? <PatientDashboard onAction={showNotification} onOpenModal={openModal} onNavigate={setActiveTab} appointments={appointments} onAddAppointment={addAppointment} onCancelAppointment={cancelAppointment} /> : <DoctorDashboard onAction={showNotification} onOpenModal={openModal} onNavigate={setActiveTab} onCloseModal={() => setModal(null)} patients={patients} notes={notes} appointments={appointments} onAddPatient={addPatient} onDeletePatient={deletePatient} onDeleteNote={deleteNote} onCancelAppointment={cancelAppointment} />)}
              {activeTab === 'appointments' && <AppointmentsPage onAction={showNotification} onOpenModal={openModal} onCloseModal={() => setModal(null)} appointments={appointments} onAddAppointment={addAppointment} onCancelAppointment={cancelAppointment} />}
              {activeTab === 'reports' && <ReportsPage onAction={showNotification} onOpenModal={openModal} />}
              {activeTab === 'medicines' && <MedicinesPage onAction={showNotification} onOpenModal={openModal} />}
              {activeTab === 'patients' && <PatientsPage onAction={showNotification} onOpenModal={openModal} onCloseModal={() => setModal(null)} patients={patients} onAddPatient={addPatient} onDeletePatient={deletePatient} />}
              {activeTab === 'schedule' && <SchedulePage onAction={showNotification} onOpenModal={openModal} appointments={appointments} patients={patients} onAddAppointment={addAppointment} onCancelAppointment={cancelAppointment} />}
              {activeTab === 'notes' && <NotesPage onAction={showNotification} onOpenModal={openModal} notes={notes} onAddNote={addNote} patients={patients} onDeleteNote={deleteNote} />}
              {/* {activeTab === 'messages' && <MessagesPage onAction={showNotification} onOpenModal={openModal} onCloseModal={() => setModal(null)} />} */}
              {activeTab === 'settings' && (
                <SettingsPage 
                  isDarkMode={isDarkMode} 
                  setIsDarkMode={setIsDarkMode} 
                  language={language} 
                  setLanguage={setLanguage} 
                  onAction={showNotification}
                  onOpenModal={openModal}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className={cn(
                "fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-bold",
                notification.type === 'success' ? 'bg-emerald-600' : 
                notification.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
              )}
            >
              {notification.type === 'success' && <Activity size={20} />}
              {notification.type === 'error' && <AlertCircle size={20} />}
              {notification.type === 'info' && <Bell size={20} />}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <Modal 
          isOpen={!!modal} 
          onClose={() => setModal(null)} 
          title={modal?.title || ''}
        >
          {modal?.content}
        </Modal>

        {/* Floating Emergency Button for Patients */}
        {role === 'patient' && (
          <button 
            onClick={() => openModal("Emergency Assistance", (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <ShieldAlert size={40} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Emergency Alert</h4>
                  <p className="text-slate-500">Our emergency response team has been notified of your location and is dispatched to assist you immediately.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                  <p className="text-sm font-bold text-red-600">Estimated Arrival: 8-12 Minutes</p>
                </div>
                <Button variant="danger" className="w-full py-4 text-lg" onClick={() => { setModal(null); showNotification("Emergency services are on the way!", "error"); }}>
                  Confirm Alert
                </Button>
              </div>
            ))}
            className="fixed bottom-8 right-8 w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-700 active:scale-90 transition-all z-50 group"
          >  <ShieldAlert size={32} />
            <span className="absolute right-full mr-4 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              EMERGENCY ASSISTANCE
            </span>
          </button>
        )}
      </main>
    </div>
  );
}

// --- Sub-components & Pages ---

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden',
      active 
        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-brand-600'
    )}
  >
    <div className={cn('transition-transform duration-300', active ? 'scale-110' : 'group-hover:scale-110')}>
      {icon}
    </div>
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);

const PatientDashboard = ({ 
  onAction, 
  onOpenModal, 
  onNavigate,
  appointments,
  onAddAppointment,
  onCancelAppointment
}: { 
  onAction: (msg: string, type?: any) => void, 
  onOpenModal: (title: string, content: React.ReactNode) => void, 
  onNavigate: (tab: string) => void,
  appointments: Appointment[],
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void,
  onCancelAppointment: (id: string) => void
}) => {
  const patientAppointments = appointments.filter(a => a.patientId === MOCK_PATIENT.id && a.status === 'scheduled');
  const nextAppointment = patientAppointments[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {MOCK_PATIENT.name}!</h2>
          <p className="text-slate-500">Here's an overview of your health status.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenModal("Video Consultation", (
            <div className="space-y-6 text-center py-4">
              <div className="relative mx-auto w-32 h-32">
                <img src={MOCK_DOCTOR.avatar} alt="Doctor" className="w-full h-full rounded-full object-cover border-4 border-emerald-100" />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20"></div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-1">{MOCK_DOCTOR.name}</h4>
                <p className="text-emerald-500 font-bold animate-pulse">Connecting to secure video line...</p>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="danger" onClick={() => onAction("Call canceled.")}>Cancel Call</Button>
              </div>
            </div>
          ))}><Video size={18} /> Video Call</Button>
          <Button onClick={() => onOpenModal("Book Appointment", (
            <div className="space-y-4">
              <p className="text-slate-600">Select a doctor to schedule your visit.</p>
              <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                {DOCTORS.map(doc => (
                  <button 
                    key={doc.id} 
                    className="p-4 border border-slate-100 rounded-2xl flex items-center gap-3 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left min-w-0" 
                    onClick={() => { 
                      onAddAppointment({
                        patientId: MOCK_PATIENT.id,
                        doctorId: doc.id,
                        doctorName: doc.name,
                        date: "2026-03-16",
                        time: "09:00 AM",
                        type: "consultation"
                      });
                    }}
                  >
                    <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-xl flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                      <p className="text-xs text-slate-500 truncate">{doc.specialty}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}><Plus size={18} /> Book Appointment</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget 
          label="Heart Rate" 
          value="72" 
          unit="bpm" 
          icon={HeartPulse} 
          color="red" 
          trend={{ value: '2%', isUp: false }} 
        />
        <StatWidget 
          label="Blood Pressure" 
          value="120/80" 
          icon={Activity} 
          color="blue" 
          trend={{ value: 'Stable', isUp: true }} 
        />
        <StatWidget 
          label="Blood Sugar" 
          value="95" 
          unit="mg/dL" 
          icon={Activity} 
          color="amber" 
          trend={{ value: '1.2%', isUp: true }} 
        />
        <StatWidget 
          label="Weight" 
          value="74" 
          unit="kg" 
          icon={Activity} 
          color="emerald" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Health Metrics Trend</h3>
            <select className="text-xs border-slate-200 rounded-lg">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEALTH_METRICS}>
                <defs>
                  <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="bp_systolic" stroke="#10b981" fillOpacity={1} fill="url(#colorBp)" strokeWidth={3} />
                <Area type="monotone" dataKey="sugar" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Upcoming Appointment */}
        <Card className="relative overflow-hidden border-brand-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-brand-500" />
            Next Appointment
          </h3>
          {nextAppointment ? (
            <>
              <div className="bg-slate-900 rounded-2xl p-5 text-white mb-4 relative z-10 shadow-lg shadow-slate-200">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <Stethoscope size={24} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-base truncate">{nextAppointment.doctorName}</p>
                    <p className="text-xs text-brand-300 font-medium uppercase tracking-wider">{nextAppointment.type}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Date</p>
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <Calendar size={14} className="text-brand-400" />
                      <span>{nextAppointment.date}</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Time</p>
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <Activity size={14} className="text-brand-400" />
                      <span>{nextAppointment.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => onOpenModal("Reschedule Appointment", (
                  <div className="space-y-4">
                    <p className="text-slate-600 text-sm">Choose a new date and time for your appointment with {nextAppointment.doctorName}.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">New Date</label>
                        <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">New Time</label>
                        <input type="time" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
                      </div>
                    </div>
                    <Button className="w-full py-3" onClick={() => onAction("Reschedule request sent successfully!")}>Confirm Reschedule</Button>
                  </div>
                ))}>Reschedule</Button>
                <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50" onClick={() => onOpenModal("Cancel Appointment", (
                  <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle size={40} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Cancel Appointment?</h4>
                      <p className="text-sm text-slate-500">Are you sure you want to cancel your appointment with {nextAppointment.doctorName} on {nextAppointment.date}?</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => onAction("Cancellation aborted.")}>No, Keep it</Button>
                      <Button variant="danger" className="flex-1" onClick={() => onCancelAppointment(nextAppointment.id)}>Yes, Cancel</Button>
                    </div>
                  </div>
                ))}>Cancel</Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} />
              </div>
              <p className="text-sm text-slate-500">No upcoming appointments</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => onNavigate("appointments")}>Book Now</Button>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reports */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Recent Reports</h3>
            <button className="text-emerald-600 text-sm font-bold hover:underline" onClick={() => onNavigate("reports")}>View All</button>
          </div>
          <div className="space-y-4">
            {REPORTS.map(report => (
              <div key={report.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3" onClick={() => onAction(`Opening ${report.title}...`)}>
                  <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{report.title}</p>
                    <p className="text-xs text-slate-500">{report.date} • {report.category}</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 group-hover:text-emerald-600 transition-colors" onClick={() => onAction(`Opening ${report.title}...`)}>
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Medicines */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Today's Medicines</h3>
            <button className="text-emerald-600 text-sm font-bold hover:underline" onClick={() => onNavigate("medicines")}>Full Schedule</button>
          </div>
          <div className="space-y-4">
            {MEDICINES.map(med => (
              <div key={med.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Pill size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{med.name} ({med.dosage})</p>
                    <p className="text-xs text-slate-500">{med.frequency} • {med.time.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">{med.remaining}/{med.total}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Left</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Form Components to handle modal state correctly
const AddPatientForm = ({ onAddPatient, onAction }: { onAddPatient: (p: any) => void, onAction: (m: string, t?: any) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!name || !email) {
      onAction("Please fill in all fields", "error");
      return;
    }
    onAddPatient({
      name,
      email,
      age: 25,
      bloodGroup: 'Unknown',
      gender: 'Other',
      emergencyContact: 'Not provided'
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-600">Enter the patient's details to register them in the system.</p>
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Full Name" 
          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button className="w-full" onClick={handleSubmit}>Register Patient</Button>
      </div>
    </div>
  );
};

const AddNoteForm = ({ onAddNote, onAction, patients }: { onAddNote: (n: any) => void, onAction: (m: string, t?: any) => void, patients: Patient[] }) => {
  const [patientId, setPatientId] = useState('');
  const [visitType, setVisitType] = useState('General Consultation');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  const handleSubmit = () => {
    if (!patientId || !subjective || !objective || !assessment || !plan) {
      onAction("Please fill in all fields", "error");
      return;
    }
    onAddNote({
      patientId,
      visitType,
      subjective,
      objective,
      assessment,
      plan
    });
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Patient</label>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Visit Type</label>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
            >
              <option>General Consultation</option>
              <option>Follow-up</option>
              <option>Emergency</option>
              <option>Diagnostic Results</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-emerald-600 uppercase">Subjective (Patient's complaints)</label>
          <textarea 
            placeholder="Chief complaint, history of present illness..." 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[80px]"
            value={subjective}
            onChange={(e) => setSubjective(e.target.value)}
          ></textarea>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-blue-600 uppercase">Objective (Vitals, physical exam)</label>
          <textarea 
            placeholder="BP, Heart rate, physical findings..." 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[80px]"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          ></textarea>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-amber-600 uppercase">Assessment (Diagnosis)</label>
          <textarea 
            placeholder="Primary and secondary diagnoses..." 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[60px]"
            value={assessment}
            onChange={(e) => setAssessment(e.target.value)}
          ></textarea>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-purple-600 uppercase">Plan (Treatment, next steps)</label>
          <textarea 
            placeholder="Medications, tests, follow-up date..." 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[80px]"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          ></textarea>
        </div>
      </div>
      <Button className="w-full py-4" onClick={handleSubmit}>Save SOAP Note</Button>
    </div>
  );
};

const DoctorDashboard = ({ 
  onAction, 
  onOpenModal, 
  onNavigate, 
  onCloseModal,
  patients,
  notes,
  appointments,
  onAddPatient,
  onDeletePatient,
  onDeleteNote,
  onCancelAppointment
}: { 
  onAction: (msg: string, type?: any) => void, 
  onOpenModal: (title: string, content: React.ReactNode) => void, 
  onNavigate: (tab: string) => void, 
  onCloseModal: () => void,
  patients: Patient[],
  notes: SOAPNote[],
  appointments: Appointment[],
  onAddPatient: (patient: Omit<Patient, 'id' | 'role' | 'avatar'>) => void,
  onDeletePatient: (id: string) => void,
  onDeleteNote: (id: string) => void,
  onCancelAppointment: (id: string) => void
}) => {
  const doctorAppointments = appointments.filter(a => a.doctorId === MOCK_DOCTOR.id && a.status === 'scheduled');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good morning, {MOCK_DOCTOR.name}</h2>
          <p className="text-slate-500">You have {doctorAppointments.length} appointments scheduled.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onNavigate("notes")}><Plus size={18} /> New Note</Button>
          <Button variant="outline" onClick={() => onNavigate("schedule")}><Calendar size={18} /> View Calendar</Button>
          <Button onClick={() => onOpenModal("Add New Patient", (
            <AddPatientForm onAddPatient={onAddPatient} onAction={onAction} />
          ))}><Plus size={18} /> Add Patient</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget 
          label="Total Patients" 
          value={patients.length.toLocaleString()} 
          icon={Users} 
          color="emerald" 
          trend={{ value: '12%', isUp: true }} 
        />
        <StatWidget 
          label="Today's Appointments" 
          value={doctorAppointments.length} 
          icon={Calendar} 
          color="blue" 
        />
        <StatWidget 
          label="Pending Reports" 
          value="14" 
          icon={FileText} 
          color="amber" 
          trend={{ value: 'High Priority', isUp: false }} 
        />
        <StatWidget 
          label="Average Rating" 
          value="4.8" 
          icon={Star} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Today's Schedule</h3>
            <button className="text-emerald-600 text-sm font-bold" onClick={() => onNavigate("appointments")}>See All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-4 font-medium">Patient</th>
                  <th className="pb-4 font-medium">Time</th>
                  <th className="pb-4 font-medium">Type</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {doctorAppointments.slice(0, 4).map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  if (!patient) return null;
                  return (
                    <tr key={appointment.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={patient.avatar} alt={patient.name} className="w-8 h-8 rounded-lg flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{patient.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">ID: {patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-slate-600">{appointment.time}</td>
                      <td className="py-4">
                        <Badge variant="default" className="capitalize">{appointment.type}</Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          {appointment.status}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" onClick={() => onOpenModal(`Call ${patient.name}`, (
                            <div className="space-y-8 text-center py-4">
                              <div className="relative mx-auto w-32 h-32">
                                <img src={patient.avatar} alt={patient.name} className="w-full h-full rounded-full object-cover border-4 border-emerald-100" />
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20"></div>
                              </div>
                              <div>
                                <h4 className="text-2xl font-bold text-slate-900 mb-1">{patient.name}</h4>
                                <p className="text-emerald-500 font-bold animate-pulse">Calling Patient...</p>
                              </div>
                              <div className="flex justify-center gap-6">
                                <button className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-90" onClick={() => { onCloseModal(); onAction("Call ended."); }}>
                                  <Phone size={24} className="rotate-[135deg]" />
                                </button>
                              </div>
                            </div>
                          ))}>
                            <Phone size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-600 transition-colors" onClick={() => {
                            if (confirm(`Cancel appointment with ${patient.name}?`)) {
                              onCancelAppointment(appointment.id);
                            }
                          }}>
                            <X size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Clinical Notes Quick Access */}
        <Card>
          <h3 className="font-bold text-slate-900 mb-4">Recent Notes</h3>
          <div className="space-y-4">
            {notes.slice(0, 3).map(note => (
              <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30"></div>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <p className="text-xs font-bold text-slate-900 truncate">Patient {note.patientId}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="text-[10px] text-slate-400">{note.date}</p>
                    <button className="text-slate-300 hover:text-red-600" onClick={() => {
                      if (confirm("Delete this note?")) {
                        onDeleteNote(note.id);
                      }
                    }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Assessment</p>
                  <p className="text-xs text-slate-600 line-clamp-1 italic">
                    {note.assessment}
                  </p>
                </div>
                <button className="text-[10px] font-bold text-emerald-600 flex items-center gap-1" onClick={() => onOpenModal(`Clinical Note: Patient ${note.patientId}`, (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="font-bold text-slate-900 truncate">Patient {note.patientId}</h4>
                      <Badge variant="success" className="flex-shrink-0">Finalized</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Subjective</p>
                        <p className="text-xs text-slate-600 italic">"{note.subjective}"</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Objective</p>
                        <p className="text-xs text-slate-600">{note.objective}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Assessment</p>
                        <p className="text-xs text-slate-600">{note.assessment}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">Plan</p>
                        <p className="text-xs text-slate-600">{note.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                        <Stethoscope size={14} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-900">{note.doctorName}</p>
                        <p className="text-[8px] text-slate-400 uppercase tracking-tighter font-mono">Verified Signature</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1" onClick={() => onAction("Note shared with patient.")}>Share</Button>
                      <Button className="flex-1" onClick={() => onNavigate("notes")}>Open Editor</Button>
                    </div>
                  </div>
                ))}>
                  Read Full SOAP Note <ChevronRight size={10} />
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6" onClick={() => onNavigate("notes")}>View All Notes</Button>
        </Card>
      </div>
    </div>
  );
};

const AppointmentsPage = ({ 
  onAction, 
  onOpenModal, 
  onCloseModal,
  appointments,
  onAddAppointment,
  onCancelAppointment
}: { 
  onAction: (msg: string, type?: any) => void, 
  onOpenModal: (title: string, content: React.ReactNode) => void, 
  onCloseModal: () => void,
  appointments: Appointment[],
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void,
  onCancelAppointment: (id: string) => void
}) => {
  const patientAppointments = appointments.filter(a => a.patientId === MOCK_PATIENT.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
        <Button onClick={() => onOpenModal("Schedule Appointment", (
          <div className="space-y-4">
            <p className="text-slate-600 text-sm">Fill in the details to schedule a new appointment with a specialist.</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                  <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Time</label>
                  <input type="time" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Department</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm">
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                </select>
              </div>
              <Button className="w-full py-3" onClick={() => { 
                onAddAppointment({
                  patientId: MOCK_PATIENT.id,
                  doctorId: DOCTORS[0].id,
                  doctorName: DOCTORS[0].name,
                  date: "2026-03-16",
                  time: "10:00 AM",
                  type: "consultation"
                });
              }}>Confirm Booking</Button>
            </div>
          </div>
        ))}><Plus size={18} /> New Appointment</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-slate-900 mb-6">Available Specialists</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DOCTORS.map(doc => (
                <div key={doc.id} className="border border-slate-100 rounded-2xl p-5 hover:border-emerald-200 transition-all group min-w-0">
                  <div className="flex items-center gap-4 mb-4 min-w-0">
                    <img src={doc.avatar} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{doc.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{doc.specialty}</p>
                      <div className="flex items-center gap-1 text-amber-400 mt-1">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold text-slate-700">{doc.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Experience</span>
                      <span className="font-bold text-slate-900">{doc.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Hospital</span>
                      <span className="font-bold text-slate-900">{doc.hospital}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => onOpenModal(`Call ${doc.name}`, (
                      <div className="space-y-8 text-center py-4">
                        <div className="relative mx-auto w-32 h-32">
                          <img src={doc.avatar} alt={doc.name} className="w-full h-full rounded-full object-cover border-4 border-emerald-100" />
                          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20"></div>
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-slate-900 mb-1">{doc.name}</h4>
                          <p className="text-emerald-500 font-bold animate-pulse">Calling...</p>
                        </div>
                        <div className="flex justify-center gap-6">
                          <button className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-90" onClick={() => { onCloseModal(); onAction("Call ended."); }}>
                            <Phone size={24} className="rotate-[135deg]" />
                          </button>
                        </div>
                      </div>
                    ))}><PhoneCall size={14} /> Call</Button>
                    <Button size="sm" className="w-full" onClick={() => onOpenModal("Confirm Booking", (
                      <div className="space-y-6 text-center">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                          <Calendar size={40} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">Book with {doc.name}</h4>
                          <p className="text-sm text-slate-500">You are about to book an appointment with {doc.name} ({doc.specialty}).</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2">
                          <p className="text-xs font-bold text-slate-400 uppercase">Available Slot</p>
                          <p className="text-sm text-slate-900 font-medium">Tomorrow, Mar 16 at 09:00 AM</p>
                        </div>
                        <Button className="w-full py-3" onClick={() => {
                          onAddAppointment({
                            patientId: MOCK_PATIENT.id,
                            doctorId: doc.id,
                            doctorName: doc.name,
                            date: "2026-03-16",
                            time: "09:00 AM",
                            type: "consultation"
                          });
                        }}>Confirm Appointment</Button>
                      </div>
                    ))}>Book Now</Button>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-red-500 hover:bg-red-50 text-xs" onClick={() => onOpenModal("Report Doctor", (
                    <div className="space-y-6 text-center">
                      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle size={40} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Report {doc.name}</h4>
                        <p className="text-sm text-slate-500">Please describe the issue you encountered. Our medical ethics committee will review your report within 24 hours.</p>
                      </div>
                      <textarea 
                        placeholder="Describe the issue..." 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm min-h-[120px]"
                      ></textarea>
                      <Button variant="danger" className="w-full" onClick={() => { onAction("Report submitted. Our team will contact you shortly.", "error"); }}>Submit Report</Button>
                    </div>
                  ))}>
                    <AlertCircle size={14} /> Report Doctor
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Your Scheduled Appointments</h3>
            <div className="space-y-4">
              {patientAppointments.length > 0 ? (
                patientAppointments.map(appointment => (
                  <div key={appointment.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100">
                        <Stethoscope size={20} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{appointment.doctorName}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity size={14} />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    {appointment.status === 'scheduled' && (
                      <button 
                        className="mt-3 w-full py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                        onClick={() => {
                          if (confirm("Cancel this appointment?")) {
                            onCancelAppointment(appointment.id);
                          }
                        }}
                      >
                        Cancel Appointment
                      </button>
                    )}
                    {appointment.status === 'cancelled' && (
                      <div className="mt-3 w-full py-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 rounded-lg text-center">
                        Cancelled
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500 italic">No appointments scheduled</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ReportsPage = ({ onAction, onOpenModal }: { onAction: (msg: string, type?: any) => void, onOpenModal: (title: string, content: React.ReactNode) => void }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Medical Reports</h2>
    <div className="grid gap-4">
      {REPORTS.map(report => (
        <Card key={report.id} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{report.title}</h4>
              <p className="text-sm text-slate-500">{report.date} • {report.category}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenModal(report.title, (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{report.title}</h4>
                    <p className="text-xs text-slate-500">Generated on {report.date}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-slate-900">Summary</h5>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The clinical findings indicate normal parameters across the primary metrics. 
                    No significant abnormalities were detected in the {report.category.toLowerCase()} screening.
                    Recommended follow-up in 6 months for routine monitoring.
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => onAction(`Sharing ${report.title}...`)}>Share</Button>
                  <Button className="flex-1" onClick={() => onAction(`Downloading ${report.title}...`)}>Download PDF</Button>
                </div>
              </div>
            ))}>View</Button>
            <Button variant="primary" size="sm" onClick={() => onAction(`Downloading ${report.title}...`)}>Download</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const MedicinesPage = ({ onAction, onOpenModal }: { onAction: (msg: string, type?: any) => void, onOpenModal: (title: string, content: React.ReactNode) => void }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-900">My Medicines</h2>
      <Button variant="outline" onClick={() => onOpenModal("Medicine Reminders", (
        <div className="space-y-6">
          <p className="text-slate-600 text-sm">Configure your daily medication reminders to stay on track.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Push Notifications</p>
                <p className="text-xs text-slate-500">Receive alerts on your device</p>
              </div>
              <div className="w-12 h-6 bg-emerald-600 rounded-full relative">
                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Email Reminders</p>
                <p className="text-xs text-slate-500">Get daily schedule via email</p>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <Button className="w-full" onClick={() => onAction("Reminder settings updated!")}>Save Preferences</Button>
          </div>
        </div>
      ))}><Bell size={18} /> Set Reminders</Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {MEDICINES.map(med => (
        <Card key={med.id}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Pill size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{med.name}</h4>
                <p className="text-sm text-slate-500">{med.dosage} • {med.frequency}</p>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-500">Refill Progress</span>
                <span className="text-slate-900">{med.remaining} / {med.total} pills left</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${(med.remaining / med.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {med.time.map((t, i) => (
                <div key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600 flex items-center gap-1.5">
                  <Activity size={12} /> {t}
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6" onClick={() => onOpenModal(`Refill Request: ${med.name}`, (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Pill size={40} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Request Refill for {med.name}</h4>
                <p className="text-sm text-slate-500">Your current supply is at {med.remaining} pills. A refill request will be sent to your primary physician for approval.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Pharmacy Location</p>
                <p className="text-sm text-slate-900 font-medium">Central Care Pharmacy - 123 Medical Way</p>
              </div>
              <Button className="w-full py-3" onClick={() => onAction(`Refill request for ${med.name} sent to Dr. ${MOCK_DOCTOR.name.split(' ').pop()}.`)}>Submit Request</Button>
            </div>
          ))}>Request Refill</Button>
        </Card>
      ))}
    </div>
  </div>
);

const PatientsPage = ({ 
  onAction, 
  onOpenModal, 
  onCloseModal,
  patients,
  onAddPatient,
  onDeletePatient
}: { 
  onAction: (msg: string, type?: any) => void, 
  onOpenModal: (title: string, content: React.ReactNode) => void, 
  onCloseModal: () => void,
  patients: Patient[],
  onAddPatient: (patient: Omit<Patient, 'id' | 'role' | 'avatar'>) => void,
  onDeletePatient: (id: string) => void
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Patient Directory</h2>
        <Button onClick={() => onOpenModal("Add New Patient", (
          <AddPatientForm onAddPatient={onAddPatient} onAction={onAction} />
        ))}><Plus size={18} /> Add Patient</Button>
      </div>
      <Card>
        <div className="space-y-4">
          {patients.map(patient => (
            <div key={patient.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-xl flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{patient.name}</h4>
                  <p className="text-xs text-slate-500 truncate">ID: #{patient.id.toUpperCase()} • Last Visit: 2 days ago</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => onOpenModal(`Patient History: ${patient.name}`, (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6 min-w-0">
                      <img src={patient.avatar} alt={patient.name} className="w-16 h-16 rounded-2xl flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{patient.name}</h4>
                        <p className="text-xs text-slate-500 truncate">Member since Jan 2024</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h5 className="text-sm font-bold text-slate-900">Recent Activity</h5>
                      {[1, 2].map(j => (
                        <div key={j} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{j === 1 ? 'General Checkup' : 'Blood Test'}</p>
                            <p className="text-[10px] text-slate-500">Mar {10 + j}, 2026</p>
                          </div>
                          <Badge variant="success">Completed</Badge>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" onClick={() => onAction(`Opening full history for ${patient.name}...`)}>View Full History</Button>
                  </div>
                ))}>History</Button>
                <Button variant="outline" size="sm" onClick={() => onOpenModal(`Clinical Notes: ${patient.name}`, (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4 gap-4">
                      <h4 className="font-bold text-slate-900 truncate">Notes for {patient.name}</h4>
                      <Button size="sm" className="flex-shrink-0" onClick={() => onAction("Opening note editor...")}><Plus size={14} /> Add Note</Button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {[1, 2].map(j => (
                        <div key={j} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 mb-1">MAR {15 - j}, 2026</p>
                          <p className="text-xs text-slate-600">Patient is showing steady improvement. Continued medication as prescribed.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}>Notes</Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200" onClick={() => {
                  if (confirm(`Are you sure you want to delete patient ${patient.name}? This will also delete all their clinical notes.`)) {
                    onDeletePatient(patient.id);
                  }
                }}>
                  <Trash2 size={16} />
                </Button>
                <Button size="sm" onClick={() => onOpenModal(`Patient Profile: ${patient.name}`, (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={patient.avatar} alt={patient.name} className="w-20 h-20 rounded-3xl flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xl font-bold text-slate-900 truncate">{patient.name}</h4>
                        <p className="text-sm text-slate-500 truncate">ID: #{patient.id.toUpperCase()}</p>
                        <Badge variant="success" className="mt-2">Stable</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Age</p>
                        <p className="text-sm font-bold text-slate-900">{patient.age} Years</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Type</p>
                        <p className="text-sm font-bold text-slate-900">{patient.bloodGroup}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full" onClick={() => onAction(`Opening full medical records for ${patient.name}...`)}>View Full Records</Button>
                      <Button variant="outline" className="w-full" onClick={() => onOpenModal(`Contact Patient: ${patient.name}`, (
                        <div className="space-y-6 text-center py-4">
                          <div className="relative mx-auto w-32 h-32 flex-shrink-0">
                            <img src={patient.avatar} alt={patient.name} className="w-full h-full rounded-full object-cover border-4 border-emerald-100" />
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20"></div>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-2xl font-bold text-slate-900 mb-1 truncate">{patient.name}</h4>
                            <p className="text-emerald-500 font-bold animate-pulse">Calling Patient...</p>
                          </div>
                          <div className="flex justify-center gap-6">
                            <button className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-90" onClick={() => { onCloseModal(); onAction("Call ended."); }}>
                              <Phone size={24} className="rotate-[135deg]" />
                            </button>
                          </div>
                        </div>
                      ))}>Contact Patient</Button>
                    </div>
                  </div>
                ))}>View Profile</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const AddAppointmentForm = ({ 
  onAddAppointment, 
  onAction, 
  patients 
}: { 
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void, 
  onAction: (msg: string, type?: any) => void,
  patients: Patient[]
}) => {
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<'consultation' | 'follow-up' | 'emergency'>('consultation');

  const handleSubmit = () => {
    if (!patientId || !date || !time) {
      onAction("Please fill all required fields", "error");
      return;
    }
    onAddAppointment({
      patientId,
      doctorId: MOCK_DOCTOR.id,
      doctorName: MOCK_DOCTOR.name,
      date,
      time,
      type
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">Patient</label>
        <select 
          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
          <input 
            type="date" 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Time</label>
          <input 
            type="time" 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">Appointment Type</label>
        <div className="flex gap-2">
          {['consultation', 'follow-up', 'emergency'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t as any)}
              className={cn(
                "flex-1 py-2 rounded-xl text-xs font-bold capitalize border transition-all",
                type === t 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                  : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <Button className="w-full py-4 mt-2" onClick={handleSubmit}>Schedule Appointment</Button>
    </div>
  );
};

const SchedulePage = ({ 
  onAction, 
  onOpenModal,
  appointments,
  patients,
  onAddAppointment,
  onCancelAppointment
}: { 
  onAction: (msg: string, type?: any) => void, 
  onOpenModal: (title: string, content: React.ReactNode) => void,
  appointments: Appointment[],
  patients: Patient[],
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void,
  onCancelAppointment: (id: string) => void
}) => {
  const doctorAppointments = appointments.filter(a => a.doctorId === MOCK_DOCTOR.id && a.status === 'scheduled');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">My Schedule</h2>
        <Button onClick={() => onOpenModal("Schedule Appointment", (
          <AddAppointmentForm onAddAppointment={onAddAppointment} onAction={onAction} patients={patients} />
        ))}><Plus size={18} /> New Appointment</Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Calendar View</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Today</Button>
              <div className="flex border border-slate-200 rounded-xl overflow-hidden">
                <button className="p-2 hover:bg-slate-50 border-r border-slate-200"><ChevronRight size={16} className="rotate-180" /></button>
                <button className="p-2 hover:bg-slate-50"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-4 text-center border-r border-slate-100 last:border-r-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 h-[500px]">
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 3; // Mocking some days
              const isToday = day === 15;
              const hasAppointment = doctorAppointments.some(a => a.date.endsWith(`-${day < 10 ? '0' + day : day}`));
              
              return (
                <div key={i} className={cn(
                  "p-2 border-r border-b border-slate-100 last:border-r-0 relative group hover:bg-slate-50 transition-colors",
                  day <= 0 || day > 31 ? "bg-slate-50/30" : "bg-white"
                )}>
                  {day > 0 && day <= 31 && (
                    <>
                      <span className={cn(
                        "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                        isToday ? "bg-emerald-600 text-white" : "text-slate-600"
                      )}>{day}</span>
                      {hasAppointment && (
                        <div className="mt-1 space-y-1 overflow-hidden">
                          {doctorAppointments.filter(a => a.date.endsWith(`-${day < 10 ? '0' + day : day}`)).map(a => (
                            <div key={a.id} className="text-[8px] p-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 truncate font-bold" title={`${a.time} - ${patients.find(p => p.id === a.patientId)?.name}`}>
                              {a.time} - {patients.find(p => p.id === a.patientId)?.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Upcoming Appointments</h3>
            <div className="space-y-4">
              {doctorAppointments.length > 0 ? (
                doctorAppointments.sort((a, b) => a.date.localeCompare(b.date)).map(appointment => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  return (
                    <div key={appointment.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={appointment.type === 'emergency' ? 'danger' : 'default'}>
                          {appointment.type}
                        </Badge>
                        <p className="text-[10px] font-bold text-slate-400">{appointment.date}</p>
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={patient?.avatar} alt={patient?.name} className="w-8 h-8 rounded-lg flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{patient?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{appointment.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">No upcoming appointments</p>
              )}
            </div>
          </Card>

          <Card className="bg-slate-900 text-white border-none">
            <h3 className="font-bold mb-2">Schedule Tip</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Keep your availability updated to allow patients to book slots that work best for you. 
              Emergency slots are automatically prioritized.
            </p>
            <Button variant="outline" className="w-full mt-4 border-slate-700 text-white hover:bg-slate-800">
              Update Availability
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

const NotesPage = ({ 
  onAction, 
  onOpenModal,
  notes,
  onAddNote,
  patients,
  onDeleteNote
}: { 
  onAction: (msg: string, type?: any) => void, 
  onOpenModal: (title: string, content: React.ReactNode) => void,
  notes: SOAPNote[],
  onAddNote: (note: Omit<SOAPNote, 'id' | 'doctorId' | 'doctorName' | 'date' | 'status'>) => void,
  patients: Patient[],
  onDeleteNote: (id: string) => void
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Clinical Notes</h2>
        <Button onClick={() => onOpenModal("New SOAP Note", (
          <AddNoteForm onAddNote={onAddNote} onAction={onAction} patients={patients} />
        ))}><Plus size={18} /> New SOAP Note</Button>
      </div>
      <div className="grid gap-6">
        {notes.map(note => (
          <Card key={note.id} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                  <FileText size={24} className="text-slate-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-lg truncate">Patient {note.patientId.startsWith('#') ? note.patientId : `#${note.patientId.toUpperCase()}`}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2 truncate">
                    <Calendar size={12} className="flex-shrink-0" /> {note.date} • <Activity size={12} className="flex-shrink-0" /> {note.visitType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="success">{note.status === 'finalized' ? 'Finalized' : 'Draft'}</Badge>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => {
                  if (confirm("Are you sure you want to delete this SOAP note?")) {
                    onDeleteNote(note.id);
                  }
                }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Subjective</p>
                  <p className="text-sm text-slate-600 italic">"{note.subjective}"</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Objective</p>
                  <p className="text-sm text-slate-600">{note.objective}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Assessment</p>
                  <p className="text-sm text-slate-600">{note.assessment}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">Plan</p>
                  <p className="text-sm text-slate-600">{note.plan}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                  <Stethoscope size={14} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-900">{note.doctorName}</p>
                  <p className="text-[8px] text-slate-400 uppercase tracking-tighter font-mono">Digitally Signed • {note.date}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onOpenModal("Edit SOAP Note", (
                  <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-600 uppercase">Subjective</label>
                        <textarea defaultValue={note.subjective} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[60px]"></textarea>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-blue-600 uppercase">Objective</label>
                        <textarea defaultValue={note.objective} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[60px]"></textarea>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-600 uppercase">Assessment</label>
                        <textarea defaultValue={note.assessment} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[60px]"></textarea>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-purple-600 uppercase">Plan</label>
                        <textarea defaultValue={note.plan} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm min-h-[60px]"></textarea>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => onAction("Note updated successfully!")}>Update Note</Button>
                  </div>
                ))}>Edit</Button>
                <Button variant="outline" size="sm" onClick={() => onOpenModal("Share Note", (
                  <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Share2 size={40} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">Share with Patient?</h4>
                      <p className="text-sm text-slate-500">This will make the clinical note visible to Patient {note.patientId} in their portal.</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => onAction("Sharing canceled.")}>Cancel</Button>
                      <Button className="flex-1" onClick={() => onAction(`Note shared with Patient ${note.patientId}.`)}>Confirm Share</Button>
                    </div>
                  </div>
                ))}>Share</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const MessagesPage = ({ onAction, onOpenModal, onCloseModal }: { onAction: (msg: string, type?: any) => void, onOpenModal: (title: string, content: React.ReactNode) => void, onCloseModal: () => void }) => (
  <div className="h-[calc(100vh-12rem)] flex gap-6">
    <Card className="w-80 flex flex-col p-0 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Messages</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {[1, 2, 3, 4].map(i => (
          <button key={i} className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left" onClick={() => onAction(`Switching to chat with Contact Name ${i}...`)}>
            <img src={`https://picsum.photos/seed/m${i}/100`} alt="User" className="w-10 h-10 rounded-xl" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-sm font-bold text-slate-900 truncate">Contact Name {i}</p>
                <span className="text-[10px] text-slate-400">12:30 PM</span>
              </div>
              <p className="text-xs text-slate-500 truncate">Hey, how are you feeling today?</p>
            </div>
          </button>
        ))}
      </div>
    </Card>
    <Card className="flex-1 flex flex-col p-0 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/seed/m1/100" alt="User" className="w-10 h-10 rounded-xl" />
          <div>
            <p className="text-sm font-bold text-slate-900">Contact Name 1</p>
            <p className="text-[10px] text-emerald-500 font-bold">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg" onClick={() => onOpenModal("Voice Call", (
            <div className="space-y-8 text-center py-4">
              <div className="relative mx-auto w-32 h-32">
                <img src="https://picsum.photos/seed/m1/200" alt="User" className="w-full h-full rounded-full object-cover border-4 border-emerald-100" />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20"></div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-1">Contact Name 1</h4>
                <p className="text-emerald-500 font-bold animate-pulse">Calling...</p>
              </div>
              <div className="flex justify-center gap-6">
                <button className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors" onClick={onCloseModal}>
                  <X size={24} />
                </button>
                <button className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-90" onClick={() => { onCloseModal(); onAction("Call ended."); }}>
                  <Phone size={24} className="rotate-[135deg]" />
                </button>
              </div>
            </div>
          ))}><Phone size={18} /></button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg" onClick={() => onOpenModal("Video Call", (
            <div className="space-y-6">
              <div className="aspect-video bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center">
                <img src="https://picsum.photos/seed/m1/800/450" alt="Video" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-bold text-xl">Connecting...</p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 w-32 aspect-video bg-slate-800 rounded-xl border-2 border-white/20 overflow-hidden">
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <Users size={20} className="text-white/30" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="danger" className="px-8 py-3" onClick={() => { onCloseModal(); onAction("Video call ended."); }}>End Call</Button>
              </div>
            </div>
          ))}><Video size={18} /></button>
        </div>
      </div>
      <div className="flex-1 bg-slate-50/50 p-6 overflow-y-auto space-y-4">
        <div className="flex justify-start">
          <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 max-w-[70%] text-sm text-slate-600">
            Hello! I wanted to check in on your recovery.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-emerald-600 p-3 rounded-2xl rounded-tr-none text-white max-w-[70%] text-sm">
            I'm feeling much better, thank you doctor!
          </div>
        </div>
      </div>
      <form className="p-4 border-t border-slate-100 flex gap-3" onSubmit={(e) => { e.preventDefault(); onAction("Message sent successfully!"); }}>
        <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-50 border-none rounded-xl px-4 text-sm focus:ring-emerald-500" />
        <Button className="w-10 h-10 p-0 rounded-xl" type="submit"><ChevronRight size={20} /></Button>
      </form>
    </Card>
  </div>
);

const SettingsPage = ({ isDarkMode, setIsDarkMode, language, setLanguage, onAction, onOpenModal }: any) => (
  <div className="max-w-2xl mx-auto space-y-8">
    <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
    
    <section className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Appearance</h3>
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </div>
          <div>
            <p className="font-bold text-slate-900">Dark Mode</p>
            <p className="text-xs text-slate-500">Adjust the app's visual theme</p>
          </div>
        </div>
        <button 
          onClick={() => { setIsDarkMode(!isDarkMode); onAction(`Theme switched to ${!isDarkMode ? 'Dark' : 'Light'} mode.`); }}
          className={cn(
            'w-12 h-6 rounded-full transition-colors relative',
            isDarkMode ? 'bg-emerald-600' : 'bg-slate-200'
          )}
        >
          <div className={cn(
            'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
            isDarkMode ? 'translate-x-7' : 'translate-x-1'
          )}></div>
        </button>
      </Card>
    </section>

    <section className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Localization</h3>
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
            <Globe size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900">Language</p>
            <p className="text-xs text-slate-500">Select your preferred language</p>
          </div>
        </div>
        <select 
          value={language}
          onChange={(e) => { setLanguage(e.target.value); onAction(`Language changed to ${e.target.value}.`); }}
          className="border-slate-200 rounded-xl text-sm"
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
        </select>
      </Card>
    </section>

    <section className="space-y-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Security</h3>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900">Change Password</p>
            <p className="text-xs text-slate-500">Update your account security</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onOpenModal("Change Password", (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">Enter your current password and a new one to update your security.</p>
              <div className="space-y-3">
                <input type="password" placeholder="Current Password" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
                <input type="password" placeholder="New Password" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
                <input type="password" placeholder="Confirm New Password" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
                <Button className="w-full py-3" onClick={() => onAction("Password updated successfully!")}>Update Password</Button>
              </div>
            </div>
          ))}>Update</Button>
        </div>
        <div className="h-px bg-slate-50"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900">Two-Factor Authentication</p>
            <p className="text-xs text-slate-500">Add an extra layer of security</p>
          </div>
          <button onClick={() => onAction("Redirecting to 2FA setup...")}><Badge>Recommended</Badge></button>
        </div>
      </Card>
    </section>
  </div>
);
