import { useEffect, useState } from "react";
import { Card, Typography, Box, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { apiCall } from "../../../api/api";
import { adminPatientVisitReport, adminPatientVisitStatistic, adminPatientVisitDetails } from "../../../api/urls";

interface PatientVisitData {
   month: string;
   newPatients: number;
   returningPatients: number;
   totalVisits: number;
}

interface PatientVisitStat {
   totalNewPatients: number;
   totalReturningPatients: number;
   totalVisits: number;
}

interface PatientVisitDetail {
   patientId: number;
   patientName: string;
   firstVisitDate: string;
   totalVisits: number;
   newPatient: boolean;
}

export default function PatientVisitReport() {
   const [chartData, setChartData] = useState<PatientVisitData[]>([]);
   const [statistics, setStatistics] = useState<PatientVisitStat | null>(null);
   const [patientDetails, setPatientDetails] = useState<PatientVisitDetail[]>([]);
   const [loading, setLoading] = useState(true);
   const [detailsLoading, setDetailsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
   const [tabValue, setTabValue] = useState(0);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   useEffect(() => {
      fetchData();
   }, [selectedYear]);

   const fetchData = () => {
      const accessToken = localStorage.getItem("accessToken") || "";
      setLoading(true);
      setError(null);

      // Fetch statistics only
      apiCall(
         adminPatientVisitStatistic(selectedYear),
         "GET",
         accessToken,
         null,
         (response: any) => {
            setStatistics(response.data);
            setLoading(false);
         },
         (error: any) => {
            setError(error.message || "Failed to load statistics");
            setLoading(false);
         }
      );
   };

   // Lazy load chart data when tab 0 is active
   useEffect(() => {
      if (tabValue === 0 && chartData.length === 0) {
         const accessToken = localStorage.getItem("accessToken") || "";
         apiCall(
            adminPatientVisitReport(selectedYear),
            "GET",
            accessToken,
            null,
            (response: any) => {
               setChartData(response.data);
            },
            (error: any) => {
               console.error("Failed to load chart data:", error);
            }
         );
      }
   }, [tabValue, selectedYear]);

   // Lazy load patient details when tab 1 is active
   useEffect(() => {
      if (tabValue === 1 && patientDetails.length === 0) {
         const accessToken = localStorage.getItem("accessToken") || "";
         setDetailsLoading(true);

         apiCall(
            adminPatientVisitDetails(selectedYear),
            "GET",
            accessToken,
            null,
            (response: any) => {
               setPatientDetails(response.data);
               setDetailsLoading(false);
            },
            (error: any) => {
               console.error("Failed to load patient details:", error);
               setDetailsLoading(false);
            }
         );
      }
   }, [tabValue, selectedYear]);

   const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

   const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   if (loading) {
      return (
         <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return <Alert severity="error">{error}</Alert>;
   }

   return (
      <Box>
         {/* Header with Year Selector */}
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="700" color="#1e293b">
               Patient Visit Report
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
               <InputLabel>Year</InputLabel>
               <Select
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => {
                     setSelectedYear(e.target.value as number);
                     setChartData([]);
                     setPatientDetails([]);
                  }}
               >
                  {years.map((year) => (
                     <MenuItem key={year} value={year}>
                        {year}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>
         </Box>

         {/* Statistics Cards */}
         {statistics && (
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
               <Card sx={{ flex: 1, minWidth: 200, padding: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                     Total New Patients
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#3b82f6">
                     {statistics.totalNewPatients}
                  </Typography>
               </Card>
               <Card sx={{ flex: 1, minWidth: 200, padding: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                     Total Returning Patients
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#10b981">
                     {statistics.totalReturningPatients}
                  </Typography>
               </Card>
               <Card sx={{ flex: 1, minWidth: 200, padding: 2, borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                     Total Visits
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="#f59e0b">
                     {statistics.totalVisits}
                  </Typography>
               </Card>
            </Box>
         )}

         {/* Tabs */}
         <Card sx={{ borderRadius: 2 }}>
            <Tabs value={tabValue} onChange={(_e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
               <Tab label="Overview Chart" />
               <Tab label="Patient Details" />
            </Tabs>

            {/* Tab 1: Chart */}
            {tabValue === 0 && (
               <Box sx={{ padding: 3 }}>
                  <Typography variant="h6" fontWeight="600" mb={2}>
                     Monthly Visit Chart
                  </Typography>
                  {chartData.length === 0 ? (
                     <Box display="flex" justifyContent="center" py={10}>
                        <CircularProgress />
                     </Box>
                  ) : (
                     <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                           <CartesianGrid strokeDasharray="3 3" />
                           <XAxis dataKey="month" />
                           <YAxis />
                           <Tooltip />
                           <Legend />
                           <Bar dataKey="newPatients" fill="#3b82f6" name="New Patients" />
                           <Bar dataKey="returningPatients" fill="#10b981" name="Returning Patients" />
                        </BarChart>
                     </ResponsiveContainer>
                  )}
               </Box>
            )}

            {/* Tab 2: Patient Details Table */}
            {tabValue === 1 && (
               <Box sx={{ padding: 3 }}>
                  <Typography variant="h6" fontWeight="600" mb={2}>
                     Patient List and Visit Count
                  </Typography>
                  {detailsLoading ? (
                     <Box display="flex" justifyContent="center" py={10}>
                        <CircularProgress />
                     </Box>
                  ) : (
                     <>
                        <TableContainer component={Paper} variant="outlined">
                           <Table>
                              <TableHead>
                                 <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell><strong>Patient ID</strong></TableCell>
                                    <TableCell><strong>Patient Name</strong></TableCell>
                                    <TableCell><strong>First Visit Date</strong></TableCell>
                                    <TableCell align="center"><strong>Visit Count</strong></TableCell>
                                    <TableCell align="center"><strong>Type</strong></TableCell>
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {patientDetails.length === 0 ? (
                                    <TableRow>
                                       <TableCell colSpan={5} align="center">
                                          <Typography color="text.secondary" py={3}>
                                             No patient data available.
                                          </Typography>
                                       </TableCell>
                                    </TableRow>
                                 ) : (
                                    patientDetails
                                       .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                       .map((patient) => (
                                          <TableRow key={patient.patientId} hover>
                                             <TableCell>PT{patient.patientId.toString().padStart(5, '0')}</TableCell>
                                             <TableCell>{patient.patientName}</TableCell>
                                             <TableCell>{patient.firstVisitDate}</TableCell>
                                             <TableCell align="center">{patient.totalVisits}</TableCell>
                                             <TableCell align="center">
                                                <Box
                                                   sx={{
                                                      display: 'inline-block',
                                                      px: 1.5,
                                                      py: 0.5,
                                                      borderRadius: 1,
                                                      bgcolor: patient.newPatient ? '#e0f2fe' : '#dcfce7',
                                                      color: patient.newPatient ? '#0369a1' : '#15803d',
                                                      fontSize: '0.875rem',
                                                      fontWeight: 600
                                                   }}
                                                >
                                                   {patient.newPatient ? 'New' : 'Returning'}
                                                </Box>
                                             </TableCell>
                                          </TableRow>
                                       ))
                                 )}
                              </TableBody>
                           </Table>
                        </TableContainer>
                        {patientDetails.length > 0 && (
                           <TablePagination
                              component="div"
                              count={patientDetails.length}
                              page={page}
                              onPageChange={handleChangePage}
                              rowsPerPage={rowsPerPage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                              rowsPerPageOptions={[10, 25, 50]}
                              labelRowsPerPage="Rows per page:"
                           />
                        )}
                     </>
                  )}
               </Box>
            )}
         </Card>
      </Box>
   );
}
