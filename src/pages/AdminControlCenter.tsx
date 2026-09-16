import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings, Users, Plus, Edit2, Clock, Trash2, Calendar } from 'lucide-react';
import { Login } from '../components/Login';

export const AdminControlCenter = () => {
  const { doctors, setDoctors, auth, setAuth } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'doctors' | 'departments' | 'shifts'>('doctors');
  
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', department: '', room: '', credentials: '' });

  const [departments] = useState([
    { id: 'DEP-1', name: 'Cardiology', head: 'Dr. Amitava Dhar', status: 'Active' },
    { id: 'DEP-2', name: 'Neurology', head: 'Dr. Ashoke Basu', status: 'Active' },
    { id: 'DEP-3', name: 'Pediatrics', head: 'Dr. Ashoke Biswas', status: 'Active' },
  ]);

  const [shifts] = useState([
    { id: 'SH-1', doctor: 'Dr. Amitava Dhar', date: '2026-09-17', shift: 'Morning (08:00 - 14:00)' },
    { id: 'SH-2', doctor: 'Dr. Sanjoy Goswami', date: '2026-09-17', shift: 'Evening (14:00 - 20:00)' },
    { id: 'SH-3', doctor: 'Dr. Ashoke Basu', date: '2026-09-18', shift: 'Night (20:00 - 08:00)' },
  ]);

  if (!auth.admin) {
    return (
      <Login 
        role="Administrator" 
        expectedId="123321" 
        expectedPassword="Sayan@1234" 
        onLogin={() => setAuth({ ...auth, admin: true })} 
      />
    );
  }

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.department) return;
    
    const doc = {
      id: `DR-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newDoctor
    };
    
    setDoctors([...doctors, doc]);
    setNewDoctor({ name: '', department: '', room: '', credentials: '' });
    setIsAddingDoctor(false);
  };

  const removeDoctor = (id: string) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Control Center</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation / Sections */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('doctors')}
            className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center ${activeTab === 'doctors' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <Users className="h-4 w-4 mr-3" />
            Doctor Directory
          </button>
          <button 
            onClick={() => setActiveTab('departments')}
            className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center ${activeTab === 'departments' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <Settings className="h-4 w-4 mr-3" />
            Department Config
          </button>
          <button 
            onClick={() => setActiveTab('shifts')}
            className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center ${activeTab === 'shifts' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <Clock className="h-4 w-4 mr-3" />
            Shift Scheduling
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {activeTab === 'doctors' && (
            <div className="bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wider flex items-center"><Users className="h-4 w-4 mr-2" /> Doctor Directory</h2>
                <button 
                  onClick={() => setIsAddingDoctor(!isAddingDoctor)}
                  className="flex items-center px-3 py-1.5 bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Doctor
                </button>
              </div>
              
              {isAddingDoctor && (
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Name</label>
                      <input required type="text" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} className="w-full border border-slate-300 px-3 py-1.5 text-sm" placeholder="Dr. John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Department</label>
                      <input required type="text" value={newDoctor.department} onChange={e => setNewDoctor({...newDoctor, department: e.target.value})} className="w-full border border-slate-300 px-3 py-1.5 text-sm" placeholder="Cardiology" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Credentials</label>
                      <input type="text" value={newDoctor.credentials} onChange={e => setNewDoctor({...newDoctor, credentials: e.target.value})} className="w-full border border-slate-300 px-3 py-1.5 text-sm" placeholder="MD, FACC" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Room</label>
                      <input type="text" value={newDoctor.room} onChange={e => setNewDoctor({...newDoctor, room: e.target.value})} className="w-full border border-slate-300 px-3 py-1.5 text-sm" placeholder="101" />
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-2">
                      <button type="button" onClick={() => setIsAddingDoctor(false)} className="px-4 py-1.5 border border-slate-300 text-sm font-medium hover:bg-slate-50">Cancel</button>
                      <button type="submit" className="px-4 py-1.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">Save</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-y-auto max-h-[600px]">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-white sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {doctors.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                          <div className="text-xs font-mono text-slate-500">{doc.id} | {doc.credentials}</div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900">{doc.department}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900">{doc.room}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-right space-x-3">
                          <button className="text-slate-400 hover:text-slate-900" title="Edit Doctor">
                            <Edit2 className="h-4 w-4 inline" />
                          </button>
                          <button onClick={() => removeDoctor(doc.id)} className="text-red-400 hover:text-red-700" title="Remove Doctor">
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wider flex items-center"><Settings className="h-4 w-4 mr-2" /> Department Configuration</h2>
                <button className="flex items-center px-3 py-1.5 bg-slate-900 text-white text-xs font-medium hover:bg-slate-800">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Dept
                </button>
              </div>
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department Head</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {departments.map(dept => (
                    <tr key={dept.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 whitespace-nowrap text-xs font-mono text-slate-500">{dept.id}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{dept.name}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900">{dept.head}</td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium bg-green-50 text-green-800 border border-green-200">{dept.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shifts' && (
            <div className="bg-white border border-slate-200">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wider flex items-center"><Clock className="h-4 w-4 mr-2" /> Shift Scheduling</h2>
                <button className="flex items-center px-3 py-1.5 bg-slate-900 text-white text-xs font-medium hover:bg-slate-800">
                  <Calendar className="h-3 w-3 mr-1" />
                  Assign Shift
                </button>
              </div>
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Shift ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {shifts.map(shift => (
                    <tr key={shift.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 whitespace-nowrap text-xs font-mono text-slate-500">{shift.id}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{shift.doctor}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900">{shift.date}</td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600">{shift.shift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
