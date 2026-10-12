import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Hash, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Stethoscope,
  ArrowRight
} from 'lucide-react';
import { bookAppointment } from '../services/api';

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '04:30 PM'
];

export default function BookingModal({
  isOpen,
  onClose,
  doctors = [],
  selectedDoctor = null,
  onBookingSuccess,
  onViewAppointments
}) {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_phone: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Initialize today's date for min date attribute
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (selectedDoctor) {
      setFormData((prev) => ({
        ...prev,
        doctor_id: selectedDoctor.id.toString()
      }));
    } else if (doctors.length > 0 && !formData.doctor_id) {
      setFormData((prev) => ({
        ...prev,
        doctor_id: doctors[0].id.toString()
      }));
    }
  }, [selectedDoctor, doctors]);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setServerError('');
      setSuccessData(null);
      setFormErrors({});
      if (!formData.appointment_date) {
        // Default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData((prev) => ({
          ...prev,
          appointment_date: tomorrow.toISOString().split('T')[0],
          appointment_time: '10:00 AM'
        }));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!formData.patient_name.trim()) {
      errors.patient_name = 'Patient name is required.';
    } else if (formData.patient_name.trim().length < 2) {
      errors.patient_name = 'Name must be at least 2 characters.';
    }

    if (!formData.patient_age) {
      errors.patient_age = 'Patient age is required.';
    } else if (isNaN(formData.patient_age) || Number(formData.patient_age) < 1 || Number(formData.patient_age) > 130) {
      errors.patient_age = 'Please enter a valid age (1-130).';
    }

    if (!formData.patient_phone.trim()) {
      errors.patient_phone = 'Phone number is required.';
    } else if (formData.patient_phone.trim().length < 7) {
      errors.patient_phone = 'Please enter a valid phone number.';
    }

    if (!formData.doctor_id) {
      errors.doctor_id = 'Please select a consulting doctor.';
    }

    if (!formData.appointment_date) {
      errors.appointment_date = 'Please pick a consultation date.';
    }

    if (!formData.appointment_time) {
      errors.appointment_time = 'Please select a preferred time slot.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        patient_name: formData.patient_name.trim(),
        patient_age: parseInt(formData.patient_age, 10),
        patient_phone: formData.patient_phone.trim(),
        doctor_id: parseInt(formData.doctor_id, 10),
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time
      };

      const response = await bookAppointment(payload);
      setSuccessData(response.data || response);
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (err) {
      // Handles 409 Conflict and other errors with descriptive message
      setServerError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentDoctor = doctors.find((d) => d.id.toString() === formData.doctor_id.toString());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-600 to-teal-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Book an Appointment</h3>
              <p className="text-xs text-white/80">Schedule your consultation with top specialists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-slate-900">Appointment Confirmed!</h4>
              <p className="text-sm text-slate-500 mt-1">
                Your consultation has been booked successfully.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Patient Name:</span>
                <span className="font-semibold text-slate-800">{successData.patient_name || formData.patient_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-semibold text-brand-700">{successData.doctor_name || currentDoctor?.name || 'Selected Doctor'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Specialization:</span>
                <span className="font-semibold text-slate-800">{successData.doctor_specialization || currentDoctor?.specialization}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold text-emerald-700">
                  {successData.appointment_date || formData.appointment_date} at {successData.appointment_time || formData.appointment_time}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onViewAppointments) onViewAppointments();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors text-sm shadow-sm"
              >
                <span>View My Bookings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Conflict or Server Error Alert */}
            {serverError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs sm:text-sm animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Booking Conflict / Error:</span>
                  <span>{serverError}</span>
                </div>
              </div>
            )}

            {/* Doctor Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Specialist *
              </label>
              <div className="relative">
                <select
                  value={formData.doctor_id}
                  onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white shadow-2xs appearance-none"
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} – {doc.specialization} (${doc.consultation_fee ?? doc.fee})
                    </option>
                  ))}
                </select>
                <Stethoscope className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
              {formErrors.doctor_id && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.doctor_id}</p>
              )}
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Patient Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. John Miller"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              {formErrors.patient_name && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.patient_name}</p>
              )}
            </div>

            {/* Patient Age and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="e.g. 35"
                    value={formData.patient_age}
                    onChange={(e) => setFormData({ ...formData, patient_age: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
                  />
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                {formErrors.patient_age && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.patient_age}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. +1 555-0199"
                    value={formData.patient_phone}
                    onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                {formErrors.patient_phone && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.patient_phone}</p>
                )}
              </div>
            </div>

            {/* Appointment Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Consultation Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={todayStr}
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              {formErrors.appointment_date && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.appointment_date}</p>
              )}
            </div>

            {/* Appointment Time Slots */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Time Slot *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = formData.appointment_time === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setFormData({ ...formData, appointment_time: slot })}
                      className={`py-2 px-1 text-xs rounded-lg font-medium border text-center transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {formErrors.appointment_time && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.appointment_time}</p>
              )}
            </div>

            {/* Consultation Fee notice */}
            {currentDoctor && (
              <div className="bg-teal-50/70 border border-teal-200/60 rounded-xl p-3 flex items-center justify-between text-xs text-teal-900">
                <span>Standard Consultation Fee:</span>
                <span className="font-bold text-teal-800 text-sm">
                  ${currentDoctor.consultation_fee ?? currentDoctor.fee ?? 50}
                </span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-700 hover:to-teal-700 shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Slot & Booking...</span>
                  </>
                ) : (
                  <span>Confirm Appointment</span>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
