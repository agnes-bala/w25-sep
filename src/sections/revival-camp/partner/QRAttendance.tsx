'use client';

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { GridDeleteIcon } from '@mui/x-data-grid';
import { config } from 'src/constants/helpers';

interface Child {
  uuid: string;
  child_name: string;
  child_age: number;
  child_gender: string;
}



const QRAttendance: React.FC = () => {
  const [scannedChildren, setScannedChildren] = useState<Child[]>(
    JSON.parse(localStorage.getItem('scannedChildren') || '[]')
  );
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const scannedTextRef = useRef<string>('');

  useEffect(() => {
    localStorage.setItem('scannedChildren', JSON.stringify(scannedChildren));
  }, [scannedChildren]);



  // current code 
  const fetchChildDetails = async (participantId: string): Promise<Child | null> => {
    try {
      const res = await fetch(`${config.BASE_URL}/kidsList?participantId=${participantId}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return {
        uuid: participantId,
        child_name: data.memberName,
        child_age: data.memberAge,
        child_gender: data.memberGender,
      };
    } catch (err) {
      console.error(err);
      showSnackbar('Invalid participant ID or failed to fetch data.', 'error');
      return null;
    }
  };

  const submitCheckIn = async () => {
    if (scannedChildren.length === 0) return;
    setLoading(true);

    try {
      const failedSubmissions: string[] = [];

      for (const child of scannedChildren) {
        if (!child.uuid) {
          failedSubmissions.push(`${child.child_name}: Missing participant ID`);
          continue;
        }

        await axios.post(`${config.BASE_URL}/attendance?participantId=${child.uuid}`).then(function (response) {
          console.log("msg", response)
          const successMsg = response?.data || `Successfully checked in ${child.child_name}`;
          showSnackbar(successMsg, 'success')
        }).catch(function (error) {
          showSnackbar(error.response.data.message, 'error')
        })

      }

      setScannedChildren([]);
      localStorage.removeItem('scannedChildren');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        showSnackbar(err.message, 'error');
      } else {
        showSnackbar('An unknown error occurred.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };


  const clearScanned = () => {
    setScannedChildren([]);
    localStorage.removeItem('scannedChildren');
  };

  const checkout = async (): Promise<void> => {
    try {
      const response = await axios.post(
        // 'http://camp-service.jesusredeems.org/Revival/checkout',
        `${config.BASE_URL}/Revival/checkout`,
        'checkout',
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );

      if (response.status === 200) {
        const msg = response.data || 'Checked out successfully.';
        showSnackbar(msg, 'success');
        console.log(response, "res")
      } else {
        const errorMsg = response.data || 'Failed to check out.';
        showSnackbar(errorMsg, 'error');
      }
    } catch (error: any) {
      console.error('Checkout failed:', error);

      // Check if error has response with a message
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      showSnackbar(errorMsg, 'error');
    }
  };


  const removeChild = (index: number) => {
    const updated = scannedChildren.filter((_, i) => i !== index);
    setScannedChildren(updated);
  };


  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
      if (event.key === 'Enter') {
        const raw = scannedTextRef.current.trim();
        if (raw && scannedChildren.length < 50) {
          const alreadyScanned = scannedChildren.some((c) => c.uuid === raw);
          if (alreadyScanned) {
            showSnackbar('This participant is already scanned.', 'error');
          } else {
            const child = await fetchChildDetails(raw);
            if (child) {
              setScannedChildren((prev) => [...prev, child]);
            }
          }
          scannedTextRef.current = '';
        }
      } else {
        scannedTextRef.current += event.key;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [scannedChildren]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Kids Attendance
      </Typography>
      <br />
      <Typography variant="body1" sx={{ mb: 2 }}>
        You can scan up to <strong>50 children</strong>.
      </Typography>
      <br />

      {scannedChildren.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 3, bgcolor: '' }} >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Age</strong></TableCell>
                <TableCell><strong>Gender</strong></TableCell>
                <TableCell align="right"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scannedChildren.map((child, index) => (
                <TableRow key={child.uuid}>
                  <TableCell>{child.child_name}</TableCell>
                  <TableCell>{child.child_age}</TableCell>
                  <TableCell>{child.child_gender}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => removeChild(index)}>
                      <GridDeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          No children scanned yet.
        </Typography>
      )}


      {scannedChildren.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" color="secondary" onClick={clearScanned}>
            Clear
          </Button>
          <Button variant="contained" color="primary" onClick={submitCheckIn} disabled={loading}>
            Submit
          </Button>
        </Box>
      )}

      {loading && <CircularProgress />}

      <Button variant="outlined" color="secondary" onClick={checkout}>
        CHECK OUT ALL
      </Button>


      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarMessage(null)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QRAttendance;