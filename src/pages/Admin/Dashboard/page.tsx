import { Box, Card, Typography, Stack, Divider } from "@mui/material";
import Grid from "@mui/material/Grid"; // Sử dụng Grid v2 để tránh lỗi lệch margin
import { People } from "@mui/icons-material";
import { Calendar, DollarSign, TrendingUp, LayoutDashboard } from "lucide-react";
import AppointmentStatistics from "./AppointmentStatistics";
import PatientVisitReport from "./PatientVisitReport";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../../api/api";
import { Button } from "@mui/material";

export default function AdminDashboard() {
    const [statisticData, setStatisticData] = useState({
        appointment: 0,
        staff: 0,
        income: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        apiCall("admin/statistic", "GET", accessToken ? accessToken : "", null, (data: any) => {
            setStatisticData({
                appointment: data.data.todayAppointment,
                staff: data.data.staffToday,
                income: data.data.thisMothIncome
            });
        }, (data: any) => {
            alert(data.message);
            navigate("/admin");
        })
    }, [navigate])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    return (
        <Box sx={{
            padding: { xs: '20px', md: '30px 40px' },
            height: '100vh',
            overflowY: 'auto',
            bgcolor: '#f8fafc' // Nền xám nhạt để nổi bật các Card trắng
        }}>
            {/* Header Area */}
            <Box mb={4} display="flex" alignItems="center" gap={1.5}>
                <LayoutDashboard size={28} color="var(--color-primary-main)" />
                <Box>
                    <Typography variant="h4" fontWeight="800" color="#1e293b">
                        Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back! Here is your clinic's performance overview.
                    </Typography>
                </Box>
            </Box>

            {/* Statistics Cards Row */}
            <Grid container spacing={3} mb={4}>
                {/* Today's Appointments */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Today's Appointments"
                        value={statisticData.appointment}
                        subValue="+8 from yesterday"
                        icon={<Calendar size={24} color="#3b82f6" />}
                        trend="+12%"
                    />
                </Grid>

                {/* Active Staff */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Active Staff"
                        value={statisticData.staff}
                        subValue="On duty today"
                        icon={<People sx={{ fontSize: 28, color: "#10b981" }} />}
                    />
                </Grid>

                {/* Monthly Revenue */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <StatCard
                        title="Monthly Revenue"
                        value={`${formatCurrency(statisticData.income)} VND`}
                        subValue="+12% this month"
                        icon={<DollarSign size={24} color="#f59e0b" />}
                        isRevenue
                    />
                </Grid>
            </Grid>

            {/* Charts Area */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card sx={{
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        border: "1px solid #e2e8f0",
                        height: '100%'
                    }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Appointment Trends
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <AppointmentStatistics />
                    </Card>
                </Grid>

                {/* Bạn có thể thêm một component nhỏ ở cột 4 (lg: 4) bên phải biểu đồ */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card sx={{
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        border: "1px solid #e2e8f0",
                        bgcolor: 'primary.main',
                        color: 'white'
                    }}>
                        <Typography variant="h6" fontWeight="bold">Quick Action</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1, mb: 3 }}>
                            Manage your staff schedules and service prices easily.
                        </Typography>
                        <Stack spacing={1}>
                            <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f1f5f9' }, textTransform: 'none', borderRadius: '8px' }} onClick={(e) => {
                                navigate("/admin/patients")
                            }}>
                                View Patients
                            </Button>
                            <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', textTransform: 'none', borderRadius: '8px' }} onClick={(e) => {
                                navigate("/admin/services");
                            }}>
                                View Services
                            </Button>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>

            {/* Patient Visit Report Section */}
            <Box mt={4}>
                <PatientVisitReport />
            </Box>
        </Box>
    )
}

// Sub-component để giữ code sạch sẽ
function StatCard({ title, value, subValue, icon, trend, isRevenue }: any) {
    return (
        <Card sx={{
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography color="text.secondary" variant="body2" fontWeight="600" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', my: 1 }}>
                        {value}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        {trend && <TrendingUp size={14} color="#10b981" />}
                        <Typography variant="caption" color={trend || isRevenue ? "success.main" : "text.secondary"} fontWeight="600">
                            {subValue}
                        </Typography>
                    </Stack>
                </Box>
                <Box sx={{
                    bgcolor: '#f1f5f9',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </Box>
            </Stack>
        </Card>
    );
}
