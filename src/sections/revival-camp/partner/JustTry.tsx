'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Button, Grid, TextField, Typography, Snackbar, Alert
} from '@mui/material';

const parseAadhaarXML = (xmlString: string) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const data = xmlDoc.getElementsByTagName('PrintLetterBarcodeData')[0];

    if (!data) return null;

    return {
      name: data.getAttribute('name') || '',
      gender: data.getAttribute('gender') || '',
      dob: data.getAttribute('dob') || '',
      address: [
        data.getAttribute('house'),
        data.getAttribute('street'),
        data.getAttribute('lm'),
        data.getAttribute('loc'),
        data.getAttribute('vtc'),
        data.getAttribute('po'),
        data.getAttribute('dist'),
        data.getAttribute('state'),
        data.getAttribute('pc')
      ].filter(Boolean).join(', '),
      state: data.getAttribute('state') || '',
      district: data.getAttribute('dist') || '',
      place: data.getAttribute('vtc') || '',
      country: 'India',
    };
  } catch (err) {
    console.error('Failed to parse Aadhaar QR:', err);
    return null;
  }
};

const AadhaarQRForm: React.FC = () => {
  const scannedRef = useRef('');
  const [form, setForm] = useState({
    name: '',
    gender: '',
    dob: '',
    address: '',
    state: '',
    district: '',
    place: '',
    country: 'India'
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const raw = scannedRef.current.trim();
        const parsed = parseAadhaarXML(raw);
        if (parsed) {
          setForm(parsed);
          showSnackbar('Aadhaar data loaded successfully!', 'success');
        } else {
          showSnackbar('Invalid Aadhaar QR format.', 'error');
        }
        scannedRef.current = '';
      } else {
        scannedRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Aadhaar QR or Manual Entry
      </Typography>

      <Grid container spacing={2}>
        {Object.entries(form).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <TextField
              fullWidth
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value}
              onChange={(e) => handleChange(key as keyof typeof form, e.target.value)}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AadhaarQRForm;