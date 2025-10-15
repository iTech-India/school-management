import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SetPassword from './pages/auth/SetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import ChangePassword from './pages/auth/ChangePassword';
import Dashboard from './pages/Dashboard';
import { UserRole } from './types';
import { queryClient } from './lib/queryClient';

// Admin Pages
import Teachers from './pages/admin/Teachers';
import Students from './pages/admin/Students';
import Classes from './pages/admin/Classes';
import Subjects from './pages/admin/Subjects';
import Attendance from './pages/admin/Attendance';
import TeacherAssignments from './pages/admin/TeacherAssignments';

// Teacher Pages
import MarkAttendance from './pages/teacher/MarkAttendance';
import MyClasses from './pages/teacher/MyClasses';
import MyStudents from './pages/teacher/MyStudents';

// Student Pages
import MyAttendance from './pages/student/MyAttendance';

// Universal Profile (works for both Teacher and Student)
import Profile from './pages/Profile';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/change-password" element={<ChangePassword />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/teachers"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Layout>
                  <Teachers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Layout>
                  <Students />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Layout>
                  <Classes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Layout>
                  <Subjects />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Layout>
                  <Attendance />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-assignments"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <Layout>
                  <TeacherAssignments />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/my-classes"
            element={
              <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                <Layout>
                  <MyClasses />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-students"
            element={
              <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                <Layout>
                  <MyStudents />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mark-attendance"
            element={
              <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
                <Layout>
                  <MarkAttendance />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={[UserRole.TEACHER, UserRole.STUDENT]}>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/my-attendance"
            element={
              <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                <Layout>
                  <MyAttendance />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

