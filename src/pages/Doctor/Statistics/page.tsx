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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DollarSign, TrendingUp, Calendar, Receipt } from "lucide-react";
import ReactECharts from 'echarts-for-react';
import { apiCall } from "../../../api/api";

interface MonthlyRevenue {
    month: string;
    monthNumber: number;
    year: number;
    revenue: number;
    examinationFee: number;
    medicineFee: number;
    serviceFee: number;
    invoiceCount: number;
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

export default function DoctorStatistics() {
    const [revenueData, setRevenueData] = useState<DoctorRevenueData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        fetchRevenueData();
    }, [selectedYear]);

    const fetchRevenueData = () => {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        apiCall(
            `doctor/revenue/monthly?year=${selectedYear}`,
            "GET",
            accessToken || "",
            null,
            (data: any) => {
                setRevenueData(data.data);
                setLoading(false);
            },
            (error: any) => {
                console.error("Error fetching revenue data:", error);
                setLoading(false);
            }
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    // Bar chart options for monthly revenue
    const getBarChartOption = () => {
        const months = revenueData?.monthlyRevenue?.map(m => m.month) || [];
        const examinationData = revenueData?.monthlyRevenue?.map(m => m.examinationFee) || [];
        const medicineData = revenueData?.monthlyRevenue?.map(m => m.medicineFee) || [];
        const serviceData = revenueData?.monthlyRevenue?.map(m => m.serviceFee) || [];

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
            { value: revenueData?.examinationRevenue || 0, name: 'Examination' },
            { value: revenueData?.medicineRevenue || 0, name: 'Medicine' },
            { value: revenueData?.serviceRevenue || 0, name: 'Services' }
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
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                    <TrendingUp size={28} color="var(--color-primary-main)" />
                    <Box>
                        <Typography variant="h4" fontWeight="800" color="#1e293b">
                            Revenue Statistics
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            View your monthly revenue and performance metrics
                        </Typography>
                    </Box>
                </Box>
                
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
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Revenue"
                        value={`${formatCurrency(revenueData?.totalRevenue || 0)} VND`}
                        icon={<DollarSign size={24} color="#3b82f6" />}
                        color="#3b82f6"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Examination Fee"
                        value={`${formatCurrency(revenueData?.examinationRevenue || 0)} VND`}
                        icon={<Calendar size={24} color="#10b981" />}
                        color="#10b981"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Medicine Revenue"
                        value={`${formatCurrency(revenueData?.medicineRevenue || 0)} VND`}
                        icon={<Receipt size={24} color="#f59e0b" />}
                        color="#f59e0b"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Invoices"
                        value={revenueData?.totalInvoices?.toString() || "0"}
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
                        {(revenueData?.totalRevenue || 0) > 0 ? (
                            <ReactECharts option={getPieChartOption()} style={{ height: 300 }} />
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                                <Typography color="text.secondary">No revenue data available</Typography>
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>

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
                            {revenueData?.monthlyRevenue?.map((month) => (
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
