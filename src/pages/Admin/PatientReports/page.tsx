import { Box, Typography } from "@mui/material";
import { TrendingUp } from "lucide-react";
import PatientVisitReport from "../Dashboard/PatientVisitReport";

export default function PatientReportsPage() {
   return (
      <Box sx={{
         padding: { xs: '20px', md: '30px 40px' },
         minHeight: '100vh',
         bgcolor: '#f8fafc'
      }}>
         {/* Header */}
         <Box mb={4} display="flex" alignItems="center" gap={1.5}>
            <TrendingUp size={28} color="var(--color-primary-main)" />
            <Box>
               <Typography variant="h4" fontWeight="800" color="#1e293b">
                  Patient Reports
               </Typography>
               <Typography variant="body2" color="text.secondary">
                  Track visits of new patients and returning patients
               </Typography>
            </Box>
         </Box>

         {/* Report Component */}
         <PatientVisitReport />
      </Box>
   );
}
