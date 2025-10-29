import { Alert, Snackbar } from "@mui/material";
import { useEffect } from "react";

export default function ActionResultMessage({
  open,
  setOpen,
  message
}: {
  open: boolean,
  setOpen: (open: boolean) => void,
  message: string
}) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [open]);
  
  return (
    <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center', }}>
      <Alert severity="success" sx={{ width: '100%', borderRadius: '10px' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}