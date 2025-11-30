import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, FormControlLabel, Switch } from "@mui/material";
import { apiCall } from "../../../../api/api";
import { paymentMethodsGetById, paymentMethodsUpdate } from "../../../../api/urls";

export default function UpdatePaymentMethod({ open, id, onClose, onUpdated }: { open: boolean; id: number | null; onClose: () => void; onUpdated: () => void; }) {
  const [methodCode, setMethodCode] = useState("");
  const [methodName, setMethodName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiCall(paymentMethodsGetById(id), "GET", null, null, (res: any) => {
      const d = res.data;
      setMethodCode(d.methodCode || "");
      setMethodName(d.methodName || "");
      setDescription(d.description || "");
      setSortOrder(d.sortOrder || 0);
      setActive(d.active ?? true);
    }, (err: any) => console.error(err));
  }, [id]);

  const handleUpdate = () => {
    if (!id) return;
    const payload = { methodCode, methodName, description, sortOrder, active };
    apiCall(paymentMethodsUpdate(id), "PUT", null, JSON.stringify(payload), () => {
      onUpdated();
    }, (err: any) => console.error(err));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Payment Method</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Method Code" value={methodCode} onChange={(e) => setMethodCode(e.target.value)} fullWidth />
          <TextField label="Method Name" value={methodName} onChange={(e) => setMethodName(e.target.value)} fullWidth />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
          <TextField label="Sort Order" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} fullWidth />
          <FormControlLabel control={<Switch checked={active} onChange={(_, v) => setActive(v)} />} label="Active" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}
