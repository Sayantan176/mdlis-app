import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, FileText, Activity, TestTube, ChevronRight } from 'lucide-react';
import { Login } from '../components/Login';

export const DoctorWorkbench = () => {
  const { doctors, patients, appointments, tests, medications, setAppointments, auth, setAuth } = useAppContext();
  
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);

  if (!auth.doctor) {
    return (
      <Login 
        role="Doctor" 
        expectedId="182005" 
        expectedPassword="Sayantan@2005" 
        onLogin={() => setAuth({ ...auth, doctor: true })} 
      />
    );
  }

  // Assume logged in as the first doctor
  const currentDoctor = doctors[0];
  
  const todayAppointments = appointments.filter(a => a.doctorId === currentDoctor.id && a.date === '2026-09-16');
  
  const selectedPatient = selectedAppointment 
    ? patients.find(p => p.id === selectedAppointment.patientId) 
    : null;

  const handleUpdateStatus = (status: string) => {
    if (!selectedAppointment) return;
    const updated = appointments.map(a => a.id === selectedAppointment.id ? { ...a, status } : a);
    setAppointments(updated);
    setSelectedAppointment({ ...selectedAppointment, status });
  };

  const handlePrescribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Prescription added to encounter notes.');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      
      {/* Patient Queue */}
      <div className="w-full md:w-1/3 bg-white border border-slate-200 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wider flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Today's Queue ({todayAppointments.length})
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {todayAppointments.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">No patients in queue today.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {todayAppointments.map((app) => {
                const p = patients.find(pat => pat.id === app.patientId);
                const isSelected = selectedAppointment?.id === app.id;
                return (
                  <li key={app.id}>
                    <button 
                      onClick={() => setSelectedAppointment(app)}
                      className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex justify-between items-center ${isSelected ? 'bg-slate-50 border-l-4 border-slate-900' : 'border-l-4 border-transparent'}`}
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900">{p?.name}</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
                          <span>{app.time}</span>
                          <span>&bull;</span>
                          <span className="font-mono">{p?.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-0.5 rounded-sm mr-3 ${
                          app.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 
                          app.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 
                          'bg-green-50 border border-green-200 text-green-800'
                        }`}>
                          {app.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 bg-white border border-slate-200 flex flex-col h-full">
        {selectedPatient && selectedAppointment ? (
          <>
            <div className="p-6 border-b border-slate-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-medium text-slate-900">{selectedPatient.name}</h2>
                <div className="text-sm text-slate-500 mt-1 space-x-4">
                  <span className="font-mono">{selectedPatient.id}</span>
                  <span>{selectedPatient.age}yo {selectedPatient.gender}</span>
                  <span className="text-red-600 font-medium">{selectedPatient.bloodGroup}</span>
                </div>
              </div>
              <div className="space-x-2">
                {selectedAppointment.status !== 'In Progress' && (
                  <button onClick={() => handleUpdateStatus('In Progress')} className="px-3 py-1.5 border border-slate-300 text-sm font-medium hover:bg-slate-50">
                    Start Encounter
                  </button>
                )}
                {selectedAppointment.status === 'In Progress' && (
                  <button onClick={() => handleUpdateStatus('Completed')} className="px-3 py-1.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
                    Complete Encounter
                  </button>
                )}
              </div>
            </div>

            <div key={selectedAppointment.id} className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clinical Notes */}
                <div className="bg-white p-4 border border-slate-200">
                  <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-slate-500" />
                    Clinical Notes
                  </h3>
                  <textarea 
                    className="w-full h-32 border border-slate-300 p-2 text-sm focus:ring-0 focus:border-slate-500"
                    placeholder="Enter observation, diagnosis, and plan..."
                  />
                </div>

                {/* Patient History */}
                <div className="bg-white p-4 border border-slate-200">
                  <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-slate-500" />
                    Medical History
                  </h3>
                  <div className="text-sm text-slate-700 bg-slate-50 p-3 border border-slate-100">
                    {selectedPatient.history || 'No significant past history recorded.'}
                  </div>
                </div>
              </div>

              {/* Order & Prescribe */}
              <div className="bg-white p-4 border border-slate-200">
                <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center">
                  <TestTube className="h-4 w-4 mr-2 text-slate-500" />
                  Prescribe & Order Tests
                </h3>
                
                <form onSubmit={handlePrescribe} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Medication</label>
                      <select className="block w-full border border-slate-300 rounded-none px-3 py-2 text-sm" required>
                        <option value="">Select Medicine...</option>
                        {medications.map(m => <option key={m.id} value={m.id}>{m.name} {m.strength}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Frequency</label>
                      <input type="text" placeholder="e.g. 1-0-1" className="block w-full border border-slate-300 rounded-none px-3 py-2 text-sm" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Duration</label>
                      <input type="text" placeholder="e.g. 5 days" className="block w-full border border-slate-300 rounded-none px-3 py-2 text-sm" required />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <div className="flex space-x-2">
                      <select className="border border-slate-300 text-sm py-1.5 px-3">
                        <option value="">Order Diagnostic Test...</option>
                        {tests.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <button type="button" className="px-3 py-1.5 border border-slate-300 text-sm font-medium hover:bg-slate-50">
                        Add Test
                      </button>
                    </div>
                    <button type="submit" className="px-4 py-1.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
                      Add to Plan
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Users className="h-12 w-12 mb-4 text-slate-200" />
            <p>Select a patient from the queue to begin consultation</p>
          </div>
        )}
      </div>
    </div>
  );
};
