import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import TerapiaCorporativa from './components/TerapiaCorporativa';
import ProjetoEscola from './components/ProjetoEscola';

import MeuAtendimento from './components/MeuAtendimento';
import Credenciais from './components/Credenciais';
import Depoimentos from './components/Depoimentos';
import OQueETrg from './components/OQueETrg';
import Faq from './components/Faq';
import Frases from './components/Frases';
import Fobias from './components/Fobias';

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
import { PatientRegistration } from './components/therapist/PatientRegistration';
import { Messages as TherapistMessages } from './components/therapist/Messages';
import { DocumentGeneration } from './components/therapist/DocumentGeneration';
import { Profile as TherapistProfile } from './components/therapist/Profile';
import { TdahResults } from './components/therapist/TdahResults';
import { NewClientRequests } from './components/therapist/NewClientRequests';
import { DebugRequests } from './components/therapist/DebugRequests';
import { TestRequestForm } from './components/TestRequestForm';
import DirectApiForm from './components/DirectApiForm';
import PublicApiForm from './components/PublicApiForm';
import DirectRestApiForm from './components/DirectRestApiForm';

// Public Layout Component
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#020205] min-h-screen flex flex-col text-slate-300 font-sans">
    <Header setCurrentPage={() => { }} />
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
      <ScrollToTop />
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
              path="/teste-solicitacao"
              element={
                <PublicLayout>
                  <TestRequestForm />
                </PublicLayout>
              }
            />
            <Route
              path="/teste-api-direta"
              element={
                <PublicLayout>
                  <DirectApiForm />
                </PublicLayout>
              }
            />
            <Route
              path="/teste-api-publica"
              element={
                <PublicLayout>
                  <PublicApiForm />
                </PublicLayout>
              }
            />
            <Route
              path="/teste-api-rest"
              element={
                <PublicLayout>
                  <DirectRestApiForm />
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
              <Route path="patient-registration" element={<PatientRegistration />} />
              <Route path="messages" element={<TherapistMessages />} />
              <Route path="documents" element={<DocumentGeneration />} />
              <Route path="tdah-results" element={<TdahResults />} />
              <Route path="new-clients" element={<NewClientRequests />} />
              <Route path="debug-requests" element={<DebugRequests />} />
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