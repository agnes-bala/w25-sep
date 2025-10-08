'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Snackbar,
  Typography,
} from '@mui/material';
import { config } from 'src/constants/helpers';

const SendSms = () => {
  const [smsMessage, setSmsMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const API_BASE = `${config.BASE_URL}`;

  useEffect(() => {
    const fetchMessage = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/smsCountDetails`, {
          responseType: 'text',
        });
        setSmsMessage(response.data);
      } catch (error) {
        console.error('❌ Failed to fetch SMS message:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load SMS message.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  const handleSendSms = async () => {
    if (!smsMessage) return;

    setSending(true);
    try {
      const response = await axios.post(`${API_BASE}/send`, {
        message: smsMessage,
      });

      console.log('✅ SMS sent successfully:', response.data);
      setSnackbar({
        open: true,
        message: '✅ SMS sent successfully!',
        severity: 'success',

      });
    } catch (error) {
      console.error('🔥 Failed to send SMS:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send SMS. Check console for details.',
        severity: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Send SMS" />
        <Divider />
        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : smsMessage ? (
            <>

              <Typography variant="h6" gutterBottom>
                SMS Preview
              </Typography>
              <Box display="flex" justifyContent="center" mb={2}>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-line', mb: 2, }}
                >
                  {smsMessage}
                </Typography>

              </Box>
              <Button
                variant="contained"
                onClick={handleSendSms}
                disabled={sending}
                sx={{ justifyContent: 'center', display: 'block', margin: '0 auto' }}
              >
                {sending ? 'Sending...' : 'Send SMS'}
              </Button>
            </>
          ) : (
            <Typography color="error">
              SMS message not available. Try reloading.
            </Typography>
          )}
        </Box>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SendSms;
