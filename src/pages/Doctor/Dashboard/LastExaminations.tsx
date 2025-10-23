import { Box, Button, Card, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Calendar, Clock } from "lucide-react";

const fakeExam = {
  id: 'ex2',
  patientName: 'Trần Thị B',
  gender: 'Female',
  age: 28,
  examinationDate: '2025-10-14T10:00:00',
  symptoms: 'Đau đầu, chóng mặt, buồn nôn',
  diagnosis: 'Hạ huyết áp tạm thời',
}

export default function LastExamination() {
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
        Last Examination
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '12px' }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
          {fakeExam.patientName}
        </Typography>
        <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          ({fakeExam.gender}, {fakeExam.age} yrs)
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '10px' }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
          Checkup at
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Calendar size={16} />
          <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {dayjs(fakeExam.examinationDate).format("DD/MM/YYYY")}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Clock size={16} />
          <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {dayjs(fakeExam.examinationDate).format("HH:mm A")}
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: '10px' }}>
        Symtoms
      </Typography>
      <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)', mt: '5px', }}>
        {fakeExam.symptoms}
      </Typography>

      <Typography sx={{ fontSize: '16px', fontWeight: 'bold', mt: '10px' }}>
        Diagnosis
      </Typography>
      <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)', mt: '5px', }}>
        {fakeExam.diagnosis}
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
