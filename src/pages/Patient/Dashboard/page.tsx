import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Stack,
    Divider,
    Button,
    Avatar,
    Chip,
    Paper
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    CalendarToday,
    HistoryEdu,
    ReceiptLong,
    Medication,
    ArrowForward,
    NotificationsActive,
    HealthAndSafety,
    Api
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// --- Types ---
interface DashboardStats {
    nextAppointment: string | null;
    totalRecords: number;
    pendingInvoices: number;
    
}
const fakeAppointments = [
    { id: 1, doctor: "Dr. Nguyen Van A", date: "2025-12-20", status: "DONE" },
        { id: 2, doctor: "Dr. Le Thi B", date: "2026-01-15", status: "SCHEDULED" },
]
export default function PatientDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats>({
        nextAppointment: "2026-01-15 09:00",
        totalRecords: 12,
        pendingInvoices: 1
        
    });
    const [recentAppointments, setRecentAppointments] = useState(fakeAppointments);

    // Giả lập dữ liệu các cuộc hẹn gần đây
    useEffect(()=>{
        const accessToken = localStorage.getItem("accessToken");
        apiCall("patient/dashboard","GET",accessToken?accessToken:"",null,(data:any)=>{
            let tempStats = stats;
            if(data.data.nextAppointment==null){
                tempStats.nextAppointment="No appointment yet";

            }
            else {
                tempStats.nextAppointment=`${data.data.nextAppointment.appointmentDate} ${data.data.nextAppointment.appointmentTime}`;
            }
            tempStats.pendingInvoices=data.data.pendingInvoicesAmount;
            tempStats.totalRecords=data.data.medicalRecordsAmount;
            if(data.data.recentAppointments==null) setRecentAppointments([]);
            setRecentAppointments(data.data.recentAppointments);
            setStats(tempStats);
        },(data:any)=>{
            alert(data.message);
            
        })
    },[])

    return (
        <Box sx={{
            padding: { xs: '20px', md: '30px 40px' },
            height: '100vh',
            overflowY: 'auto',
            bgcolor: '#f8fafc' // Nền nhạt đồng bộ
        }}>
            {/* Header Chào mừng */}
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" fontWeight="800" color="#1e293b">
                        Welcome back, Binh!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Stay updated with your health and medical schedules.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<CalendarToday />}
                    onClick={() => navigate('/patient/book_appointment')}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 'bold', px: 3 }}
                >
                    Book New Appointment
                </Button>
            </Box>

            {/* Chỉ số nhanh (Metric Cards) */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <PatientStatCard 
                        title="Next Appointment"
                        value={stats.nextAppointment ?stats.nextAppointment=="No appointment yet"?"No appointment yet":dayjs(stats.nextAppointment).format('DD/MM/YYYY') : "None"}
                        icon={<NotificationsActive color="primary" />}
                        subValue={stats.nextAppointment ?stats.nextAppointment=="No appointment yet"?"No appointment yet": dayjs(stats.nextAppointment).format('HH:mm A') : ""}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <PatientStatCard 
                        title="Medical Records"
                        value={stats.totalRecords}
                        icon={<HistoryEdu sx={{ color: '#10b981' }} />}
                        subValue="Total visits"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <PatientStatCard 
                        title="Pending Invoices"
                        value={stats.pendingInvoices}
                        icon={<ReceiptLong sx={{ color: '#f59e0b' }} />}
                        subValue="Waiting for payment"
                        warning={stats.pendingInvoices > 0}
                    />
                </Grid>
                
            </Grid>

            {/* Nội dung chính */}
            <Grid container spacing={3}>
                {/* Lịch hẹn gần đây */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card sx={{ borderRadius: '16px', p: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>My Recent Appointments</Typography>
                        <Stack spacing={2}>
                            {recentAppointments.map((app) => (
                                <Paper 
                                    key={app.id} 
                                    variant="outlined" 
                                    sx={{ p: 2, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <Box display="flex" gap={2} alignItems="center">
                                        <Avatar sx={{ bgcolor: '#eff6ff' }}>
                                            <HealthAndSafety color="primary" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="bold">{app.doctor}</Typography>
                                            <Typography variant="caption" color="text.secondary">{dayjs(app.date).format('MMMM DD, YYYY')}</Typography>
                                        </Box>
                                    </Box>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Chip 
                                            label={app.status} 
                                            size="small" 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                bgcolor: app.status === 'DONE' ? '#dcfce7' : '#eff6ff',
                                                color: app.status === 'DONE' ? '#15803d' : '#1d4ed8'
                                            }} 
                                        />
                                        <IconButton size="small" onClick={() => navigate(`/patient/appointment/${app.id}`)}>
                                            <ArrowForward fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                        <Button fullWidth sx={{ mt: 2, textTransform: 'none' }} onClick={() => navigate('/patient/appointments')}>
                            View all appointments
                        </Button>
                    </Card>
                </Grid>

                {/* Thông báo/Mẹo sức khỏe */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card sx={{ 
                        borderRadius: '16px', 
                        p: 3, 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)' 
                    }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Health Tip of the Day</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                            "Drinking enough water and getting 8 hours of sleep can significantly boost your immune system during seasonal changes."
                        </Typography>
                        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 2 }} />
                        <Typography variant="subtitle2" fontWeight="bold">Stay Safe!</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>Last updated: Today, 10:00 AM</Typography>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

// --- Sub-component thẻ thống kê ---
function PatientStatCard({ title, value, icon, subValue, warning }: any) {
    return (
        <Card sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: 'none',
            bgcolor: warning ? '#fffbeb' : 'white' // Đổi màu nhẹ nếu có cảnh báo (như hóa đơn chưa thanh toán)
        }}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                        {title}
                    </Typography>
                    <Typography variant="h5" fontWeight="800" sx={{ my: 0.5, color: '#1e293b' }}>
                        {value}
                    </Typography>
                    <Typography variant="caption" color={warning ? "error.main" : "text.secondary"}>
                        {subValue}
                    </Typography>
                </Box>
                <Box sx={{ 
                    bgcolor: warning ? '#fef3c7' : '#f1f5f9', 
                    p: 1.5, 
                    borderRadius: '12px', 
                    height: 'fit-content' 
                }}>
                    {icon}
                </Box>
            </Stack>
        </Card>
    );
}

import { IconButton } from '@mui/material';
import { apiCall } from '../../../api/api';
