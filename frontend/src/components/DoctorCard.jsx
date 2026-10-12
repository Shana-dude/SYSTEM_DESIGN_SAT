import React from 'react';
import { Star, Clock, Calendar, DollarSign, Award, ChevronRight, Stethoscope } from 'lucide-react';

export default function DoctorCard({ doctor, onViewDetails, onBookDoctor }) {
  // Fallback initial avatar if image fails to load
  const initials = doctor.name
    .replace('Dr. ', '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-brand-200">
      
      {/* Top Banner & Avatar */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            {doctor.image_url ? (
              <img
                src={doctor.image_url}
                alt={doctor.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-100 group-hover:ring-brand-400 transition-all shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              style={{ display: doctor.image_url ? 'none' : 'flex' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white font-bold text-xl items-center justify-center ring-2 ring-brand-100 shadow-sm"
            >
              {initials}
            </div>
            
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Available"></span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/50">
                {doctor.specialization}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{doctor.rating ? doctor.rating.toFixed(1) : '4.8'}</span>
              </div>
            </div>

            <h3 className="mt-1.5 text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
              {doctor.name}
            </h3>

            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-brand-600" />
                {doctor.experience} yrs experience
              </span>
            </div>
          </div>
        </div>

        {/* Bio Preview */}
        <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {doctor.bio || `Specialized clinical practitioner in ${doctor.specialization} with comprehensive patient care.`}
        </p>

        {/* Availability Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="truncate">{doctor.available_days || 'Mon - Fri'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="truncate">{doctor.available_hours || '09:00 - 17:00'}</span>
          </div>
        </div>
      </div>

      {/* Footer: Fee & Action Buttons */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-600 block font-semibold">Consultation</span>
          <span className="text-lg font-extrabold text-slate-900">
            ${doctor.consultation_fee ?? doctor.fee ?? 50}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(doctor)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
          >
            Details
          </button>
          <button
            onClick={() => onBookDoctor(doctor)}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs hover:shadow transition-all active:scale-95"
          >
            Book Slot
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
