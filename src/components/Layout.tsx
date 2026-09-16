import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Stethoscope, UserCircle, Pill, Shield, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Layout = () => {
  const location = useLocation();
  const { auth, setAuth } = useAppContext();

  const handleLogout = () => {
    setAuth({ patient: false, doctor: false, dispensary: false, admin: false });
  };

  const isLoggedIn = auth.patient || auth.doctor || auth.dispensary || auth.admin;

  const navItems = [
    { path: '/patient', label: 'Patient Portal', icon: UserCircle },
    { path: '/doctor', label: 'Doctor Workbench', icon: Stethoscope },
    { path: '/dispensary', label: 'Dispensary', icon: Pill },
    { path: '/admin', label: 'Admin Center', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <Activity className="h-8 w-8 text-slate-900" />
                  <span className="ml-2 text-xl font-bold text-slate-900 tracking-tight">MDLIS</span>
                </Link>
              </div>
              <nav className="ml-8 hidden sm:flex sm:space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-slate-900 text-slate-900'
                          : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center">
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
