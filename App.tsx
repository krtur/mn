import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import TerapiaCorporativa from './components/TerapiaCorporativa';
import ProjetoEscola from './components/ProjetoEscola';
import TerapiaBaixoCusto from './components/TerapiaBaixoCusto';
import MeuAtendimento from './components/MeuAtendimento';
import Credenciais from './components/Credenciais';
import Depoimentos from './components/Depoimentos';
import OQueETrg from './components/OQueETrg';
import Faq from './components/Faq';
import Frases from './components/Frases';
import Fobias from './components/Fobias';
import Ebooks from './components/Ebooks';
import Chatbot from './components/Chatbot';

// Auth Components
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

// Dashboard Components
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardRedirect } from './components/dashboard/DashboardRedirect';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { Appointments } from './components/patient/Appointments';
import { Messages as PatientMessages } from './components/patient/Messages';
import { TestShop } from './components/patient/TestShop';
import { TdahScreening } from './components/patient/TdahScreening';
import { Profile as PatientProfile } from './components/patient/Profile';

import { TherapistDashboard } from './components/therapist/TherapistDashboard';
import { Schedule } from './components/therapist/Schedule';
import { ScheduleManager } from './components/therapist/ScheduleManager';
import { PatientList } from './components/therapist/PatientList';
import { Messages as TherapistMessages } from './components/therapist/Messages';
import { DocumentGeneration } from './components/therapist/DocumentGeneration';
import { Profile as TherapistProfile } from './components/therapist/Profile';
import { TdahResults } from './components/therapist/TdahResults';

// Public Layout Component
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-screen flex flex-col text-slate-800 font-sans">
    <Header setCurrentPage={() => {}} />
    <main className="flex-grow flex items-center justify-center p-4">
      {children}
    </main>
    <Footer />
    <Chatbot />
  </div>
);

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HeroSection />
                </PublicLayout>
              }
            />
            <Route
              path="/terapia-corporativa"
              element={
                <PublicLayout>
                  <TerapiaCorporativa />
                </PublicLayout>
              }
            />
            <Route
              path="/projeto-escola"
              element={
                <PublicLayout>
                  <ProjetoEscola />
                </PublicLayout>
              }
            />
            <Route
              path="/terapia-baixo-custo"
              element={
                <PublicLayout>
                  <TerapiaBaixoCusto />
                </PublicLayout>
              }
            />
            <Route
              path="/meu-atendimento"
              element={
                <PublicLayout>
                  <MeuAtendimento />
                </PublicLayout>
              }
            />
            <Route
              path="/credenciais"
              element={
                <PublicLayout>
                  <Credenciais />
                </PublicLayout>
              }
            />
            <Route
              path="/depoimentos"
              element={
                <PublicLayout>
                  <Depoimentos />
                </PublicLayout>
              }
            />
            <Route
              path="/o-que-e-trg"
              element={
                <PublicLayout>
                  <OQueETrg />
                </PublicLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <PublicLayout>
                  <Faq />
                </PublicLayout>
              }
            />
            <Route
              path="/frases"
              element={
                <PublicLayout>
                  <Frases />
                </PublicLayout>
              }
            />
            <Route
              path="/fobias"
              element={
                <PublicLayout>
                  <Fobias />
                </PublicLayout>
              }
            />
            <Route
              path="/ebooks"
              element={
                <PublicLayout>
                  <Ebooks />
                </PublicLayout>
              }
            />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard Routes */}
            {/* Rota raiz que redireciona para o dashboard correto */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* Dashboard do Paciente */}
            <Route
              path="/dashboard/patient"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="" element={<PatientDashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="messages" element={<PatientMessages />} />
              <Route path="test-shop" element={<TestShop />} />
              <Route path="tdah-screening" element={<TdahScreening />} />
              <Route path="profile" element={<PatientProfile />} />
            </Route>

            {/* Dashboard do Terapeuta */}
            <Route
              path="/dashboard/therapist"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="" element={<TherapistDashboard />} />
              <Route path="schedule" element={<ScheduleManager />} />
              <Route path="patients" element={<PatientList />} />
              <Route path="messages" element={<TherapistMessages />} />
              <Route path="documents" element={<DocumentGeneration />} />
              <Route path="tdah-results" element={<TdahResults />} />
              <Route path="profile" element={<TherapistProfile />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;