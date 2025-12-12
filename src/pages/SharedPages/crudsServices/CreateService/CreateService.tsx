import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    useTheme,
    CircularProgress,
    Alert,
    Snackbar,
    Divider
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../../../api/api';





const ServiceCreateForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    // 1. State quản lý dữ liệu form
    const [formData, setFormData] = useState({
        serviceName: '',
        unitPrice: '',
    });
    
    // 2. State quản lý UI và API
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Xử lý thay đổi input
    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý gửi form
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Đảm bảo dữ liệu đầu vào hợp lệ
        if (!formData.serviceName || isNaN(parseFloat(formData.unitPrice))) {
            setError('Please enter service name and price must be number');
            return;
        }

        setIsLoading(true);

        
        const requestBody = {
            serviceName: formData.serviceName,
            unitPrice: parseFloat(formData.unitPrice) // Đảm bảo gửi dưới dạng số
        };

        apiCall(
            'unsecure/service/create', // Endpoint tạo mới dịch vụ
            'POST', 
            null,
            JSON.stringify(requestBody),
            (data:any) => {
                
                setIsLoading(false);
                setSuccessMessage(data.message || data.message);
                setFormData({ serviceName: '', unitPrice: '' }); // Reset form
                navigate("/admin/services");
               
            },
            (err:any) => {
                
                setIsLoading(false);
                setError(err.message);
            }
        );
    };

    
    const handleBack = () => {
        navigate('/admin/services');
    };

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: { xs: '20px 20px', sm: '26px 50px' },
                height: '100%',
                overflow: 'auto',
                bgcolor: theme.palette.background.default,
            }}
        >
            {/* HEADER */}
            <Box 
                display="flex"
                alignItems="center"
                mx={{ xs: 0, sm: 4 }} 
                mb={3}
            >
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={handleBack}
                    sx={{ mr: 2, textTransform: 'none' }}
                >
                    Back
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Create new Service
                </Typography>
            </Box>

            {/* MAIN FORM CARD */}
            <Box flex={1} p={{ xs: 0, sm: '6px' }} minHeight="calc(100% - 70px)">
                <Card 
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        padding: { xs: '16px', sm: '32px 48px' },
                        borderRadius: 2,
                        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.05)", 
                    }}
                >
                    <Typography variant="h6" color="primary" mb={3}>
                        Service information
                    </Typography>
                    <Divider sx={{ mb: 4 }}/>

                    <Box display="grid" gap={3} sx={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        
                        {/* Tên Dịch Vụ */}
                        <TextField
                            label="Service Name"
                            name="serviceName"
                            value={formData.serviceName}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />

                        {/* Giá Đơn Vị */}
                        <TextField
                            label="Unit Price (VNĐ)"
                            name="unitPrice"
                            value={formData.unitPrice}
                            onChange={handleChange}
                            type="number"
                            inputProps={{ step: "0.01", min: "0" }}
                            fullWidth
                            required
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                        
                        {/* Bạn có thể thêm các trường khác tại đây, ví dụ: Mô tả */}
                        {/* <TextField
                            label="Mô Tả Dịch Vụ"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            sx={{ gridColumn: '1 / -1' }} // Chiếm hết chiều rộng
                        /> */}

                    </Box>

                    {/* Footer / Buttons */}
                    <Box mt={5} display="flex" justifyContent="flex-end" gap={2}>
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={isLoading}
                                sx={{ py: 1.5, px: 4, textTransform: 'none', borderRadius: 1 }}
                            >
                                Save
                            </Button>
                        )}
                    </Box>
                    
                </Card>
            </Box>

            {/* Snackbar và Alert cho thông báo */}
            {error && (
                <Alert severity="error" sx={{ mt: 3, mx: 4 }}>
                    Error: {error}
                </Alert>
            )}
            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSuccessMessage(null)} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default ServiceCreateForm;