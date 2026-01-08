import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    Divider,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    CircularProgress,
    Container,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Person,
    Lock,
    Visibility,
    VisibilityOff,
    Save,
    ArrowBack,
    Badge
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../api/api'; // Đảm bảo đường dẫn đúng

interface CreateAccountRequest {
    actorId: number | '';
    username: string;
    password: string;
}

export default function CreateAccount() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<CreateAccountRequest>({
        actorId: '',
        username: '',
        password: ''
    });

    // Visibility State for Password
    const [showPassword, setShowPassword] = useState(false);

    // Snackbar State
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info'
    });

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        // Validation
        if (!formData.actorId || !formData.username || !formData.password) {
            setSnackbar({
                open: true,
                message: 'Please fill in all required fields.',
                severity: 'warning'
            });
            return;
        }

        // Validate actorId is number
        if (isNaN(Number(formData.actorId))) {
            setSnackbar({
                open: true,
                message: 'Actor ID must be a number.',
                severity: 'error'
            });
            return;
        }

        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        // Chuẩn bị payload (chuyển actorId sang số)
        const payload = {
            ...formData,
            actorId: Number(formData.actorId)
        };

        apiCall(
            'auth/link_account', // Endpoint giả định (thường Admin mới tạo đc tk cho staff)
            'POST',
            null,
            JSON.stringify(payload),
            (data: any) => {
                setLoading(false);
                // Display detailed message from backend
                const message = data.data?.message || "Account created and linked successfully!";
                const actorName = data.data?.actorName;
                const role = data.data?.role;

                let displayMessage = message;
                if (actorName && role) {
                    displayMessage = `Successfully created account for ${actorName} (Role: ${role})`;
                }

                setSnackbar({
                    open: true,
                    message: displayMessage,
                    severity: 'success'
                });

                // Navigate back after delay
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            },
            (error: any) => {
                setLoading(false);
                setSnackbar({
                    open: true,
                    message: error.message || "Failed to create account. Please check the Staff ID and try again.",
                    severity: 'error'
                });
            }
        );
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 4
        }}>
            <Container maxWidth="sm">
                <Card sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                }}>
                    {/* Header */}
                    <Box display="flex" alignItems="center" mb={3}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                            sx={{ mr: 1, textTransform: 'none', color: 'text.secondary', minWidth: 'auto' }}
                        >
                            Back
                        </Button>
                        <Typography variant="h5" fontWeight="bold" color="#1e293b">
                            Create New Account
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Box component="form" display="flex" flexDirection="column" gap={3}>

                        {/* Actor ID */}
                        <TextField
                            fullWidth
                            label="Actor ID (Staff/Patient ID)"
                            name="actorId"
                            value={formData.actorId}
                            onChange={handleChange}
                            required
                            type="number"
                            helperText="Your staff id "
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Badge color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Username */}
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Password */}
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Action Buttons */}
                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3,
                                    color: 'text.secondary',
                                    borderColor: 'var(--color-border)'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3,
                                    fontWeight: 'bold',
                                    bgcolor: 'var(--color-primary-main)',
                                    '&:hover': {
                                        bgcolor: 'var(--color-primary-dark)'
                                    }
                                }}
                            >
                                {loading ? "Creating..." : "Create Account"}
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', boxShadow: 3 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
