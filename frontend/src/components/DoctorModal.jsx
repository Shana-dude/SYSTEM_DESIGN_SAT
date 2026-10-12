import React from 'react';
import { X, Star, Calendar, Clock, Mail, Award, CheckCircle2, DollarSign, CalendarPlus } from 'lucide-react';

export default function DoctorModal({ doctor, onClose, onBookDoctor }) {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with decorative background */}
        <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-teal-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mt-2">
            <img
              src={doctor.image_url}
              alt={doctor.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs mb-1">
                {doctor.specialization}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">{doctor.name}</h2>
              <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                <span className="flex items-center gap-1 font-semibold text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300" />
                  {doctor.rating ? doctor.rating.toFixed(1) : '4.8'} / 5.0
                </span>
                <span>•</span>
                <span>{doctor.experience} Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* About / Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">About Practitioner</h4>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              {doctor.bio || 'Board-certified healthcare specialist dedicated to patient-centered clinical care and modern therapeutic methods.'}
            </p>
          </div>

          {/* Consultation & Schedule Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-brand-600" /> Available Days
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {doctor.available_days || 'Monday - Friday'}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-teal-600" /> Visiting Hours
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {doctor.available_hours || '09:00 AM - 05:00 PM'}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> Official Email
              </span>
              <p className="text-xs font-medium text-slate-700 mt-1 truncate">
                {doctor.contact_email || 'doctor@medicare-demo.com'}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Consultation Fee
              </span>
              <p className="text-base font-bold text-emerald-700 mt-0.5">
                ${doctor.consultation_fee ?? doctor.fee ?? 50}
              </p>
            </div>
          </div>

          {/* Verified Highlights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Qualifications & Quality</h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Certified Specialist in {doctor.specialization}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Digital Consultations & In-Person Follow-up Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Compliant with standard clinical care protocols</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookDoctor(doctor);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-700 hover:to-teal-700 rounded-xl shadow-md shadow-brand-500/20 transition-all active:scale-98"
          >
            <CalendarPlus className="w-4 h-4" />
            Proceed to Book
          </button>
        </div>
      </div>
    </div>
  );
}
