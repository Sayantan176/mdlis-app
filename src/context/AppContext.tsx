import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockPatients, mockDoctors, mockMedications, mockTests, mockAppointments } from '../data/mockData';

type AppContextType = {
  patients: typeof mockPatients;
  doctors: typeof mockDoctors;
  medications: typeof mockMedications;
  tests: typeof mockTests;
  appointments: typeof mockAppointments;
  setPatients: React.Dispatch<React.SetStateAction<typeof mockPatients>>;
  setDoctors: React.Dispatch<React.SetStateAction<typeof mockDoctors>>;
  setMedications: React.Dispatch<React.SetStateAction<typeof mockMedications>>;
  setAppointments: React.Dispatch<React.SetStateAction<typeof mockAppointments>>;
  auth: { patient: boolean; doctor: boolean; dispensary: boolean; admin: boolean };
  setAuth: React.Dispatch<React.SetStateAction<{ patient: boolean; doctor: boolean; dispensary: boolean; admin: boolean }>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState(mockPatients);
  const [doctors, setDoctors] = useState(mockDoctors);
  const [medications, setMedications] = useState(mockMedications);
  const [tests, setTests] = useState(mockTests);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [auth, setAuth] = useState({
    patient: false,
    doctor: false,
    dispensary: false,
    admin: false
  });

  return (
    <AppContext.Provider value={{
      patients, doctors, medications, tests, appointments,
      setPatients, setDoctors, setMedications, setAppointments,
      auth, setAuth
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
