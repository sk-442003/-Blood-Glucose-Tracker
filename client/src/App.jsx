import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import PatientDashboard from './pages/PatientDashboard';
import { AddReadingPage, ReadingHistoryPage } from './pages/ReadingPages';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import DoctorDashboard from './pages/DoctorDashboard';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute role="patient" />}>
        <Route element={<AppLayout role="patient" />}>
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/readings" element={<ReadingHistoryPage />} />
          <Route path="/readings/new" element={<AddReadingPage />} />
          <Route path="/readings/:id/edit" element={<AddReadingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="doctor" />}>
        <Route element={<AppLayout role="doctor" />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
