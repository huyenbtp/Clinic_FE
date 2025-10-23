import { Typography, Box, Card, } from "@mui/material";
import { MedicalInformation } from "@mui/icons-material";
import { CalendarCheck, } from "lucide-react";
import TodayAppointments from "./TodayAppointments";
import UpcomingAppointment from "./UpcomingAppointment";
import LastExamination from "./LastExaminations";

export default function DoctorDashboard() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      padding: '26px 56px',
      height: '100%',
    }}>
      <Box margin="0px 25px 18px 25px" display="flex" gap={1}>
        <Typography sx={{
          fontWeight: 'bold',
          fontSize: '24px'
        }}>
          Welcome,
        </Typography>
        <Typography sx={{
          color: "var(--color-primary-main)",
          fontWeight: 'bold',
          fontSize: '24px'
        }}>
          Dr. Robert Harry
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        gap: 3,
        minHeight: 0,
      }}>
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}>
          <Box minHeight="0" sx={{
            flex: 1.1,
          }}>
            <LastExamination />
          </Box>
          <Box minHeight="0" sx={{
            flex: 1,
          }}>
            <UpcomingAppointment />
          </Box>
        </Box>

        <Box sx={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}>
          <Box sx={{
            flex: 1,
            display: 'flex',
            gap: 3,
          }}>
            <Card sx={{
              flex: 1,
              display: 'flex',
              alignItems: "center",
              gap: 5,
              padding: '18px 75px 18px 45px',
              borderRadius: 2,
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
            }}>
              <MedicalInformation sx={{
                color: "var(--color-primary-main)",
                fontSize: '38px'
              }} />
              <Box>
                <Typography sx={{
                  fontWeight: 'bold',
                  fontSize: '22px',
                  lineHeight: 1.3
                }}>
                  3000
                </Typography>
                <Typography sx={{
                  fontSize: '14px'
                }}>
                  Medical Examinations
                </Typography>
              </Box>
            </Card>

            <Card sx={{
              flex: 1,
              display: 'flex',
              alignItems: "center",
              gap: 5,
              padding: '18px 75px 18px 45px',
              borderRadius: 2,
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
            }}>
              <CalendarCheck size="38px" color="var(--color-primary-main)" />

              <Box>
                <Typography sx={{
                  fontWeight: 'bold',
                  fontSize: '22px',
                  lineHeight: 1.3
                }}>
                  200
                </Typography>
                <Typography sx={{
                  fontWeight: 'medium',
                  fontSize: '14px'
                }}>
                  Appointments
                </Typography>
              </Box>
            </Card>
          </Box>

          <Box flex={4} minHeight="0">
            <TodayAppointments />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
