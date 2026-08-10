import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Faculty from './pages/Faculty';
import Salary from './pages/Salary';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Exams from './pages/Exams';
import Timetable from './pages/Timetable';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return null;
  
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
            <Route path="/faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
            <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/fees" element={<ProtectedRoute><Fees /></ProtectedRoute>} />
            <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
            <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
