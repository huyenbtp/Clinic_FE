import React, { useState } from 'react';
import {
    Container, Box, Paper, Typography, Button, IconButton,
    Stack, Divider, Grid, Card, CardContent, Avatar,
    CircularProgress, Alert,
    Chip
} from '@mui/material';
import {
    CloudUpload, PhotoCamera, Close, ArrowBack,
    Restaurant, FitnessCenter, InfoOutlined,
    HealthAndSafety, AutoAwesome,
    ArrowLeft
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { aiURL } from '../../api/urls';

// --- Types (Giữ nguyên) ---
interface ServerResponse {
    age: number;
    gender: number; // 0: Male, 1: Female
    shape: 'thin' | 'normal' | 'fat';
    body_shape: 'Rectangle' | 'Triangle' | 'Apple';
}

const SmartConsultation: React.FC = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ServerResponse | null>(null);

    // --- Logic sinh tư vấn (Giữ nguyên) ---
    const getAdvice = (data: ServerResponse) => {
        const isMale = data.gender === 0;
        const workoutMap = {
            Rectangle: {
                title: "Hypertrophy & Definition",
                desc: isMale
                    ? "Focus on heavy compound lifts. Incorporate lateral raises and lat pulldowns to broaden your frame into a V-taper."
                    : "Focus on resistance training to create curves and build functional strength across the entire body."
            },
            Triangle: {
                title: "Upper-Body Balance",
                desc: "Prioritize shoulders, chest, and back exercises to balance your wider hip structure. Use moderate weights with higher reps."
            },
            Apple: {
                title: "Visceral Fat Targeting",
                desc: "Focus on HIIT and steady-state cardio (30-40 mins). Add core-strengthening exercises like planks to support your midsection."
            }
        };

        const nutritionMap = {
            thin: "Maintain a caloric surplus (300-500 kcal above maintenance). Aim for 1.8g - 2.2g of protein per kg of body weight.",
            normal: "Focus on a balanced maintenance diet. Prioritize whole foods and lean proteins to support functional health.",
            fat: "Implement a slight caloric deficit. Focus on high-protein, high-fiber meals to preserve muscle while losing body fat."
        };

        return {
            workout: workoutMap[data.body_shape],
            nutrition: nutritionMap[data.shape],
            personalNote: data.age < 25
                ? `At ${data.age}, your recovery rate is at its peak. This is the best time to build a strong muscle foundation.`
                : `At ${data.age}, focus on cardiovascular health and joint mobility to maintain long-term metabolic efficiency.`
        };
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleSubmit = async () => {
        if (!selectedImage) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
            const response = await fetch(aiURL, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data: ServerResponse = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try another image.");
        } finally {
            setIsLoading(false);
        }
    };

    const advice = result ? getAdvice(result) : null;

    return (
        <Box sx={{ minHeight: '100vh',
                    width: '100vw', 
                    display: 'flex',
                    flexDirection: 'column', 
                    alignItems: 'center',    
                    justifyContent: 'center', 
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    py: 4}}>
            <Container maxWidth="md">
                {/* Header */}
                <Box textAlign="center" mb={5}>
                    <Typography variant="h3" fontWeight="800" color="primary" gutterBottom>
                        AI Body Analysis
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Upload a full-body photo to receive smart health & fitness consultation
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {/* Left Side: Upload Zone */}
                    <Grid item xs={12} md={5}>
                        <Paper elevation={4} sx={{ p: 3, borderRadius: 4, textAlign: 'center' }}>
                            <Box
                                sx={{
                                    height: 350,
                                    width: '100%',
                                    border: previewUrl ? 'none' : '2px dashed #cbd5e1',
                                    borderRadius: 3,
                                    bgcolor: '#f8fafc',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <IconButton
                                            onClick={() => { setSelectedImage(null); setPreviewUrl(null); setResult(null); }}
                                            sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#ff4d4d', color: 'white' } }}
                                        >
                                            <Close />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <Avatar sx={{ bgcolor: 'primary.light', width: 70, height: 70, mb: 2 }}>
                                            <PhotoCamera fontSize="large" sx={{ color: 'primary.main' }} />
                                        </Avatar>
                                        <Typography variant="body2" color="text.secondary" px={3} mb={3}>
                                            Full-body photo recommended for best results
                                        </Typography>
                                        <Button variant="contained" component="label" startIcon={<CloudUpload />}>
                                            Choose Image
                                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                        </Button>
                                    </>
                                )}
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                disabled={!selectedImage || isLoading}
                                sx={{ mt: 3, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                            >
                                {isLoading ? "Analyzing..." : "Start Consultation"}
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Right Side: Results & Advice */}
                    {result && advice && (
                        <Grid item xs={12} md={7}>
                            <Stack spacing={3}>
                                {/* Meta Info Card */}
                                <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <HealthAndSafety />
                                            <Typography variant="subtitle1" fontWeight="bold">AI PERSONAL REPORT</Typography>
                                        </Stack>
                                        <Chip label="Analysis Complete" size="small" sx={{ bgcolor: 'white', fontWeight: 'bold' }} />
                                    </Stack>
                                    <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.2)' }} />
                                    <Typography variant="body2">
                                        Age: <strong>{result.age}</strong> | Gender: <strong>{result.gender === 0 ? 'Male' : 'Female'}</strong> | Shape: <strong>{result.shape}</strong>
                                    </Typography>
                                </Paper>

                                {/* Nutrition Card */}
                                <Card elevation={2} sx={{ borderRadius: 3, borderLeft: '6px solid #4caf50' }}>
                                    <CardContent sx={{ display: 'flex', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#e8f5e9', color: '#4caf50' }}><Restaurant /></Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="800" color="success.main">NUTRITION STRATEGY</Typography>
                                            <Typography variant="body2" color="text.secondary">{advice.nutrition}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Workout Card */}
                                <Card elevation={2} sx={{ borderRadius: 3, borderLeft: '6px solid #ff9800' }}>
                                    <CardContent sx={{ display: 'flex', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#fff3e0', color: '#ff9800' }}><FitnessCenter /></Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="800" color="warning.main">{advice.workout.title.toUpperCase()}</Typography>
                                            <Typography variant="body2" color="text.secondary">{advice.workout.desc}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Note Alert */}
                                <Alert severity="info" icon={<InfoOutlined />} sx={{ borderRadius: 3 }}>
                                    <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                                        <strong>Specialist Note:</strong> {advice.personalNote}
                                    </Typography>
                                </Alert>
                            </Stack>
                        </Grid>
                    )}
                </Grid>

                {/* Back Link */}
                <Box textAlign="center" mt={6}>
                    <Button
                        variant="text"
                        color="inherit"
                        startIcon={<ArrowLeft />}
                        onClick={() => navigate(-1)}
                        sx={{ textTransform: 'none', color: 'text.secondary' }}
                    >
                        Back to login
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default SmartConsultation;