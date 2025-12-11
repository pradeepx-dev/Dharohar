import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import Applications from './pages/Applications';
import About from './pages/About';
import Login from './pages/Login';
import AddProject from './pages/AddProject';
import EditProject from './pages/EditProject';
import ProjectDetails from './pages/ProjectDetails';
import UserProfile from './pages/UserProfile';
import CategoryProjects from './pages/CategoryProjects';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary-500 selection:text-white transition-colors duration-300">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Navigate to="/applications" replace />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/category/:categoryName" element={<CategoryProjects />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                <Route 
                  path="/add-project" 
                  element={
                    <ProtectedRoute>
                      <AddProject />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit-project/:id" 
                  element={
                    <ProtectedRoute>
                      <EditProject />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } 
                />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/applications" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;