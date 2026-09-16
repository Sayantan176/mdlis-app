import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, UserCircle, Stethoscope, Pill, Shield, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  const portals = [
    {
      title: 'Patient Portal',
      description: 'Book appointments, view medical history, and manage your personal health records.',
      icon: UserCircle,
      path: '/patient',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      title: 'Doctor Workbench',
      description: 'Manage daily queues, record clinical notes, prescribe medications, and order tests.',
      icon: Stethoscope,
      path: '/doctor',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      title: 'Dispensary Dashboard',
      description: 'Centralized inventory control, stock audits, and real-time medicine dispensing.',
      icon: Pill,
      path: '/dispensary',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    {
      title: 'Admin Control Center',
      description: 'Manage hospital staff, configure departments, and assign doctor duty shifts.',
      icon: Shield,
      path: '/admin',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Section */}
      <div className="bg-white border border-slate-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
        <Activity className="h-16 w-16 text-slate-900 mb-6" />
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Welcome to MDLIS
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          The integrated Medilab and Drugstore Information System. Select your operational portal below to securely access health records, manage inventory, and coordinate clinical care.
        </p>
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portals.map((portal) => {
          const Icon = portal.icon;
          return (
            <Link 
              key={portal.path} 
              to={portal.path}
              className="group bg-white border border-slate-200 p-6 flex flex-col hover:border-slate-400 transition-colors"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 ${portal.bg} ${portal.color} border ${portal.border}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                  {portal.title}
                </h2>
              </div>
              <p className="text-sm text-slate-600 flex-1 mb-6">
                {portal.description}
              </p>
              <div className="flex items-center text-sm font-medium text-slate-900 group-hover:underline">
                Access Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-slate-500 border-t border-slate-200 pt-8">
        &copy; {new Date().getFullYear()} Medilab Systems. Secure Enterprise Healthcare.
      </div>
    </div>
  );
};
