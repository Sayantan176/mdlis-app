import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { PatientPortal } from './pages/PatientPortal';
import { DoctorWorkbench } from './pages/DoctorWorkbench';
import { DispensaryDashboard } from './pages/DispensaryDashboard';
import { AdminControlCenter } from './pages/AdminControlCenter';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="patient" element={<PatientPortal />} />
            <Route path="doctor" element={<DoctorWorkbench />} />
            <Route path="dispensary" element={<DispensaryDashboard />} />
            <Route path="admin" element={<AdminControlCenter />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
