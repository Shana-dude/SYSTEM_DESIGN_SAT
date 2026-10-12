import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Stethoscope, 
  XCircle, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  DollarSign
} from 'lucide-react';

export default function AppointmentCard({ appointment, onCancelAppointment }) {
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isCancelled = appointment.status === 'Cancelled';

  const handleCancelClick = async () => {
    setCancelling(true);
    try {
      await onCancelAppointment(appointment.id);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
      isCancelled 
        ? 'border-slate-200 bg-slate-50/50 opacity-80' 
        : 'border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-200'
    }`}>
      {/* Top Bar with Status Badge */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Booking #{appointment.id}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500">
            {appointment.created_at ? new Date(appointment.created_at).toLocaleDateString() : 'Recent'}
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isCancelled
              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
          }`}
        >
          {isCancelled ? (
            <>
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              Cancelled
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Confirmed
            </>
          )}
        </span>
      </div>

      {/* Main Content */}
      <div className="p-5 space-y-4">
        
        {/* Patient and Doctor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Patient Details */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-600 font-bold block">
              Patient Details
            </span>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span className="text-sm font-bold text-slate-900">{appointment.patient_name}</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-3 pl-6">
              {appointment.patient_age && <span>{appointment.patient_age} yrs</span>}
              {appointment.patient_phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {appointment.patient_phone}
                </span>
              )}
            </div>
          </div>

          {/* Doctor Details */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-600 font-bold block">
              Practitioner
            </span>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span className="text-sm font-bold text-slate-900">{appointment.doctor_name || 'Assigned Specialist'}</span>
            </div>
            <p className="text-xs text-slate-500 pl-6">
              {appointment.doctor_specialization || 'Medical Specialist'}
            </p>
          </div>
        </div>

        {/* Schedule & Fee Details */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-brand-600" />
            <span className="font-semibold">{appointment.appointment_date}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-teal-600" />
            <span className="font-semibold">{appointment.appointment_time}</span>
          </div>

          {(appointment.consultation_fee || appointment.fee) && (
            <div className="flex items-center gap-1 text-slate-600">
              <span className="font-medium">Fee:</span>
              <span className="font-bold text-emerald-700">
                ${appointment.consultation_fee || appointment.fee}
              </span>
            </div>
          )}
        </div>

        {/* Cancellation Confirmation Box */}
        {showConfirm && !isCancelled && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
            <div className="flex items-start gap-2 text-rose-800 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>Are you sure you want to cancel this appointment slot? This action cannot be undone.</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={cancelling}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelClick}
                disabled={cancelling}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-2xs"
              >
                {cancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Yes, Cancel Slot
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Card Action Footer */}
      {!isCancelled && !showConfirm && (
        <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={() => setShowConfirm(true)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancel Appointment
          </button>
        </div>
      )}
    </div>
  );
}
