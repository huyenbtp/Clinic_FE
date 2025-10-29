import { useState } from "react";
import { Box, Button, Card, MenuItem, Select, TextField, Typography } from "@mui/material";
import AlertDialog from "../../../components/AlertDialog";
import ActionResultMessage from "../../../components/ActionResultMessage";
import type { PatientCreateDto } from "../../../types/PatientCreateDto";
import { useNavigate } from "react-router-dom";

export default function CreatePatient() {
  const navigate = useNavigate();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const [data, setData] = useState<PatientCreateDto>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    idCard: "",
    firstVisitDate: "",
  })

  const handleAddPatient = () => {
    setIsConfirmDialogOpen(true);
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 56px',
      height: '100%',
    }}>
      <Typography variant="h5" fontWeight="bold" mx={4} mb={3}>
        Add New Patient
      </Typography>

      <Box flex={1} p="6px">
        <Card sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '30px 40px',
          gap: 1,
          borderRadius: 2,
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
        }}>

          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mb: 2 }}>
            Patient Information
          </Typography>

          <Box m={1} display="flex" gap={5}>
            <Box flex={1}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                Patient's Full Name
              </Typography>

              <TextField
                value={data.fullName}
                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                fullWidth
              />
            </Box>

            <Box flex={1}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                Citizen Identification Number
              </Typography>

              <TextField
                value={data.idCard}
                onChange={(e) => setData({ ...data, idCard: e.target.value })}
                fullWidth
              />
            </Box>
          </Box>

          <Box m={1} display="flex" gap={5}>
            <Box flex={1}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                DOB
              </Typography>

              <TextField
                value={data.dateOfBirth}
                onChange={(e) => setData({ ...data, dateOfBirth: e.target.value })}
                fullWidth
                type="date"
              />
            </Box>

            <Box flex={1}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                Gender
              </Typography>
              <Select
                value={data.gender}
                onChange={(e) => setData({ ...data, gender: e.target.value })}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                <MenuItem value="Male">
                  Male
                </MenuItem>
                <MenuItem value="Female">
                  Female
                </MenuItem>
              </Select>
            </Box>

            <Box flex={1}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                First Visit
              </Typography>
              <TextField
                value={data.firstVisitDate}
                onChange={(e) => setData({ ...data, firstVisitDate: e.target.value })}
                fullWidth
                type="date"
              />
            </Box>
          </Box>

          <Box m={1} display="flex" gap={5}>
            <Box flex={1}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                Phone Number
              </Typography>
              <TextField
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                fullWidth
                type="tel"
              />
            </Box>

            <Box flex={1}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                Email
              </Typography>
              <TextField
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                fullWidth
                type="email"
              />
            </Box>
          </Box>

          <Box m={1}>
            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
              Address
            </Typography>
            <TextField
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              fullWidth
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleAddPatient}
            sx={{
              alignSelf: 'center',
              mt: 5,
              textTransform: "none",
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '8px 40px',
            }}
          >
            Add Patient
          </Button>
        </Card>
      </Box>

      <AlertDialog
        title="Are you sure you want to add this patient?"
        type="info"
        open={isConfirmDialogOpen}
        setOpen={setIsConfirmDialogOpen}
        buttonCancel="Cancel"
        buttonConfirm="Yes"
        onConfirm={() => {
          setData(({
            fullName: "",
            dateOfBirth: "",
            gender: "",
            address: "",
            phone: "",
            email: "",
            idCard: "",
            firstVisitDate: "",
          }));
          setMessage("Successfully added patient!");
          setOpenSnackbar(true);

          setIsConfirmDialogOpen(false);
        }}
      />

      <ActionResultMessage
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        message={message}
      />
    </Box>

  );
}
