import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Search, 
  Calendar, 
  UserRoundCheck, 
  Clock, 
  Shield, 
  Stethoscope, 
  Filter, 
  CalendarPlus, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  RefreshCw,
  FileText
} from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StatsDashboard from './components/StatsDashboard';
import DoctorCard from './components/DoctorCard';
import DoctorModal from './components/DoctorModal';
import BookingModal from './components/BookingModal';
import AppointmentCard from './components/AppointmentCard';
import PrescriptionView from './components/PrescriptionView';

import { 
  getDoctors, 
  getAppointments, 
  getDashboardStats, 
  cancelAppointment 
} from './services/api';

const SPECIALIZATIONS = [
  'All',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'General Medicine'
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Doctors State
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  // Appointments State
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsFilter, setAppointmentsFilter] = useState('All'); // All, Confirmed, Cancelled

  // Stats State
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Modals State
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [doctorToBook, setDoctorToBook] = useState(null);

  // Feedback Notification
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch doctors
  const loadDoctors = async (search = searchQuery, spec = selectedSpecialization) => {
    try {
      setDoctorsLoading(true);
      const res = await getDoctors({ search, specialization: spec });
      setDoctors(res.data || []);
      setDoctorsError('');
    } catch (err) {
      console.error('Failed to load doctors:', err);
      setDoctorsError('Unable to load doctors list. Please check if backend is running.');
    } finally {
      setDoctorsLoading(false);
    }
  };

  // Fetch appointments
  const loadAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const res = await getAppointments();
      setAppointments(res.data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Fetch stats
  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const res = await getDashboardStats();
      setStats(res.data || null);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Initial Data Load
  useEffect(() => {
    loadDoctors();
    loadAppointments();
    loadStats();
  }, []);

  // Filter or search doctors whenever searchQuery or selectedSpecialization changes
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDoctors(searchQuery, selectedSpecialization);
  };

  const handleSpecializationChange = (spec) => {
    setSelectedSpecialization(spec);
    loadDoctors(searchQuery, spec);
  };

  // Open booking modal with pre-selected doctor
  const handleOpenBookDoctor = (doc) => {
    setDoctorToBook(doc);
    setBookingModalOpen(true);
  };

  // Handle successful booking
  const handleBookingSuccess = () => {
    loadAppointments();
    loadStats();
    showNotification('Appointment booked successfully!', 'success');
  };

  // Handle cancellation
  const handleCancelAppointment = async (id) => {
    try {
      await cancelAppointment(id);
      loadAppointments();
      loadStats();
      showNotification(`Appointment #${id} has been cancelled.`, 'info');
    } catch (err) {
      showNotification(err.message || 'Failed to cancel appointment', 'error');
    }
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((appt) => {
    if (appointmentsFilter === 'All') return true;
    return appt.status === appointmentsFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold border ${
            notification.type === 'success' 
              ? 'bg-emerald-600 text-white border-emerald-500' 
              : notification.type === 'error'
              ? 'bg-rose-600 text-white border-rose-500'
              : 'bg-slate-800 text-white border-slate-700'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBookModal={() => {
          setDoctorToBook(null);
          setBookingModalOpen(true);
        }}
      />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ======================================================== */}
        {/* TAB 1: HOME PAGE (Overview & Dashboard)                  */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <div className="relative rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-teal-600 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
              <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>Next-Gen Healthcare Scheduling</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  Effortless Doctor Appointments, <span className="text-teal-200">Simplified</span>.
                </h1>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                  Welcome to <strong>MediCare</strong>. Connect with certified doctors across top medical specializations, book guaranteed appointment slots, manage bookings, and access sample digital prescriptions.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setDoctorToBook(null);
                      setBookingModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm shadow-md hover:bg-brand-50 transition-all active:scale-95"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Book an Appointment
                  </button>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-800/40 hover:bg-brand-800/60 text-white font-semibold text-sm border border-white/20 transition-all backdrop-blur-xs"
                  >
                    <span>Browse Specialists</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Statistics Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinic Overview & Metrics</h2>
                  <p className="text-xs text-slate-500">Live operational dashboard metrics</p>
                </div>
                <button
                  onClick={() => {
                    loadStats();
                    loadAppointments();
                  }}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 shadow-2xs"
                  title="Refresh statistics"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>

              <StatsDashboard
                stats={stats}
                loading={statsLoading}
                onOpenBookModal={() => {
                  setDoctorToBook(null);
                  setBookingModalOpen(true);
                }}
              />
            </section>

            {/* Featured Doctors Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Featured Medical Specialists</h2>
                  <p className="text-xs text-slate-500">Board-certified doctors currently available for booking</p>
                </div>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>View All Doctors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {doctorsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-72 bg-slate-200/60 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.slice(0, 3).map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onViewDetails={(doc) => setSelectedDoctorForModal(doc)}
                      onBookDoctor={handleOpenBookDoctor}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Quick System Features Banner */}
            <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
              <h3 className="text-center text-lg font-bold text-slate-900 mb-6">Why Patients Choose MediCare</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-2xl bg-brand-50/50 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <UserRoundCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Verified Specialists</h4>
                  <p className="text-xs text-slate-600">Access top medical practitioners across cardiology, dermatology, pediatrics, and more.</p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/50 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <CalendarPlus className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Conflict-Free Booking</h4>
                  <p className="text-xs text-slate-600">Intelligent SQLite validation ensures no duplicate bookings occur for any specialist slot.</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Digital Prescriptions</h4>
                  <p className="text-xs text-slate-600">Quickly view medicines, dosages, and personalized lifestyle advice in an organized digital format.</p>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DOCTOR LISTING & SEARCH                           */}
        {/* ======================================================== */}
        {activeTab === 'doctors' && (
          <div className="space-y-8">
            
            {/* Header & Search Bar */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Medical Specialists Directory
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Search by practitioner name or medical specialization, and view detailed credentials.
                </p>
              </div>

              {/* Search input & Filters */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search doctor by name (e.g. Jenkins, Marcus) or specialty (e.g. Cardiology)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    Search
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        loadDoctors('', selectedSpecialization);
                      }}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </form>

                {/* Specialization Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Filter:
                  </span>
                  {SPECIALIZATIONS.map((spec) => {
                    const isSelected = selectedSpecialization === spec;
                    return (
                      <button
                        key={spec}
                        onClick={() => handleSpecializationChange(spec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                        }`}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            {doctorsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-80 bg-slate-200/60 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : doctorsError ? (
              <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-800">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="font-semibold">{doctorsError}</p>
                <button
                  onClick={() => loadDoctors()}
                  className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
                >
                  Retry Loading
                </button>
              </div>
            ) : doctors.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No Doctors Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No medical practitioner matched your search for "{searchQuery}". Try searching by another keyword or reset the filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialization('All');
                    loadDoctors('', 'All');
                  }}
                  className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onViewDetails={(doc) => setSelectedDoctorForModal(doc)}
                    onBookDoctor={handleOpenBookDoctor}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MY APPOINTMENTS                                   */}
        {/* ======================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  My Booked Appointments
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Manage your consultations, check status, or cancel scheduled slots.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAppointments}
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center gap-1.5 shadow-2xs"
                  title="Refresh Appointments"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={() => {
                    setDoctorToBook(null);
                    setBookingModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xs"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book New Slot
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              {['All', 'Confirmed', 'Cancelled'].map((status) => {
                const isSelected = appointmentsFilter === status;
                const count = appointments.filter((a) => status === 'All' || a.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setAppointmentsFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{status}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Appointments List */}
            {appointmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-32 bg-slate-200/60 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No Appointments Recorded</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    {appointmentsFilter === 'All'
                      ? 'You have not booked any medical appointments yet. Choose a specialist to schedule your visit.'
                      : `No appointments with status "${appointmentsFilter}" found.`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDoctorToBook(null);
                    setBookingModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onCancelAppointment={handleCancelAppointment}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DIGITAL PRESCRIPTION                              */}
        {/* ======================================================== */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Digital Prescriptions
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                View sample medical prescriptions with doctor recommendations, medications, and dosage schedules.
              </p>
            </div>

            <PrescriptionView />
          </div>
        )}

      </main>

      {/* Doctor Details Modal */}
      {selectedDoctorForModal && (
        <DoctorModal
          doctor={selectedDoctorForModal}
          onClose={() => setSelectedDoctorForModal(null)}
          onBookDoctor={handleOpenBookDoctor}
        />
      )}

      {/* Booking Form Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        doctors={doctors}
        selectedDoctor={doctorToBook}
        onBookingSuccess={handleBookingSuccess}
        onViewAppointments={() => setActiveTab('appointments')}
      />

      {/* Page Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

    </div>
  );
}
