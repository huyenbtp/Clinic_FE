import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type Role } from '../../auth/AuthContext';

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    if (!selectedRole) {
      alert('Vui lòng chọn vai trò trước khi đăng nhập!');
      return;
    }

    login(selectedRole);

    // ✅ Điều hướng theo role
    switch (selectedRole) {
      case 'Admin':
        navigate('/admin');
        break;
      case 'Doctor':
        navigate('/doctor');
        break;
      case 'Receptionist':
        navigate('/receptionist');
        break;
      case 'WarehouseStaff':
        navigate('/warehouse-staff');
        break;
      case 'Patient':
        navigate('/patient');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80 text-center">
        <h1 className="text-2xl font-semibold mb-4">Đăng nhập</h1>

        <select
          className="border rounded-md px-3 py-2 w-full mb-4"
          value={selectedRole ?? ''}
          onChange={(e) => setSelectedRole(e.target.value as Role)}
        >
          <option value="">-- Chọn vai trò --</option>
          <option value="Admin">Admin</option>
          <option value="Doctor">Bác sĩ</option>
          <option value="Receptionist">Lễ tân</option>
          <option value="WarehouseStaff">Thủ kho / Cấp phát thuốc</option>
          <option value="Patient">Bệnh nhân</option>
        </select>

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white py-2 rounded-md w-full hover:bg-blue-600 transition"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
