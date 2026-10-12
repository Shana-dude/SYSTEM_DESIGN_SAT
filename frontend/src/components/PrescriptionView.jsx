import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Pill, 
  AlertTriangle, 
  Printer, 
  Stethoscope, 
  Calendar, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  Info,
  Loader2
} from 'lucide-react';
import { getPrescription, getAllPrescriptions } from '../services/api';

export default function PrescriptionView() {
  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('demo');
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all sample prescriptions on load
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await getAllPrescriptions();
        if (res.data && res.data.length > 0) {
          setPrescriptionsList(res.data);
          setSelectedPatientId(res.data[0].patient_id);
          setCurrentPrescription(res.data[0]);
        } else {
          // Fallback to demo
          const single = await getPrescription('demo');
          setCurrentPrescription(single.data);
        }
      } catch (err) {
        console.error('Error loading prescriptions:', err);
        setError('Unable to load prescription records.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When patient selection changes
  const handleSelectPatient = async (patientId) => {
    setSelectedPatientId(patientId);
    setLoading(true);
    try {
      const res = await getPrescription(patientId);
      setCurrentPrescription(res.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Prescription not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Disclaimer Banner - REQUIRED BY PROMPT */}
      <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900 tracking-wide uppercase">
            ⚠️ Demonstration Prescription Notice
          </h4>
          <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
            This digital prescription is generated for demonstration and educational testing purposes only. 
            It is <strong>NOT a genuine medical prescription</strong> and must not be used to acquire medications or make healthcare decisions.
          </p>
        </div>
      </div>

      {/* Selector & Actions Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
            Select Sample Record:
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => handleSelectPatient(e.target.value)}
            className="w-full sm:w-64 px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            {prescriptionsList.map((item) => (
              <option key={item.id} value={item.patient_id}>
                {item.patient_name} ({item.patient_id})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shadow-2xs"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Print / Save Demo Prescription</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-3xl p-16 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-sm font-medium">Loading clinical prescription record...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 text-sm">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Prescription Document Card */}
      {currentPrescription && !loading && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all print:border-none print:shadow-none">
          
          {/* Prescription Header */}
          <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-teal-700 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">MediCare Multi-Speciality Clinic</h2>
                    <p className="text-xs text-white/80 font-medium">Digital Outpatient Consultation & Prescription</p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-white/80 space-y-0.5">
                <p className="font-semibold text-white">License: MED-DEMO-2026</p>
                <p>128 Healthcare Boulevard, Suite 400</p>
                <p>Phone: +1 800-MEDICARE</p>
              </div>
            </div>
          </div>

          {/* Doctor & Patient Metadata Row */}
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/90 rounded-2xl p-5 border border-slate-100 text-xs sm:text-sm">
              <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-200/70 pb-3 md:pb-0 md:pr-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Prescribing Physician</span>
                <p className="text-base font-extrabold text-slate-900">{currentPrescription.doctor_name || 'Dr. Medical Specialist'}</p>
                <p className="text-teal-700 font-semibold">{currentPrescription.doctor_specialization || 'Clinical Medicine'}</p>
                {currentPrescription.doctor_email && (
                  <p className="text-slate-500 text-xs">{currentPrescription.doctor_email}</p>
                )}
              </div>

              <div className="space-y-1.5 md:pl-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Patient Information</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-base">{currentPrescription.patient_name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 font-semibold">
                    ID: {currentPrescription.patient_id}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 text-xs mt-1">
                  <span><strong>Date:</strong> {currentPrescription.consultation_date}</span>
                  <span><strong>Rx No:</strong> #{currentPrescription.id * 1042}</span>
                </div>
              </div>
            </div>

            {/* Diagnosis Section */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Clinical Diagnosis / Clinical Findings
              </span>
              <div className="p-3.5 bg-brand-50/60 border border-brand-100 rounded-xl text-slate-800 font-semibold text-sm">
                🩺 {currentPrescription.diagnosis}
              </div>
            </div>

            {/* Rx Prescribed Medicines Table */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-600 text-white font-serif font-black flex items-center justify-center text-xs">
                  Rx
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Prescribed Medications & Dosages
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100/80 text-slate-700 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Medicine & Strength</th>
                      <th className="py-3 px-4">Dosage / Frequency</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Array.isArray(currentPrescription.medicines) && currentPrescription.medicines.length > 0 ? (
                      currentPrescription.medicines.map((med, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{med.name}</span>
                            <span className="text-xs text-brand-600 font-medium">{med.dosage}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{med.frequency}</td>
                          <td className="py-3 px-4 text-slate-600">{med.duration}</td>
                          <td className="py-3 px-4 text-slate-600 text-xs italic">{med.instructions}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-4 text-center text-slate-400">
                          No medication items recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Special Instructions & Advice */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                General Instructions & Patient Advice
              </span>
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentPrescription.instructions}
              </div>
            </div>

            {/* Signature & Authentication Section */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="text-[11px] text-slate-600 space-y-1">
                <p>• Digitally signed via MediCare Clinical Information System.</p>
                <p>• Verification Hash: <code className="text-brand-700">MD-77B-{currentPrescription.id}-VERIFIED</code></p>
                <p>• Emergency Helpline: 911 / Local Emergency Medical Services</p>
              </div>

              <div className="text-center min-w-[200px]">
                <div className="h-12 flex items-center justify-center">
                  <span className="font-serif italic text-brand-700 text-lg font-bold">
                    {currentPrescription.doctor_name || 'Dr. Jenkins'}
                  </span>
                </div>
                <div className="border-t border-slate-300 pt-1 text-xs text-slate-600 font-semibold">
                  Authorized Medical Officer Signature
                </div>
              </div>
            </div>

            {/* Final Demo Watermark Banner */}
            <div className="mt-4 p-2 bg-slate-100 rounded-lg text-center text-[11px] text-slate-500 uppercase tracking-widest font-bold">
              [ SAMPLE RECORD — FOR EDUCATIONAL & DEMONSTRATION USE ONLY ]
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
