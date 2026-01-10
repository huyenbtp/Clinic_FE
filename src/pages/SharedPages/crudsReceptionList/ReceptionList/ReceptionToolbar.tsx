import { useRef } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Button,
} from "@mui/material";
import { CalendarDays, Search } from "lucide-react";
import { getStatusBgColor, getStatusTextColor } from "./ReceptionTable";
import { useAuth } from "../../../../auth/AuthContext";
import { Add } from "@mui/icons-material";

export default function ReceptionToolbar({
  searchKey,
  onChangeSearchKey,
  date,
  onChangeDate,
  status,
  onChangeStatus,
  onOpenNewForm,
}: {
  searchKey: string;
  onChangeSearchKey: (key: string) => void;
  date: string;
  onChangeDate: (date: string) => void;
  status: string;
  onChangeStatus: (status: string) => void;
  onOpenNewForm: () => void;
}) {
  const { role } = useAuth();
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Danh sách các trạng thái (Thêm "All" vào đầu hoặc cuối tùy bạn)
  const statusOptions = ["All", "WAITING", "IN_EXAMINATION", "DONE", "CANCELLED"];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {/* Search Input */}
        <TextField
          value={searchKey}
          onChange={(e) => onChangeSearchKey(e.target.value)}
          placeholder="Search by patient name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="var(--color-text-secondary)" />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: "var(--color-primary-light)",
            borderRadius: 3,
            width: "280px",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "& .MuiInputBase-input": { py: "10px" },
          }}
        />

        {/* Date Input */}
        <TextField
          value={date}
          onChange={(e) => onChangeDate(e.target.value)}
          type="date"
          inputRef={dateInputRef}
          InputProps={{
            endAdornment: (
              <InputAdornment 
                position="end" 
                sx={{ cursor: 'pointer' }}
                onClick={() => dateInputRef.current?.showPicker()}
              >
                <CalendarDays size={18} color="var(--color-primary-main)" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiInputBase-root": {
              width: "180px",
              borderRadius: 3,
              "& fieldset": {
                borderColor: "var(--color-primary-main)",
                borderWidth: 1.6,
              },
            },
            "& input": { py: "10px" },
            "& input::-webkit-calendar-picker-indicator": { display: "none" },
          }}
        />

        {/* Status Select */}
        <Select
          value={status || "All"} // Đảm bảo luôn có giá trị mặc định là "All"
          onChange={(e) => onChangeStatus(e.target.value)}
          // renderValue giúp hiển thị giá trị đã chọn đẹp hơn (giống chip)
          renderValue={(selected) => (
            <Box sx={{
              display: 'inline-flex',
              borderRadius: 1,
              padding: '2px 10px',
              fontSize: '14px',
              fontWeight: 500,
              color: getStatusTextColor(selected),
              bgcolor: getStatusBgColor(selected),
            }}>
              {selected}
            </Box>
          )}
          sx={{
            height: "42px",
            minWidth: "160px",
            "& fieldset": {
              borderRadius: 3,
              borderWidth: "1.6px !important",
              borderColor: "var(--color-primary-main) !important",
            },
          }}
        >
          {statusOptions.map((item) => (
            <MenuItem key={item} value={item}>
              <Box
                sx={{
                  display: "inline-flex",
                  borderRadius: 1,
                  padding: "2px 10px",
                  fontSize: "14px",
                  color: getStatusTextColor(item),
                  bgcolor: getStatusBgColor(item),
                }}
              >
                {item}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </Box>

      {role === "Receptionist" && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onOpenNewForm}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "none",
            px: 3,
            fontWeight: "bold",
          }}
        >
          New Reception
        </Button>
      )}
    </Box>
  );
}