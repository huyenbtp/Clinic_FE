import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type Role } from '../../auth/AuthContext';
import { apiCall } from '../../api/api';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    InputAdornment,
    Divider,
    Link,
    Grid
} from '@mui/material';
import {
    AccountCircle,
    Lock,
    Work,
    AutoGraph,
    PersonAdd,
    VpnKey,
    HelpOutline
} from '@mui/icons-material';

const LoginPage: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const { login } = useAuth();

    // --- LOGIC GIỮ NGUYÊN ---
    const handleLogin = () => {
        if (!selectedRole) {
            alert('Vui lòng chọn vai trò trước khi đăng nhập!');
            return;
        }
        loginToServer();
    };

    async function loginToServer() {
        const requestBody = {
            username: username,
            password: password
        }
        apiCall("auth/login", "POST", null, JSON.stringify(requestBody), loginSuccess, () => {
            alert("Đăng nhập thất bại")
        })
    }

    function loginSuccess(data: any) {
        const token = data.data.accessToken;
        const userRole = data.data.account.role;

        switch (selectedRole) {
            case 'Admin':
                if (userRole !== "ADMIN") { alert("Đăng nhập thất bại: Vai trò không khớp"); return; }
                login(selectedRole, token);
                navigate('/admin');
                break;
            case 'Doctor':
                if (userRole !== "DOCTOR") { alert("Đăng nhập thất bại: Vai trò không khớp"); return; }
                login(selectedRole, token);
                navigate('/doctor');
                break;
            case 'Receptionist':
                if (userRole !== "RECEPTIONIST") { alert("Đăng nhập thất bại: Vai trò không khớp"); return; }
                login(selectedRole, token);
                navigate('/receptionist');
                break;
            case 'WarehouseStaff':
                if (userRole !== "WAREHOUSE_STAFF") { alert("Đăng nhập thất bại: Vai trò không khớp"); return; }
                login(selectedRole, token);
                navigate('/warehouse-staff');
                break;
            case 'Patient':
                if (userRole !== "PATIENT") { alert("Đăng nhập thất bại: Vai trò không khớp"); return; }
                login(selectedRole, token);
                navigate('/patient');
                break;
            default:
                navigate('/');
                break;
        }
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.setItem("username", data.data.account.username);
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',   
                justifyContent: 'center', 
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={10}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        textAlign: 'center'
                    }}
                >
                    {/* Header */}
                    <Typography variant="h4" fontWeight="800" color="primary" gutterBottom>
                        CLINIC SYSTEM
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={4}>
                        Đăng nhập để quản lý và sử dụng dịch vụ
                    </Typography>

                    {/* Form */}
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Tên tài khoản"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Mật khẩu"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="role-label">Vai trò</InputLabel>
                            <Select
                                labelId="role-label"
                                label="Vai trò"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as Role)}
                                startAdornment={
                                    <InputAdornment position="start" sx={{ ml: 1 }}>
                                        <Work color="action" sx={{ fontSize: 20 }} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value=""><em>-- Chọn vai trò --</em></MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Doctor">Bác sĩ</MenuItem>
                                <MenuItem value="Receptionist">Lễ tân</MenuItem>
                                <MenuItem value="WarehouseStaff">Thủ kho / Cấp phát thuốc</MenuItem>
                                <MenuItem value="Patient">Bệnh nhân</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleLogin}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                boxShadow: 'none',
                                '&:hover': { boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' }
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Stack>

                    <Divider sx={{ my: 4 }}>Hoặc</Divider>

                    {/* Smart Consultation Section */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        startIcon={<AutoGraph />}
                        onClick={() => navigate("/consultation")}
                        sx={{ borderRadius: 2, py: 1, mb: 3, textTransform: 'none' }}
                    >
                        Smart Consultation from Image
                    </Button>

                    {/* Footer Actions */}
                    <Grid container spacing={1} justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <Button 
                                fullWidth 
                                startIcon={<PersonAdd />} 
                                size="small" 
                                onClick={() => navigate("/register_patient")}
                            >
                                Register Patient
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button 
                                fullWidth 
                                startIcon={<VpnKey />} 
                                size="small" 
                                onClick={() => navigate("/create_account")}
                            >
                                Create Staff Account 
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                fullWidth 
                                variant="text" 
                                color="inherit"
                                startIcon={<HelpOutline />} 
                                size="small" 
                                onClick={() => navigate("/forget_password")}
                            >
                                Forget your password?
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;