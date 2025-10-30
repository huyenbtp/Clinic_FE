import { useState } from "react";
import ReactDOM from "react-dom";
import { Snackbar, Alert } from "@mui/material";

let showMessageFn: (msg: string) => void;

export function showMessage(message: string) {
  if (showMessageFn) showMessageFn(message);
  else console.warn("GlobalMessage component chưa được mount.");
}

export default function ActionResultMessage() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  showMessageFn = (msg: string) => {
    setMessage(msg);
    setOpen(true);
    setTimeout(() => setOpen(false), 2000);
  };

  return ReactDOM.createPortal(
    <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert severity="success" sx={{ width: "100%", borderRadius: "10px" }}>
        {message}
      </Alert>
    </Snackbar>,
    document.body
  );
}