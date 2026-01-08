import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import { 
  ErrorOutline, 
  WarningAmber, 
  InfoOutlined, 
  CheckCircleOutline 
} from '@mui/icons-material';

interface AlertDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  buttonCancel?: string;
  buttonConfirm?: string;
  onConfirm: () => void;
}

export default function AlertDialog({
  open,
  setOpen,
  title,
  description,
  type = 'info',
  buttonCancel,
  buttonConfirm = 'OK',
  onConfirm
}: AlertDialogProps) {
  
  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  // Xác định màu sắc và Icon dựa trên type
  const getColor = () => {
    switch (type) {
      case 'error': return '#d32f2f';
      case 'warning': return '#ed6c02';
      case 'success': return '#2e7d32';
      default: return '#0288d1';
    }
  };

  const getIcon = () => {
    const style = { fontSize: 40, color: getColor(), mb: 2 };
    switch (type) {
      case 'error': return <ErrorOutline sx={style} />;
      case 'warning': return <WarningAmber sx={style} />;
      case 'success': return <CheckCircleOutline sx={style} />;
      default: return <InfoOutlined sx={style} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { borderRadius: 3, p: 1, minWidth: 350 }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
        {getIcon()}
        <DialogTitle sx={{ p: 0, mb: 1, fontWeight: 'bold', fontSize: '1.2rem' }}>
          {title}
        </DialogTitle>
        {description && (
          <DialogContentText sx={{ color: 'text.secondary' }}>
            {description}
          </DialogContentText>
        )}
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 1 }}>
        {buttonCancel && (
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            sx={{ color: 'text.secondary', borderColor: '#ccc', textTransform: 'none', px: 3 }}
          >
            {buttonCancel}
          </Button>
        )}
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          autoFocus
          sx={{ 
            bgcolor: getColor(), 
            '&:hover': { bgcolor: getColor(), filter: 'brightness(0.9)' },
            textTransform: 'none',
            px: 4,
            boxShadow: 'none'
          }}
        >
          {buttonConfirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}