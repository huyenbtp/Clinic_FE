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
            alert('Please choose role before login!');
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
            alert("Login fail")
        })
    }

    function loginSuccess(data: any) {
        const token = data.data.accessToken;
        const userRole = data.data.account.role;

        switch (selectedRole) {
            case 'Admin':
                if (userRole !== "ADMIN") { alert("Login fail: Role does not match"); return; }
                login(selectedRole, token);
                navigate('/admin');
                break;
            case 'Doctor':
                if (userRole !== "DOCTOR") { alert("Login fail: Role does not match"); return; }
                login(selectedRole, token);
                navigate('/doctor');
                break;
            case 'Receptionist':
                if (userRole !== "RECEPTIONIST") { alert("Login fail: Role does not match"); return; }
                login(selectedRole, token);
                navigate('/receptionist');
                break;
            case 'WarehouseStaff':
                if (userRole !== "WAREHOUSE_STAFF") { alert("Login fail: Role does not match"); return; }
                login(selectedRole, token);
                navigate('/warehouse-staff');
                break;
            case 'Patient':
                if (userRole !== "PATIENT") { alert("Login fail: Role does not match"); return; }
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
                        Login to use this system
                    </Typography>

                    {/* Form */}
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Account name"
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
                            label="Password"
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
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                label="Role"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as Role)}
                                startAdornment={
                                    <InputAdornment position="start" sx={{ ml: 1 }}>
                                        <Work color="action" sx={{ fontSize: 20 }} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value=""><em>-- Choose role --</em></MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Doctor">Doctor</MenuItem>
                                <MenuItem value="Receptionist">Receptionist</MenuItem>
                                <MenuItem value="WarehouseStaff">Warehouse staff</MenuItem>
                                <MenuItem value="Patient">Patient</MenuItem>
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
                            Login
                        </Button>
                    </Stack>

                    <Divider sx={{ my: 4 }}>Or</Divider>

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