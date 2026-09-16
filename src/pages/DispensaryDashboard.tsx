import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, AlertCircle, Download, Plus, Trash2 } from 'lucide-react';
import { Login } from '../components/Login';

export const DispensaryDashboard = () => {
  const { medications, setMedications, auth, setAuth } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', strength: '', batch: '', quantity: 0, expiry: '' });

  if (!auth.dispensary) {
    return (
      <Login 
        role="Dispensary" 
        expectedId="676767" 
        expectedPassword="Kamya@1234" 
        onLogin={() => setAuth({ ...auth, dispensary: true })} 
      />
    );
  }

  const stats = {
    total: medications.length,
    lowStock: medications.filter(m => m.status === 'Low Stock').length,
    outOfStock: medications.filter(m => m.status === 'Out of Stock').length,
  };

  const filteredMeds = medications.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDispense = (id: string) => {
    setMedications(medications.map(m => {
      if (m.id === id) {
        const newQuantity = Math.max(0, m.quantity - 10);
        let newStatus = 'Sufficient';
        if (newQuantity === 0) newStatus = 'Out of Stock';
        else if (newQuantity < 250) newStatus = 'Low Stock';
        return { ...m, quantity: newQuantity, status: newStatus };
      }
      return m;
    }));
  };

  const handleRemove = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.strength) return;

    let status = 'Sufficient';
    if (newMed.quantity === 0) status = 'Out of Stock';
    else if (newMed.quantity < 250) status = 'Low Stock';

    const addedMed = {
      id: `MED-${Math.floor(100 + Math.random() * 900)}`,
      name: newMed.name,
      strength: newMed.strength,
      batch: newMed.batch,
      quantity: newMed.quantity,
      expiry: newMed.expiry,
      status
    };

    setMedications([...medications, addedMed]);
    setNewMed({ name: '', strength: '', batch: '', quantity: 0, expiry: '' });
    setIsAddingMed(false);
  };

  const handleExportStock = async () => {
    try {
      // In production (Render), the API is on the same host. In local dev, it's on port 5000.
      const apiUrl = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/export-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications })
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stock_audit_report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert('Error exporting stock report. Ensure the Python backend is running.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Dispensary Dashboard</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsAddingMed(!isAddingMed)}
            className="flex items-center px-3 py-1.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Medicine
          </button>
          <button 
            onClick={handleExportStock}
            className="flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium bg-white hover:bg-slate-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Stock Audit
          </button>
        </div>
      </div>

      {isAddingMed && (
        <div className="bg-white p-4 border border-slate-200">
          <h2 className="text-sm font-medium text-slate-900 mb-3">Add New Stock</h2>
          <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Medicine Name</label>
              <input required type="text" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} className="w-full border border-slate-300 px-3 py-1.5 text-sm" placeholder="e.g. Paracetamol" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Strength</label>
              <input required type="text" value={newMed.strength} onChange={e => setNewMed({...newMed, strength: e.target.value})} className="w-full border border-slate-300 px-3 py-1.5 text-sm" placeholder="e.g. 500mg" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Batch No.</label>
              <input required type="text" value={newMed.batch} onChange={e => setNewMed({...newMed, batch: e.target.value})} className="w-full border border-slate-300 px-3 py-1.5 text-sm" placeholder="e.g. B123" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Quantity</label>
              <input required type="number" min="0" value={newMed.quantity} onChange={e => setNewMed({...newMed, quantity: parseInt(e.target.value)})} className="w-full border border-slate-300 px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Expiry Date</label>
              <input required type="date" value={newMed.expiry} onChange={e => setNewMed({...newMed, expiry: e.target.value})} className="w-full border border-slate-300 px-3 py-1.5 text-sm" />
            </div>
            <div className="md:col-span-6 flex justify-end">
              <button type="submit" className="px-4 py-1.5 bg-slate-900 text-white text-sm font-medium">Add to Inventory</button>
            </div>
          </form>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total SKUs</div>
            <div className="text-2xl font-semibold text-slate-900 mt-1">{stats.total}</div>
          </div>
          <Package className="h-8 w-8 text-slate-300" />
        </div>
        <div className="bg-white p-4 border border-amber-200 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-amber-700 uppercase tracking-wide">Low Stock</div>
            <div className="text-2xl font-semibold text-amber-900 mt-1">{stats.lowStock}</div>
          </div>
          <AlertCircle className="h-8 w-8 text-amber-200" />
        </div>
        <div className="bg-white p-4 border border-red-200 border-l-4 border-l-red-500 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-red-700 uppercase tracking-wide">Out of Stock</div>
            <div className="text-2xl font-semibold text-red-900 mt-1">{stats.outOfStock}</div>
          </div>
          <AlertCircle className="h-8 w-8 text-red-200" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Central Inventory</h2>
          <div className="w-64">
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 px-3 py-1.5 text-sm focus:ring-0 focus:border-slate-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Medicine / ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Strength</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Batch & Expiry</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Qty on Hand</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredMeds.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{med.name}</div>
                    <div className="text-xs font-mono text-slate-500">{med.id}</div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-900">{med.strength}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{med.batch}</div>
                    <div className="text-xs text-slate-500">Exp: {med.expiry}</div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-mono text-slate-900 text-right">
                    {med.quantity}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium ${
                      med.status === 'Sufficient' ? 'bg-green-50 text-green-800 border border-green-200' :
                      med.status === 'Low Stock' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {med.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button 
                      onClick={() => handleDispense(med.id)}
                      disabled={med.quantity === 0}
                      className="text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Dispense 10 units"
                    >
                      Dispense
                    </button>
                    <button 
                      onClick={() => handleRemove(med.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove medicine entirely"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
