import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({
  allow, children
}: {
  allow: 'Admin' | 'Doctor' | 'Receptionist' | 'WarehouseStaff' | 'Patient',
  children: JSX.Element
}) => {
  const { role } = useAuth();

  if (!role) return <Navigate to="/login" replace />;
  if (role !== allow) return (
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
  )

  return children;
};