import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3">Phòng mạch tư An Tâm</Typography>
      <Typography variant="h6" mt={2}>
        Chăm sóc sức khỏe tận tâm, chuyên nghiệp và hiệu quả
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 4 }} component={Link} to="/login">
        Đăng nhập quản lý
      </Button>
    </Box>
  );
}
