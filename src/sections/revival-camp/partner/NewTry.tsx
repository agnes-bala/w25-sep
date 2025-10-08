'use client';

import React, { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
// import Tesseract from 'tesseract.js';

const IDScannerForm: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: '',
    address: '',
    mobile: '',
  });

  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setImageFile(e.target.files[0]);
    }
  };

  // const extractInfo = (text: string) => {
  //   setOcrText(text);

  //   const nameMatch = text.match(/Name\s*[:\-]?\s*(.*)/i);
  //   const dobMatch = text.match(/(?:DOB|D\.O\.B\.|Date of Birth)[:\-]?\s*(\d{2,4}[\/\-\.]\d{2}[\/\-\.]\d{2,4})/i);
  //   const genderMatch = text.match(/\b(Male|Female|Other)\b/i);
  //   const mobileMatch = text.match(/\b[6-9]\d{9}\b/);
  //   const addrMatch = text.match(/Address\s*[:\-]?\s*(.*)/i);

  //   setForm({
  //     name: nameMatch?.[1] || '',
  //     dob: dobMatch?.[1] || '',
  //     gender: genderMatch?.[1] || '',
  //     address: addrMatch?.[1] || '',
  //     mobile: mobileMatch?.[0] || '',
  //   });
  // };

  // const handleScan = async () => {
  //   if (!imageFile) {
  //     setSnackbar({ message: 'Please upload an ID image.', severity: 'error' });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const { data: { text } } = await Tesseract.recognize(imageFile, 'eng');
  //     extractInfo(text);
  //     setSnackbar({ message: 'Details extracted!', severity: 'success' });
  //   } catch (error) {
  //     console.error('OCR failed:', error);
  //     setSnackbar({ message: 'Failed to read the image.', severity: 'error' });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }} component={Paper} p={3}>
      <Typography variant="h5" gutterBottom>
        ID Auto-Fill Scanner
      </Typography>

      <Typography variant="body2" mb={2}>
        Upload an image of Aadhaar, PAN, Voter ID, etc.
      </Typography>

      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload ID Image
        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
      </Button>

      {imageFile && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Selected: {imageFile.name}
        </Typography>
      )}

      <Button
        variant="outlined"
        // onClick={handleScan}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Scanning...' : 'Scan and Fill'}
      </Button>

      <TextField label="Name" fullWidth margin="normal" value={form.name} />
      <TextField label="Date of Birth" fullWidth margin="normal" value={form.dob} />
      <TextField label="Gender" fullWidth margin="normal" value={form.gender} />
      <TextField label="Address" fullWidth margin="normal" value={form.address} />
      <TextField label="Mobile" fullWidth margin="normal" value={form.mobile} />

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

export default IDScannerForm;
