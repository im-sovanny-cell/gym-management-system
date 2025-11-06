// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/layouts/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SystemLayout from "./components/layouts/SystemLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Users from "./pages/users/Users";
import UserEdit from "./pages/users/UserEdit";
import AttendanceScan from "./pages/attendances/AttendanceScan";
import UserCreate from "./pages/Users/UserCreate";
import Trainers from "./pages/trainers/Trainers";
import TrainerCreate from "./pages/trainers/TrainerCreate";
import TrainerEdit from "./pages/trainers/TrainerEdit";
import Gyms from "./pages/gyms/Gyms";
import GymCreate from "./pages/gyms/GymCreate";
import GymEdit from "./pages/gyms/GymEdit";
// imports at top
import Memberships from "./pages/memberships/Memberships.jsx";
import MembershipCreate from "./pages/memberships/MembershipCreate.jsx";
import MembershipEdit from "./pages/memberships/MembershipEdit.jsx";
// in src/App.jsx (only the new routes chunk)
import Classes from "./pages/classes/Classes";
import ClassCreate from "./pages/classes/ClassCreate";
import ClassEdit from "./pages/classes/ClassEdit";

import PaymentCreate from "./pages/payments/PaymentCreate.jsx";
import Payments from "./pages/payments/Payments.jsx";
import PaymentEdit from "./pages/payments/PaymentEdit";
import PaymentQR from "./pages/payments/PaymentQR";


function AppContent() {
  const { user, loading } = useAuth();

  // បើ loading → បង្ហាញ loading screen (មិន redirect)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl font-medium text-gray-700 animate-pulse">
          Loading Gym System...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <DashboardHome />
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      {/* PAYMENT QR PAGE */}
      <Route
        path="/payments/:id/qr"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <PaymentQR />
            </SystemLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <Payments />
            </SystemLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/create"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <PaymentCreate />
            </SystemLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/:id"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <PaymentEdit />
            </SystemLayout>
          </ProtectedRoute>
        }
      />



      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <Classes />
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/classes/create"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <ClassCreate />
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/classes/:id"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <ClassEdit />
            </SystemLayout>
          </ProtectedRoute>
        }
      />


      {/* MEMBERSHIPS ROUTES */}
      <Route
        path="/memberships"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <Memberships />
            </SystemLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/memberships/create"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <MembershipCreate />
            </SystemLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/memberships/:id"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <MembershipEdit />
            </SystemLayout>
          </ProtectedRoute>
        }
      />



      <Route path="/gyms" element={<ProtectedRoute><SystemLayout><Gyms /></SystemLayout></ProtectedRoute>} />
      <Route path="/gyms/create" element={<ProtectedRoute><SystemLayout><GymCreate /></SystemLayout></ProtectedRoute>} />
      <Route path="/gyms/:id" element={<ProtectedRoute><SystemLayout><GymEdit /></SystemLayout></ProtectedRoute>} />


      <Route
        path="/trainers"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <Trainers />
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainers/create"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <TrainerCreate />
            </SystemLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/trainers/:id"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <TrainerEdit />
            </SystemLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <Users />
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <UserEdit />
            </SystemLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/create"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <UserCreate />
            </SystemLayout>
          </ProtectedRoute>
        }
      />


      <Route
        path="/gyms"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <div className="p-6 text-center text-gray-600">Gyms Page (Coming Soon)</div>
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainers"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <div className="p-6 text-center text-gray-600">Trainers Page (Coming Soon)</div>
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/memberships"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <div className="p-6 text-center text-gray-600">Memberships Page (Coming Soon)</div>
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <div className="p-6 text-center text-gray-600">Payments Page (Coming Soon)</div>
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <div className="p-6 text-center text-gray-600">Classes Page (Coming Soon)</div>
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendances"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <AttendanceScan />
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/payrolls"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <div className="p-6 text-center text-gray-600">Payrolls Page (Coming Soon)</div>
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/telegram"
        element={
          <ProtectedRoute>
            <SystemLayout>
              <div className="p-6 text-center text-gray-600">Telegram Page (Coming Soon)</div>
            </SystemLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}