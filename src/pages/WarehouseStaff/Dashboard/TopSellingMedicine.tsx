import { Box, Button, Card, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Calendar, Clock } from "lucide-react";


export default function TopSellingMedine() {
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
        Top Selling Medicine
      </Typography>

    </Card>
  );
}
