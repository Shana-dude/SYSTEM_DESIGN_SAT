import React from 'react';
import { HeartPulse, Github, Heart, Shield, Award } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Summary */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">Medi<span className="text-brand-600">Care</span></span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              MediCare is a beginner-friendly doctor appointment and clinical scheduling platform designed to streamline healthcare consultations, bookings, and digital prescription tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Developed for System Design SAT Examination</span>
            </div>
          </div>

          {/* Navigation Shortcuts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-brand-600 transition-colors">
                  Overview & Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('doctors')} className="hover:text-brand-600 transition-colors">
                  Find Specialists
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('appointments')} className="hover:text-brand-600 transition-colors">
                  Manage Appointments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('prescriptions')} className="hover:text-brand-600 transition-colors">
                  Digital Prescriptions
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Author Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Project Credit</h4>
            <div className="text-xs sm:text-sm text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-900">Rakshana M.</p>
              <p className="text-xs text-slate-500">Artificial Intelligence & Data Science</p>
              <p className="text-xs text-slate-500">Sri Eshwar College of Engineering</p>
              <div className="pt-2">
                <a
                  href="https://github.com/Shana-dude/SYSTEM_DESIGN_SAT"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-2.5 py-1.5 rounded-lg border border-brand-100 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 MediCare – Doctor Appointment System. Demonstration use only.</p>
          <p className="flex items-center gap-1 text-[11px] text-slate-600">
            Fictional doctor & patient data only • Not for clinical emergencies
          </p>
        </div>
      </div>
    </footer>
  );
}
