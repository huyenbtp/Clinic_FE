import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  IconButton,
  TextField,
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutline,
  VisibilityOutlined,
  SaveOutlined,
  CloseRounded
} from '@mui/icons-material';
import { apiCall } from '../../../../api/api';
import { useParams } from 'react-router-dom';

// --- MOCK HOOKS AND DATA ---


// Giả lập navigate hook
const useNavigate = () => (path) => console.log('NAVIGATING TO:', path);

// Mock Database/API call
const MOCK_SERVICES = [
  { serviceId: '9', serviceName: "Khám nhi", unitPrice: 150000.00 },
  { serviceId: '10', serviceName: "Xét nghiệm máu tổng quát", unitPrice: 300000.00 },
  { serviceId: '11', serviceName: "Xét nghiệm nước tiểu", unitPrice: 80000.00 },
];

/**
 * Hàm mô phỏng việc gọi API để lấy chi tiết dịch vụ
 */



/**
 * Hàm định dạng tiền tệ Việt Nam Đồng
 */
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// --- MAIN COMPONENT ---

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ serviceName: '', unitPrice: '' });
  const [error, setError] = useState(null);
  const fetchServiceDetail = async (id:string) => {
  const url =`unsecure/service/${id}`;
  let data=null;
  await apiCall(url,"GET",null,null,(response:any)=>{
    data=response.data;
  },(response:any)=>{
    alert(response.message);
    navigate("/admin/services");
    return null;
  });
  console.log(data);
  return data;
};
  
  useEffect(() => {
    const loadService = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchServiceDetail(serviceId?serviceId:'1');
        setService(data);
        setFormData({
            serviceName: data.serviceName,
            unitPrice: data.unitPrice.toString(), // Chuyển số sang chuỗi để dùng trong TextField
        });
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceId) {
      console.log(serviceId);
      loadService();
    }
  }, [serviceId]);

  
  const handleEditToggle = () => {
    if (isEditing) {
        // Reset form data nếu hủy bỏ
        setFormData({
            serviceName: service.serviceName,
            unitPrice: service.unitPrice.toString(),
        });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Logic Save data (Mô phỏng)
    const url="unsecure/service/update/"+serviceId;
   
    apiCall(url,"POST",localStorage.getItem("accessToken"),JSON.stringify({
      serviceName: formData.serviceName,
      unitPrice: ""+parseFloat(formData.unitPrice)
    }),()=>{
      setService(prev => ({
        ...prev,
        serviceName: formData.serviceName,
        unitPrice: parseFloat(formData.unitPrice),
    }));
    setIsEditing(false);
    },(response:any)=>{
      alert(response.message);
      navigate("admin/services");
    })
    
  };

  const handleDelete = () => {
    // Trong ứng dụng thực tế, bạn sẽ hiển thị modal xác nhận trước khi xóa
    if (window.confirm(`Do you want to delete service with ID ${serviceId} ?`)) {
        console.log('DELETING Service ID:', serviceId);
        const url ="unsecure/service/delete/"+serviceId;
        apiCall(url,"DELETE",null,null,(response:any)=>{
          alert(response.message);
          navigate('/admin/services'); 
        },(response:any)=>{
          alert(response.message);
        })
         
    }
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="300px"
        sx={{ bgcolor: 'white', borderRadius: 3, p: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Đang tải chi tiết dịch vụ...</Typography>
      </Box>
    );
  }

  if (error || !service) {
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#f0f4f8' }}>
        <Typography color="error" variant="h6">Lỗi tải dữ liệu</Typography>
        <Typography variant="body1">Service ID: {serviceId}</Typography>
        <Typography variant="body2">Chi tiết lỗi: {error}</Typography>
      </Paper>
    );
  }

  // Content for the detail page
  return (
    <Box 
      sx={{
        // Bắt chước style container của bảng cũ: nền trắng, bo góc, bóng nhẹ
        bgcolor: 'white',
        borderRadius: 3,
        p: { xs: 2, sm: 4, md: 6 },
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        minHeight: '60vh',
      }}
    >
      {/* HEADER VÀ ACTION BUTTONS */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4} 
        pb={2}
        sx={{ borderBottom: '1px solid #eee' }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
          Chi tiết Dịch vụ #{service.serviceId}
        </Typography>
        
        <Box>
            {isEditing ? (
                // MODE CHỈNH SỬA
                <>
                    <Button
                        variant="contained"
                        startIcon={<SaveOutlined />}
                        onClick={handleSave}
                        sx={{ 
                            mr: 2, 
                            textTransform: 'none',
                            bgcolor: 'var(--color-primary-main)',
                            '&:hover': { bgcolor: 'var(--color-primary-dark)' }
                        }}
                    >
                        Lưu
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CloseRounded />}
                        onClick={handleEditToggle}
                        sx={{ 
                            textTransform: 'none',
                            color: '#555',
                            borderColor: '#ccc',
                            '&:hover': { borderColor: '#aaa' }
                        }}
                    >
                        Hủy
                    </Button>
                </>
            ) : (
                // MODE XEM CHI TIẾT
                <>
                    {/* Nút Sửa */}
                    <IconButton
                        onClick={handleEditToggle}
                        title="Chỉnh sửa dịch vụ"
                        sx={{
                            color: 'var(--color-text-info)', // Màu xanh dương
                            border: '1px solid var(--color-primary-main)',
                            borderRadius: 1.2,
                            height: 40,
                            width: 40,
                            mr: 1,
                        }}
                    >
                        <EditOutlined sx={{ fontSize: 22 }} />
                    </IconButton>

                    {/* Nút Xóa */}
                    <IconButton
                        onClick={handleDelete}
                        title="Xóa dịch vụ"
                        sx={{
                            color: 'white',
                            bgcolor: 'var(--color-error-secondary)', // Màu đỏ
                            '&:hover': {
                                bgcolor: 'var(--color-text-error)',
                            },
                            borderRadius: 1.2,
                            height: 40,
                            width: 40,
                        }}
                    >
                        <DeleteOutline sx={{ fontSize: 22 }} />
                    </IconButton>
                </>
            )}
        </Box>
      </Box>

      {/* THÔNG TIN CHI TIẾT */}
      <Box sx={{ mt: 3, maxWidth: 800 }}>
        {/* Trường ID */}
        <DetailField label="ID Dịch vụ" value={service.serviceId} isEditing={false} />

        {/* Trường Tên Dịch vụ */}
        <DetailField 
            label="Tên Dịch vụ" 
            value={isEditing ? formData.serviceName : service.serviceName}
            isEditing={isEditing}
            name="serviceName"
            onChange={handleInputChange}
        />

        {/* Trường Giá Đơn vị */}
        <DetailField 
            label="Giá Đơn vị" 
            value={isEditing ? formData.unitPrice : formatCurrency(service.unitPrice)}
            isEditing={isEditing}
            name="unitPrice"
            onChange={handleInputChange}
            type="number"
            inputProps={isEditing ? { inputMode: 'numeric', pattern: '[0-9]*' } : {}}
            // Hiển thị đơn vị VND khi không chỉnh sửa
            displayValue={isEditing ? undefined : formatCurrency(service.unitPrice)}
        />
      </Box>

      {/* FOOTER: Nút Back (tùy chọn) */}
      <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #eee' }}>
        <Button 
            variant="text" 
            onClick={() => navigate('/services')} 
            sx={{ textTransform: 'none', color: 'var(--color-text-secondary)' }}
        >
            &lt; Quay lại danh sách dịch vụ
        </Button>
      </Box>
    </Box>
  );
};

// --- SUB COMPONENT CHO FIELD CHI TIẾT ---

/**
 * Component hiển thị một trường thông tin chi tiết
 */
const DetailField = ({ label,value, isEditing, name, onChange, type = 'text', inputProps, displayValue }) => (
    <Box sx={{ mb: 3 }}>
        <Typography 
            variant="caption"
            display="block" 
            gutterBottom 
            sx={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', mb: 0.5 }}
        >
            {label}
        </Typography>
        
        {isEditing ? (
            <TextField
                fullWidth
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                inputProps={inputProps}
                size="small"
                variant="outlined"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        bgcolor: '#f9f9f9', // Nền hơi xám khi edit
                    }
                }}
            />
        ) : (
            <Paper 
                variant="outlined" 
                sx={{ 
                    p: 1.5, 
                    bgcolor: '#f5f7f9', // Nền xám nhạt cho chế độ xem
                    borderColor: '#eee', 
                    borderRadius: 1.5 
                }}
            >
                <Typography 
                    variant="body1" 
                    sx={{ color: '#333', fontWeight: 'medium' }}
                >
                    {displayValue || value}
                </Typography>
            </Paper>
        )}
    </Box>
);

export default ServiceDetailPage;