import { useEffect, useState } from "react";
import {
    Box,
    Card,
    Typography,
    Stack,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Autocomplete,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DollarSign, TrendingUp, Calendar, Receipt, User } from "lucide-react";
import ReactECharts from 'echarts-for-react';
import { apiCall } from "../../../../api/api";

interface MonthlyRevenue {
    month: string;
    monthNumber: number;
    revenue: number;
    examinationFee: number;
    medicineFee: number;
    serviceFee: number;
    invoiceCount: number;
}

interface RevenueData {
    totalRevenue: number;
    examinationRevenue: number;
    medicineRevenue: number;
    serviceRevenue: number;
    totalInvoices: number;
    monthlyRevenue: MonthlyRevenue[];
}

interface DoctorRevenueData {
    doctorId: number;
    doctorName: string;
    totalRevenue: number;
    examinationRevenue: number;
    medicineRevenue: number;
    serviceRevenue: number;
    totalInvoices: number;
    monthlyRevenue: MonthlyRevenue[];
}

interface Doctor {
    staffId: number;
    fullName: string;
}

export default function AdminRevenueStatistics() {
    const [overallRevenue, setOverallRevenue] = useState<RevenueData | null>(null);
    const [doctorRevenue, setDoctorRevenue] = useState<DoctorRevenueData | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDoctorData, setLoadingDoctorData] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [viewMode, setViewMode] = useState<'overall' | 'doctor'>('overall');
    
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        fetchDoctors();
        fetchOverallRevenue();
    }, []);

    useEffect(() => {
        if (viewMode === 'overall') {
            fetchOverallRevenue();
        } else if (selectedDoctor) {
            fetchDoctorRevenue(selectedDoctor.staffId);
        }
    }, [selectedYear, viewMode]);

    useEffect(() => {
        if (selectedDoctor && viewMode === 'doctor') {
            fetchDoctorRevenue(selectedDoctor.staffId);
        }
    }, [selectedDoctor]);

    const fetchDoctors = () => {
        const accessToken = localStorage.getItem("accessToken");
        apiCall(
            "admin/staffs/search?page=0&size=100&role=Doctor",
            "GET",
            accessToken || "",
            null,
            (data: any) => {
                setDoctors(data.data.content || []);
            },
            (error: any) => {
                console.error("Error fetching doctors:", error);
            }
        );
    };

    const fetchOverallRevenue = () => {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        apiCall(
            `admin/revenue/monthly?year=${selectedYear}`,
            "GET",
            accessToken || "",
            null,
            (data: any) => {
                setOverallRevenue(data.data);
                setLoading(false);
            },
            (error: any) => {
                console.error("Error fetching revenue data:", error);
                setLoading(false);
            }
        );
    };

    const fetchDoctorRevenue = (doctorId: number) => {
        setLoadingDoctorData(true);
        const accessToken = localStorage.getItem("accessToken");
        apiCall(
            `admin/revenue/doctor/${doctorId}?year=${selectedYear}`,
            "GET",
            accessToken || "",
            null,
            (data: any) => {
                setDoctorRevenue(data.data);
                setLoadingDoctorData(false);
            },
            (error: any) => {
                console.error("Error fetching doctor revenue:", error);
                setLoadingDoctorData(false);
            }
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const currentData = viewMode === 'overall' ? overallRevenue : doctorRevenue;
    
    // Bar chart options for monthly revenue
    const getBarChartOption = () => {
        const months = currentData?.monthlyRevenue?.map(m => m.month) || [];
        const examinationData = currentData?.monthlyRevenue?.map(m => m.examinationFee) || [];
        const medicineData = currentData?.monthlyRevenue?.map(m => m.medicineFee) || [];
        const serviceData = currentData?.monthlyRevenue?.map(m => m.serviceFee) || [];

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: any) => {
                    let result = `${params[0].name}<br/>`;
                    params.forEach((item: any) => {
                        result += `${item.marker} ${item.seriesName}: ${formatCurrency(item.value)} VND<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['Examination', 'Medicine', 'Services'],
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: months
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (value: number) => `${(value / 1000000).toFixed(1)}M`
                }
            },
            series: [
                {
                    name: 'Examination',
                    type: 'bar',
                    stack: 'total',
                    data: examinationData,
                    itemStyle: { color: '#3b82f6' }
                },
                {
                    name: 'Medicine',
                    type: 'bar',
                    stack: 'total',
                    data: medicineData,
                    itemStyle: { color: '#10b981' }
                },
                {
                    name: 'Services',
                    type: 'bar',
                    stack: 'total',
                    data: serviceData,
                    itemStyle: { color: '#f59e0b' }
                }
            ]
        };
    };

    // Pie chart options for revenue distribution
    const getPieChartOption = () => {
        const data = [
            { value: currentData?.examinationRevenue || 0, name: 'Examination' },
            { value: currentData?.medicineRevenue || 0, name: 'Medicine' },
            { value: currentData?.serviceRevenue || 0, name: 'Services' }
        ].filter(item => item.value > 0);

        return {
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => `${params.name}: ${formatCurrency(params.value)} VND (${params.percent}%)`
            },
            legend: {
                orient: 'horizontal',
                bottom: 0
            },
            series: [
                {
                    name: 'Revenue',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {d}%'
                    },
                    data: data,
                    color: ['#3b82f6', '#10b981', '#f59e0b']
                }
            ]
        };
    };

    // Line chart options for revenue trend
    const getLineChartOption = () => {
        const months = currentData?.monthlyRevenue?.map(m => m.month) || [];
        const revenueData = currentData?.monthlyRevenue?.map(m => m.revenue) || [];
        const invoiceData = currentData?.monthlyRevenue?.map(m => m.invoiceCount) || [];

        return {
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    let result = `${params[0].name}<br/>`;
                    params.forEach((item: any) => {
                        if (item.seriesName === 'Total Revenue') {
                            result += `${item.marker} ${item.seriesName}: ${formatCurrency(item.value)} VND<br/>`;
                        } else {
                            result += `${item.marker} ${item.seriesName}: ${item.value}<br/>`;
                        }
                    });
                    return result;
                }
            },
            legend: {
                data: ['Total Revenue', 'Invoice Count'],
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: months
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Revenue',
                    axisLabel: {
                        formatter: (value: number) => `${(value / 1000000).toFixed(1)}M`
                    }
                },
                {
                    type: 'value',
                    name: 'Count',
                    position: 'right'
                }
            ],
            series: [
                {
                    name: 'Total Revenue',
                    type: 'line',
                    data: revenueData,
                    smooth: true,
                    lineStyle: { width: 3 },
                    itemStyle: { color: '#3b82f6' }
                },
                {
                    name: 'Invoice Count',
                    type: 'line',
                    yAxisIndex: 1,
                    data: invoiceData,
                    smooth: true,
                    lineStyle: { width: 2 },
                    itemStyle: { color: '#10b981' }
                }
            ]
        };
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            padding: { xs: '20px', md: '30px 40px' },
            height: '100vh',
            overflowY: 'auto',
            bgcolor: '#f8fafc'
        }}>
            {/* Header */}
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <TrendingUp size={28} color="var(--color-primary-main)" />
                    <Box>
                        <Typography variant="h4" fontWeight="800" color="#1e293b">
                            Revenue Statistics
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Monitor clinic revenue by overall or by doctor
                        </Typography>
                    </Box>
                </Box>
                
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>View Mode</InputLabel>
                        <Select
                            value={viewMode}
                            label="View Mode"
                            onChange={(e) => setViewMode(e.target.value as 'overall' | 'doctor')}
                        >
                            <MenuItem value="overall">Overall</MenuItem>
                            <MenuItem value="doctor">By Doctor</MenuItem>
                        </Select>
                    </FormControl>
                    
                    {viewMode === 'doctor' && (
                        <Autocomplete
                            sx={{ minWidth: 250 }}
                            options={doctors}
                            getOptionLabel={(option) => option.fullName}
                            value={selectedDoctor}
                            onChange={(_, newValue) => setSelectedDoctor(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Doctor" />
                            )}
                        />
                    )}
                    
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={selectedYear}
                            label="Year"
                            onChange={(e) => setSelectedYear(e.target.value as number)}
                        >
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            {/* Doctor Info Banner (when viewing doctor stats) */}
            {viewMode === 'doctor' && selectedDoctor && doctorRevenue && (
                <Card sx={{
                    borderRadius: "16px",
                    padding: "20px 24px",
                    mb: 3,
                    bgcolor: 'primary.main',
                    color: 'white'
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <User size={32} />
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                Dr. {doctorRevenue.doctorName}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Revenue statistics for {selectedYear}
                            </Typography>
                        </Box>
                    </Stack>
                </Card>
            )}

            {/* Show loading when fetching doctor data */}
            {loadingDoctorData ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                    <CircularProgress />
                </Box>
            ) : viewMode === 'doctor' && !selectedDoctor ? (
                <Card sx={{
                    borderRadius: "16px",
                    padding: "60px 24px",
                    textAlign: 'center',
                    border: "1px solid #e2e8f0"
                }}>
                    <User size={64} color="#94a3b8" />
                    <Typography variant="h6" color="text.secondary" mt={2}>
                        Please select a doctor to view their revenue statistics
                    </Typography>
                </Card>
            ) : (
                <>
                    {/* Statistics Cards */}
                    <Grid container spacing={3} mb={4}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard
                                title="Total Revenue"
                                value={`${formatCurrency(currentData?.totalRevenue || 0)} VND`}
                                icon={<DollarSign size={24} color="#3b82f6" />}
                                color="#3b82f6"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard
                                title="Examination Fee"
                                value={`${formatCurrency(currentData?.examinationRevenue || 0)} VND`}
                                icon={<Calendar size={24} color="#10b981" />}
                                color="#10b981"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard
                                title="Medicine Revenue"
                                value={`${formatCurrency(currentData?.medicineRevenue || 0)} VND`}
                                icon={<Receipt size={24} color="#f59e0b" />}
                                color="#f59e0b"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StatCard
                                title="Total Invoices"
                                value={currentData?.totalInvoices?.toString() || "0"}
                                icon={<Receipt size={24} color="#ef4444" />}
                                color="#ef4444"
                            />
                        </Grid>
                    </Grid>

                    {/* Charts */}
                    <Grid container spacing={3}>
                        {/* Monthly Revenue Chart */}
                        <Grid size={{ xs: 12, lg: 8 }}>
                            <Card sx={{
                                borderRadius: "16px",
                                padding: "24px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                                border: "1px solid #e2e8f0",
                                height: '100%'
                            }}>
                                <Typography variant="h6" fontWeight="bold" mb={2}>
                                    Monthly Revenue Trend ({selectedYear})
                                    {viewMode === 'doctor' && selectedDoctor && ` - Dr. ${selectedDoctor.fullName}`}
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                <ReactECharts option={getBarChartOption()} style={{ height: 350 }} />
                            </Card>
                        </Grid>

                        {/* Revenue Distribution Pie Chart */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Card sx={{
                                borderRadius: "16px",
                                padding: "24px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                                border: "1px solid #e2e8f0",
                                height: '100%'
                            }}>
                                <Typography variant="h6" fontWeight="bold" mb={2}>
                                    Revenue Distribution
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                {(currentData?.totalRevenue || 0) > 0 ? (
                                    <ReactECharts option={getPieChartOption()} style={{ height: 300 }} />
                                ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                                        <Typography color="text.secondary">No revenue data available</Typography>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Revenue Trend Line Chart */}
                    <Card sx={{
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        border: "1px solid #e2e8f0",
                        mt: 3
                    }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Revenue Trend Line
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <ReactECharts option={getLineChartOption()} style={{ height: 300 }} />
                    </Card>

                    {/* Monthly Details Table */}
                    <Card sx={{
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        border: "1px solid #e2e8f0",
                        mt: 3
                    }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Monthly Revenue Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Month</th>
                                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Examination</th>
                                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Medicine</th>
                                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Services</th>
                                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Total</th>
                                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Invoices</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData?.monthlyRevenue?.map((month) => (
                                        <tr key={month.month} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '12px', fontWeight: 500 }}>{month.month}</td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(month.examinationFee)} VND</td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(month.medicineFee)} VND</td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(month.serviceFee)} VND</td>
                                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#3b82f6' }}>
                                                {formatCurrency(month.revenue)} VND
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>{month.invoiceCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </Card>
                </>
            )}
        </Box>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
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
                    <Typography variant="h5" fontWeight="800" sx={{ color: '#1e293b', my: 1 }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{
                    bgcolor: `${color}15`,
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
