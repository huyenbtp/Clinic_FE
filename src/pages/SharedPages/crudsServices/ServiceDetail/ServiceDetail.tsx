import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    IconButton,
    TextField,
    Divider,
    Stack
} from '@mui/material';
import {
    EditOutlined,
    DeleteOutline,
    SaveOutlined,
    CloseRounded,
    ArrowBack
} from '@mui/icons-material';
import { apiCall } from '../../../../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import AlertDialog from '../../crudsReceptionList/ReceptionList/Alert'; // Đảm bảo đường dẫn này chính xác

// Interface cho Service
interface Service {
    serviceId: number;
    serviceName: string;
    unitPrice: number;
}

const ServiceDetailPage = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ serviceName: '', unitPrice: '' });
    const [error, setError] = useState<string | null>(null);

    // States cho Dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [resultDialog, setResultDialog] = useState({
        open: false,
        title: '',
        type: 'info' as 'error' | 'warning' | 'info' | 'success'
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const fetchServiceDetail = async (id: string) => {
        const url = `unsecure/service/${id}`;
        apiCall(url, "GET", null, null, (response: any) => {
            const data = response.data;
            setService(data);
            setFormData({
                serviceName: data.serviceName,
                unitPrice: data.unitPrice.toString(),
            });
            setIsLoading(false);
        }, (response: any) => {
            setResultDialog({ open: true, title: response.message || "Failed to load data", type: "error" });
            setTimeout(() => navigate("/admin/services"), 2000);
        });
    };

    useEffect(() => {
        if (serviceId) {
            fetchServiceDetail(serviceId);
        }
    }, [serviceId]);

    const handleEditToggle = () => {
        if (isEditing && service) {
            setFormData({
                serviceName: service.serviceName,
                unitPrice: service.unitPrice.toString(),
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const url = `unsecure/service/update/${serviceId}`;
        const payload = {
            serviceName: formData.serviceName,
            unitPrice: parseFloat(formData.unitPrice)
        };

        apiCall(url, "POST", localStorage.getItem("accessToken"), JSON.stringify(payload), (response: any) => {
            setService(prev => prev ? {
                ...prev,
                serviceName: formData.serviceName,
                unitPrice: parseFloat(formData.unitPrice),
            } : null);
            setIsEditing(false);
            setResultDialog({ open: true, title: "Service updated successfully", type: "success" });
        }, (response: any) => {
            setResultDialog({ open: true, title: response.message || "Update failed", type: "error" });
        });
    };

    const onConfirmDelete = () => {
        const url = `unsecure/service/delete/${serviceId}`;
        apiCall(url, "DELETE", null, null, (response: any) => {
            // Sau khi xóa thành công, navigate về trang trước đó
            navigate(-1); 
        }, (response: any) => {
            setResultDialog({ open: true, title: response.message || "Delete failed", type: "error" });
        });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>Loading service details...</Typography>
            </Box>
        );
    }

    if (error || !service) {
        return (
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#f0f4f8' }}>
                <Typography color="error" variant="h6">Data load error</Typography>
                <Typography variant="body1">Service ID: {serviceId}</Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ bgcolor: 'white', borderRadius: 3, p: { xs: 2, sm: 4, md: 6 }, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: '60vh' }}>
            {/* HEADER AND ACTIONS */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} pb={2} sx={{ borderBottom: '1px solid #eee' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Service Details #{service.serviceId}
                </Typography>
                
                <Stack direction="row" spacing={1}>
                    {isEditing ? (
                        <>
                            <Button variant="contained" startIcon={<SaveOutlined />} onClick={handleSave}
                                sx={{ textTransform: 'none', bgcolor: 'var(--color-primary-main)' }}>
                                Save
                            </Button>
                            <Button variant="outlined" startIcon={<CloseRounded />} onClick={handleEditToggle}
                                sx={{ textTransform: 'none', color: '#555', borderColor: '#ccc' }}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <IconButton onClick={handleEditToggle} title="Edit Service"
                                sx={{ color: 'var(--color-text-info)', border: '1px solid var(--color-primary-main)', borderRadius: 1.2 }}>
                                <EditOutlined fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => setIsDeleteDialogOpen(true)} title="Delete Service"
                                sx={{ color: 'white', bgcolor: 'var(--color-error-secondary)', '&:hover': { bgcolor: 'var(--color-text-error)' }, borderRadius: 1.2 }}>
                                <DeleteOutline fontSize="small" />
                            </IconButton>
                        </>
                    )}
                </Stack>
            </Box>

            {/* FORM FIELDS */}
            <Box sx={{ mt: 3, maxWidth: 800 }}>
                <DetailField label="Service ID" value={service.serviceId.toString()} isEditing={false} />
                <DetailField label="Service Name" value={isEditing ? formData.serviceName : service.serviceName}
                    isEditing={isEditing} name="serviceName" onChange={handleInputChange} />
                <DetailField label="Unit Price" value={isEditing ? formData.unitPrice : formatCurrency(service.unitPrice)}
                    isEditing={isEditing} name="unitPrice" onChange={handleInputChange} type="number"
                    displayValue={isEditing ? undefined : formatCurrency(service.unitPrice)} />
            </Box>

            {/* FOOTER */}
            <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #eee' }}>
                <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} 
                    sx={{ textTransform: 'none', color: 'var(--color-text-secondary)' }}>
                    Back to previous page
                </Button>
            </Box>

            {/* DIALOGS */}
            <AlertDialog
                open={isDeleteDialogOpen}
                setOpen={setIsDeleteDialogOpen}
                title="Delete Service"
                description={`Are you sure you want to delete service #${serviceId}? This action cannot be undone.`}
                type="warning"
                buttonCancel="Cancel"
                buttonConfirm="Delete Now"
                onConfirm={onConfirmDelete}
            />

            <AlertDialog
                open={resultDialog.open}
                setOpen={(val) => setResultDialog(prev => ({ ...prev, open: val }))}
                title={resultDialog.title}
                type={resultDialog.type}
                buttonConfirm="Close"
                onConfirm={() => {}}
            />
        </Box>
    );
};

interface DetailFieldProps {
    label: string;
    value: string;
    isEditing: boolean;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    displayValue?: string;
}

const DetailField = ({ label, value, isEditing, name, onChange, type = 'text', displayValue }: DetailFieldProps) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', mb: 0.5 }}>
            {label.toUpperCase()}
        </Typography>
        {isEditing ? (
            <TextField fullWidth name={name} value={value} onChange={onChange} type={type} size="small" variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, bgcolor: '#f9f9f9' } }} />
        ) : (
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#f5f7f9', borderColor: '#eee', borderRadius: 1.5 }}>
                <Typography variant="body1" sx={{ color: '#333', fontWeight: 'medium' }}>
                    {displayValue || value}
                </Typography>
            </Paper>
        )}
    </Box>
);

export default ServiceDetailPage;