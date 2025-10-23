import { Box, Button, Card, Typography } from "@mui/material";
import { Calendar, Clock } from "lucide-react";
import dayjs from "dayjs";

const fakeAppointment = {
  name: "Phạm Thị D",
  gender: "Female",
  age: "30",
  date: new Date('2025-10-14T13:30:00'),
  time: "13:30",
  symptom: "Đau bụng, buồn nôn"
}

export default function UpcomingAppointment() {
  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '18px 30px',
      borderRadius: 2,
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
    }}>
      <Typography sx={{ fontSize: '22px', fontWeight: 'bold' }}>
        Upcoming Appointment
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '12px' }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
          {fakeAppointment.name}
        </Typography>
        <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          ({fakeAppointment.gender}, {fakeAppointment.age} yrs)
        </Typography>
      </Box>

      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: '10px' }}>
        General Visit
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, mt: '5px' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Calendar size={16} />
          <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {dayjs(fakeAppointment.date).format("dddd, DD MMM YYYY")}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Clock size={16} />
          <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {dayjs(fakeAppointment.date).format("HH:mm A")}
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: '10px' }}>
        Symtoms
      </Typography>
      <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)', mt: '5px', }}>
        {fakeAppointment.symptom}
      </Typography>

      <Button variant="contained" fullWidth sx={{
        mt: 'auto',
        textTransform: 'none',
      }}>
        View Record
      </Button>
    </Card>
  );
}
