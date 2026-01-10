import { Box, TextField, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";

interface ServiceToolbarProps {
  searchKey: string;
  onChangeSearchKey: (key: string) => void;
}

export default function ServiceToolbar({
  searchKey,
  onChangeSearchKey,
}: ServiceToolbarProps) {
  return (
    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
      <TextField
        value={searchKey}
        onChange={(e) => onChangeSearchKey(e.target.value)}
        placeholder="Search by service name..."
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} color="#94a3b8" />
            </InputAdornment>
          ),
        }}
        sx={{
          width: "100%",
          maxWidth: "450px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px", // Kiểu dáng pill giống Reception List
            bgcolor: "#f8fafc",
            "& fieldset": { borderColor: "#e2e8f0" },
            "&:hover fieldset": { borderColor: "#cbd5e1" },
            "&.Mui-focused fieldset": { borderColor: "primary.main" },
          },
          "& .MuiInputBase-input": {
            fontSize: "0.9rem",
            py: 1,
          },
        }}
      />
    </Box>
  );
}