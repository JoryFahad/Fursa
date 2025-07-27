import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/homepages/HomePage';
import AllInternshipsPage from './pages/internship/AllInternshipsPage';
import CompanyInternshipStatusPage from './pages/company/CompanyInternshipStatusPage';
import LoginPage from './pages/Authentication/LoginPage';
import SignupPage from './pages/Authentication/SignupPage';
import StatusPage from './pages/student/StatusPage';
import SettingsPage from './pages/settings/SettingsPage';
import CompanyProfileSetUpPage from './pages/Authentication/CompanyProfileSetUpPage';
import StudentProfileSetupPage from './pages/Authentication/StudentProfileSetupPage';
import CreateInternship from './pages/internship/CreateInternship';
import EditInternship from './pages/internship/EditInternship';
import InternshipDetail from './pages/internship/InternshipDetail';
import InternshipApplicantsPage from './pages/internship/InternshipApplicantsPage';
import ApplicantDetailPage from './pages/internship/ApplicantDetailPage';
import ApplyInternshipForm from './pages/internship/ApplyInternshipForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Provider } from './components/ui/provider';

// Root Route component
const RootRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  // Show the landing page for non-logged-in users
  return <HomePage />;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Provider>
        <Router>
          <div className="app min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">"
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<RootRoute />} />

              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* Use only the new student profile setup page */}
              <Route path="/setup-student-profile" element={<StudentProfileSetupPage />} />
              <Route path="/setup-company-profile" element={<CompanyProfileSetUpPage />} />

              {/* Protected routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard redirects - redirect to appropriate pages based on user type */}
              <Route path="/dashboard" element={<Navigate to="/home" replace />} />
              
              {/* Companies page redirect - currently not implemented */}
              <Route path="/companies" element={<Navigate to="/internships" replace />} />
              
              {/* Internship-related redirects for common URLs */}
              <Route path="/internship" element={<Navigate to="/internships" replace />} />
              <Route path="/jobs" element={<Navigate to="/internships" replace />} />
              <Route path="/job" element={<Navigate to="/internships" replace />} />
              <Route path="/post-job" element={<Navigate to="/create-internship" replace />} />
              
              {/* Application status redirects */}
              <Route path="/my-applications" element={<Navigate to="/status" replace />} />
              <Route path="/applications" element={<Navigate to="/status" replace />} />
              <Route path="/internship-status" element={<Navigate to="/company-internship-status" replace />} />

              <Route
                path="/status"
                element={
                  <ProtectedRoute>
                    <StatusPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/company-dashboard"
                element={<Navigate to="/company-internship-status" replace />}
              />

              <Route
                path="/create-internship"
                element={
                  <ProtectedRoute>
                    <CreateInternship />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/internship/:id"
                element={
                  <ProtectedRoute>
                    <InternshipDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-internship"
                element={
                  <ProtectedRoute>
                    <CreateInternship />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internships"
                element={
                  <ProtectedRoute>
                    <AllInternshipsPage />
                  </ProtectedRoute>
                }
              />              <Route
                path="/apply/:internshipId"
                element={
                  <ProtectedRoute>
                    <ApplyInternshipForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internships/apply/:internshipId"
                element={
                  <ProtectedRoute>
                    <ApplyInternshipForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company-internship-status"
                element={
                  <ProtectedRoute>
                    <CompanyInternshipStatusPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-internship/:id"
                element={
                  <ProtectedRoute>
                    <EditInternship />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internship/:internshipId/applicants"
                element={
                  <ProtectedRoute>
                    <InternshipApplicantsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internship/application/:applicationId"
                element={
                  <ProtectedRoute>
                    <ApplicantDetailPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ToastContainer />
            <Footer />
          </div>
        </Router>
      </Provider>
    </AuthProvider>
  );
}

export default App;


