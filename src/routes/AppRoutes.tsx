import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/page";
import LandingPage from "../pages/LandingPage/page";
import DashboardLayout from "../layouts/DashboardLayout";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { useAuth } from "../auth/AuthContext";

// Các trang
import AdminDashboard from "../pages/Admin/Dashboard/page";
import PatientList from "../pages/SharedPages/PatientList/page";
import CreatePatient from "../pages/SharedPages/CreatePatient/page";

import DoctorDashboard from "../pages/Doctor/Dashboard/page";
import PatientQueue from "../pages/Doctor/PatientQueue/page";
import MedicalExamination from "../pages/Doctor/MedicalExam/page";
import DoctorManagement from "../pages/Admin/Staff/Doctor/page";

import ReceptionistDashboard from "../pages/Receptionist/Dashboard/page";

/*
import PatientPage from "../pages/Patient/crud/PatientPage";
import NotFound from "../pages/Patient/crud/NotFound";
import PatientDetail from "../pages/Patient/crud/PatientDetail";
import CreatePatient from "../pages/Patient/crud/CreatePatient";
import UpdatePatient from "../pages/Patient/crud/UpdatePatient";

import WarehouseStaffDashboard from "../pages/WarehouseStaff/WarehouseStaffDashboard";
import PatientDashboard from "../pages/Patient/PatientDashboard";
*/
export default function AppRoutes() {
  const { role } = useAuth();

  return (
    <Routes>
      
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allow="Admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="staffs/doctors" element={<DoctorManagement />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="create-patient" element= {<CreatePatient/>}/>
      </Route>

      {/* Doctor */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allow="Doctor">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="patient-queue" element={<PatientQueue />} />
        <Route path="medical-examination" element={<MedicalExamination />} />
      </Route>

      {/* Receptionist */}
      <Route
        path="/receptionist"
        element={
          <ProtectedRoute allow="Receptionist">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ReceptionistDashboard />} />
        <Route path="patients" element={<PatientList />} />
      </Route>

      {/* WarehouseStaff */}
      <Route
        path="/warehouse-staff"
        element={
          <ProtectedRoute allow="WarehouseStaff">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
      </Route>

      {/* Patient */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allow="Patient">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
      </Route>

      {/* Redirect fallback */}
      <Route
        path="*"
        element={
          role ? (
            role === "Admin" ? (
              <Navigate to="/admin" replace />
            ) : role === "Doctor" ? (
              <Navigate to="/doctor" replace />
            ) : role === "Receptionist" ? (
              <Navigate to="/receptionist" replace />
            ) : role === "WarehouseStaff" ? (
              <Navigate to="/warehouse-staff" replace />
            ) : (
              <Navigate to="/patient" replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      {/*
      <Route path="/not_found" element={<NotFound/>}/>
      
      <Route path="/test/list_patient" element= {<PatientPage/>}/>
      <Route path="/test/create_patient" element= {<CreatePatient/>}/>
      <Route path="/test/patient_detail/:id" element={<PatientDetail/>}/>
      <Route path="/test/update_patient/:id" element={<UpdatePatient/>}/>
      */}
    </Routes>
  );
}
