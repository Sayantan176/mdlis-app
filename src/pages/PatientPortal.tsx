import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Clock, User, HeartPulse } from 'lucide-react';
import { Login } from '../components/Login';

export const PatientPortal = () => {
  const { patients, doctors, appointments, setAppointments, setPatients, auth, setAuth } = useAppContext();
  
  // We'll simulate being logged in as the first patient for demo purposes
  const [currentUser, setCurrentUser] = useState(patients[0]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(patients[0]);
  
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  if (!auth.patient) {
    return (
      <Login 
        role="Patient" 
        expectedId="1234567" 
        expectedPassword="Sayak@1234" 
        onLogin={() => setAuth({ ...auth, patient: true })} 
      />
    );
  }

  const myAppointments = appointments.filter(a => a.patientId === currentUser.id);
  const departments = ['All', ...Array.from(new Set(doctors.map(d => d.department)))];
  const filteredDoctors = selectedDept === 'All' ? doctors : doctors.filter(d => d.department === selectedDept);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPatients = patients.map(p => p.id === currentUser.id ? editForm : p);
    setPatients(updatedPatients);
    setCurrentUser(editForm);
    setIsEditingProfile(false);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    
    const newAppointment = {
      id: `APP-${Math.floor(Math.random() * 10000)}`,
      patientId: currentUser.id,
      doctorId: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      status: 'Scheduled'
    };
    
    setAppointments([...appointments, newAppointment]);
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
    alert('Appointment booked successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Patient Portal</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Section */}
        <div className="bg-white p-6 border border-slate-200 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-slate-900">Patient Profile</h2>
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-sm text-slate-600 hover:text-slate-900 underline"
            >
              {isEditingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="mt-1 block w-full border border-slate-300 rounded-none px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Age</label>
                <input type="number" value={editForm.age} onChange={e => setEditForm({...editForm, age: parseInt(e.target.value)})} className="mt-1 block w-full border border-slate-300 rounded-none px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">History</label>
                <input type="text" value={editForm.history} onChange={e => setEditForm({...editForm, history: e.target.value})} className="mt-1 block w-full border border-slate-300 rounded-none px-3 py-2 text-sm" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-100 p-3 flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{currentUser.name}</div>
                  <div className="text-xs font-mono text-slate-500">{currentUser.id}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 uppercase">Blood Group</div>
                  <div className="flex items-center text-sm font-medium text-slate-900 mt-1">
                    <HeartPulse className="h-4 w-4 mr-1 text-red-500" />
                    {currentUser.bloodGroup}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">Age/Gender</div>
                  <div className="text-sm font-medium text-slate-900 mt-1">{currentUser.age} yrs, {currentUser.gender}</div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500 uppercase mb-1">Medical History</div>
                <div className="text-sm text-slate-900 bg-slate-50 p-2 border border-slate-200">
                  {currentUser.history || 'None'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          {/* Find a Doctor & Booking */}
          <div className="bg-white p-6 border border-slate-200">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Book Consultation</h2>
            
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Department</label>
                  <select 
                    value={selectedDept} 
                    onChange={(e) => { setSelectedDept(e.target.value); setSelectedDoctor(''); }}
                    className="block w-full border border-slate-300 rounded-none px-3 py-2 text-sm focus:border-slate-500 focus:ring-0"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Doctor</label>
                  <select 
                    value={selectedDoctor} 
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    required
                    className="block w-full border border-slate-300 rounded-none px-3 py-2 text-sm focus:border-slate-500 focus:ring-0"
                  >
                    <option value="" disabled>Select a Doctor...</option>
                    {filteredDoctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} - {doc.credentials}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full border border-slate-300 rounded-none px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Time Slot</label>
                  <select 
                    required
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="block w-full border border-slate-300 rounded-none px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Select Time...</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:15 AM">11:15 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-slate-900 text-white px-6 py-2 text-sm font-medium hover:bg-slate-800">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wider">My Consultations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Doctor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {myAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">No appointments found.</td>
                    </tr>
                  ) : myAppointments.map((app) => {
                    const doc = doctors.find(d => d.id === app.doctorId);
                    return (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                            {app.date}
                            <Clock className="h-4 w-4 ml-3 mr-1 text-slate-400" />
                            {app.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{doc?.name}</div>
                          <div className="text-xs text-slate-500">{doc?.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium ${
                            app.status === 'Completed' ? 'bg-slate-100 text-slate-800' :
                            app.status === 'In Progress' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                            'bg-green-50 text-green-800 border border-green-200'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
