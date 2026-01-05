import React, { useState, useEffect } from 'react';
import { 
    Typography, Box, Button, Container, Paper, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, Stack, Divider, Tooltip,
    Grid
} from '@mui/material';
import { 
    ExitToApp, Search, HowToReg, PlayCircleOutline, 
    History, PersonAdd, AccessTime, Today
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AlertDialog from './alert';
import { showMessage } from '../../../components/ActionResultMessage'; 
import { apiCall } from '../../../api/api';
import dayjs from 'dayjs';

// --- Types ---
interface Appointment {
    id: string;
    patientName: string;
    time: string;
    
    status: string;
}

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  // --- Mock Data: Today's Reception List ---
  useEffect(() => {
    const fetchTodayAppointments = () => {
      /*
        const mockAppointments: Appointment[] = [
            { id: 'APP-101', patientName: 'John Wick', time: '08:30 AM', status: 'Completed' },
            { id: 'APP-102', patientName: 'Tony Stark', time: '09:15 AM', status: 'In Progress' },
            { id: 'APP-103', patientName: 'Steve Rogers', time: '10:00 AM', status: 'Arrived' },
            { id: 'APP-104', patientName: 'Natasha Romanoff', time: '10:45 AM', status: 'Scheduled' },
            { id: 'APP-105', patientName: 'Bruce Banner', time: '11:30 AM', status: 'Scheduled' },
        ];
        setAppointments(mockAppointments);*/
        const today= dayjs().format("YYYY-MM-DD");
        const url=`receptionist/all_receptions?pageNumber=0&pageSize=1000&date=${today}`;
        const accessToken= localStorage.getItem("accessToken");
        apiCall(url, "GET",accessToken?accessToken:"",null,(data:any)=>{
          const appointmentData= data.data.content.map((item:any)=>{
            return {
              id: item.receptionId,
              patientName: item.patient?item.patient.patientName:"",
              time:dayjs(item.receptionDate).format("DD/MM/YYYY"),
              status:item.status
            }
          });
          setAppointments(appointmentData);
        },(data:any)=>{
          alert(data.message);
          navigate("/login");
        })
    };
    fetchTodayAppointments();
  }, []);

  // --- Actions ---
  const handleCheckIn = (id: string) => {
    setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: 'Arrived' } : app
    ));
    showMessage("Patient checked in successfully!");
  };

  const handleStartAIScan = (id: string) => {
    // Navigate to the Smart Consultation page we built earlier
    navigate('/smart-consultation');
  };

  const handleEndSession = async () => {
    const accessToken = localStorage.getItem("accessToken");
    apiCall("receptionist/end_session", "GET", accessToken || "", null, () => {
      showMessage("Session ended successfully!");
      setIsConfirmDialogOpen(false);
      navigate('/login');
    }, (err: any) => alert(err.message));
  };

  const filteredAppointments = appointments.filter(app => 
    app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Top Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="primary.main">
                Today's Reception
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                <Today fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" fontWeight="500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
            </Stack>
        </Box>

        <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<History />} sx={{ borderRadius: 2 }}>Logs</Button>
            <Button variant="contained" startIcon={<PersonAdd />} sx={{ borderRadius: 2, boxShadow: 'none' }}>Quick Register</Button>
            <Divider orientation="vertical" flexItem />
            <Button variant="text" color="error" startIcon={<ExitToApp />} onClick={() => {
                setConfirmMessage("Close receptionist session for today?");
                setIsConfirmDialogOpen(true);
            }}>End session</Button>
        </Stack>
      </Box>

      {/* Search & Filter Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e0e6ed', bgcolor: '#fbfcfe' }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search patient name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),
                        sx: { borderRadius: 2, bgcolor: 'white' }
                    }}
                />
            </Grid>
            <Grid item xs={12} md={6} textAlign="right">
                <Typography variant="body2" fontWeight="600" color="text.secondary">
                    Queue Status: {appointments.filter(a => a.status === 'Arrived').length} Arrived | {appointments.filter(a => a.status === 'Scheduled').length} Upcoming
                </Typography>
            </Grid>
        </Grid>
      </Paper>

      {/* Appointment Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #eef2f6' }}>
        <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>Patient Info</TableCell>
                    
                    <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }} align="center">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filteredAppointments.map((app) => (
                    <TableRow key={app.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AccessTime fontSize="small" color="disabled" />
                                <Typography variant="body2" fontWeight="600">{app.time}</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" fontWeight="700">{app.patientName}</Typography>
                            <Typography variant="caption" color="text.secondary">{app.id}</Typography>
                        </TableCell>
                        
                        <TableCell>
                            <Chip 
                                label={app.status} 
                                size="small" 
                                sx={{ 
                                    fontWeight: 'bold', fontSize: '0.7rem',
                                    bgcolor: app.status === 'Arrived' ? '#e0f2fe' : app.status === 'Completed' ? '#dcfce7' : '#f1f5f9',
                                    color: app.status === 'Arrived' ? '#0369a1' : app.status === 'Completed' ? '#15803d' : '#475569'
                                }} 
                            />
                        </TableCell>
                        <TableCell align="center">
                            {app.status === 'Scheduled' && (
                                <Tooltip title="Confirm Arrival">
                                    <Button size="small" startIcon={<HowToReg />} onClick={() => handleCheckIn(app.id)}>Check-in</Button>
                                </Tooltip>
                            )}
                            {app.status === 'Arrived' && (
                                <Button 
                                    variant="contained" 
                                    size="small" 
                                    color="primary" 
                                    startIcon={<PlayCircleOutline />}
                                    onClick={() => handleStartAIScan(app.id)}
                                    sx={{ borderRadius: 5, fontSize: '0.7rem', boxShadow: 'none' }}
                                >
                                    Start AI Scan
                                </Button>
                            )}
                            {app.status === 'Completed' && (
                                <Typography variant="caption" color="success.main" fontWeight="bold">Done</Typography>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </TableContainer>

      <AlertDialog
        title={confirmMessage}
        type="warning"
        open={isConfirmDialogOpen}
        setOpen={setIsConfirmDialogOpen}
        buttonCancel="No"
        buttonConfirm="Yes"
        onConfirm={handleEndSession}
      />
    </Container>
  );
}