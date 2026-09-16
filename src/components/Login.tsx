import React, { useState } from 'react';
import { Shield, UserCircle, Stethoscope, Pill, Lock } from 'lucide-react';

interface LoginProps {
  role: 'Patient' | 'Doctor' | 'Dispensary' | 'Administrator';
  expectedId: string;
  expectedPassword: string;
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ role, expectedId, expectedPassword, onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === expectedId && password === expectedPassword) {
      setError('');
      onLogin();
    } else {
      setError('Invalid ID or Password. Please try again.');
    }
  };

  const Icon = role === 'Patient' ? UserCircle : 
               role === 'Doctor' ? Stethoscope : 
               role === 'Dispensary' ? Pill : Shield;

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-slate-100 p-4 rounded-full">
            <Icon className="h-10 w-10 text-slate-900" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          {role} Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-200 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {role} ID
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="block w-full appearance-none border border-slate-300 px-3 py-2 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-slate-900 sm:text-sm"
                  placeholder={`Enter ${role} ID`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none border border-slate-300 pl-10 px-3 py-2 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-slate-900 sm:text-sm"
                  placeholder="Enter Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center bg-slate-900 py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
