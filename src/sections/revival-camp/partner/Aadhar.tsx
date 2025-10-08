'use client';

import React, { useRef, useState } from 'react';

import {
  Alert,
  Box,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
// import { parseStringPromise } from 'xml2js';

const AadharFormScanner: React.FC = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const scannedTextRef = useRef('');

  // Simulate QR input via keyboard (common with many handheld QR scanners)
  // useEffect(() => {
  //   const handleKeyPress = async (event: KeyboardEvent) => {
  //     if (event.key === 'Enter') {
  //       const raw = scannedTextRef.current.trim();
  //       scannedTextRef.current = '';
  //       if (raw) {
  //         try {
  //           const result = await parseStringPromise(raw);
  //           const attr = result?.PrintLetterBarcodeData?.$;

  //           setName(attr?.name || '');
  //           setDob(attr?.dob || '');
  //           setGender(attr?.gender || '');

  //           showSnackbar('Aadhaar data extracted!', 'success');
  //         } catch (err) {
  //           showSnackbar('Failed to parse Aadhaar QR data.', 'error');
  //         }
  //       }
  //     } else {
  //       scannedTextRef.current += event.key;
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyPress);
  //   return () => window.removeEventListener('keydown', handleKeyPress);
  // }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ message, severity });
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5 }} component={Paper} p={4}>
      <Typography variant="h5" mb={2}>Aadhaar Form Auto-Fill</Typography>

      <Typography variant="body2" mb={2}>
        Scan the Aadhaar QR code using a connected scanner. Fields will auto-fill.
      </Typography>

      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Date of Birth"
        fullWidth
        margin="normal"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <TextField
        label="Gender"
        fullWidth
        margin="normal"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar?.severity || 'info'}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AadharFormScanner;
