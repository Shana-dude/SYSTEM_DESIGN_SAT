import React from 'react';
import { Users, UserCheck, CalendarCheck, CalendarX, TrendingUp, ShieldCheck } from 'lucide-react';

export default function StatsDashboard({ stats, loading, onOpenBookModal }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200/70 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors ?? 6,
      subtext: 'Specialists across disciplines',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      title: 'Available Doctors',
      value: stats?.availableDoctors ?? 6,
      subtext: 'Ready for consultations today',
      icon: UserCheck,
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-50 text-teal-700 border-teal-100',
    },
    {
      title: 'Total Appointments',
      value: stats?.totalAppointments ?? 3,
      subtext: 'All patient bookings',
      icon: CalendarCheck,
      color: 'from-brand-500 to-cyan-600',
      bgColor: 'bg-brand-50 text-brand-700 border-brand-100',
    },
    {
      title: 'Confirmed Consultations',
      value: stats?.confirmedAppointments ?? 2,
      subtext: 'Scheduled & upcoming',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{item.title}</span>
                <div className={`p-2.5 rounded-xl border ${item.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">{item.value}</span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Active
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{item.subtext}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
