import { Box, TextField, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function PaymentMethodsToolbar({ searchKey, onChangeSearchKey, onOpenCreate, onRefresh }: {
  searchKey: string;
  onChangeSearchKey: (v: string) => void;
  onOpenCreate: () => void;
  onRefresh: () => void;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField size="small" placeholder="Search" value={searchKey} onChange={(e) => onChangeSearchKey(e.target.value)} InputProps={{ startAdornment: <SearchIcon /> }} />
        <Button variant="outlined" onClick={onRefresh}>Refresh</Button>
      </Box>

      <Box>
        <Button variant="contained" onClick={onOpenCreate}>New Payment Method</Button>
      </Box>
    </Box>
  );
}
