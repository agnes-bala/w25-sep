'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, List, ListItem } from '@mui/material';

type ScanData = {
  id: string;
  name: string;
  status: 'IN' | 'OUT';
  timestamp: string;
};

const SingleEntry: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<ScanData[]>([]);
  const [statusMap, setStatusMap] = useState<{ [id: string]: 'IN' | 'OUT' }>({});

  // Function to update status using sample API
  const updateStatus = async (data: ScanData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending data:', data);

      // Send a POST request to a sample API
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const result = await response.json();
      console.log('API Response:', result);

      // Update the local state
      setLogs((prevLogs) => [...prevLogs, data]);
      setStatusMap((prevMap) => ({
        ...prevMap,
        [data.id]: data.status, // Update the latest status for that ID
      }));
    } catch (err) {
      setError('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let scannedText = '';

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt' || event.key === 'Meta') {
        return;
      }

      if (event.key === 'Enter') {
        if (scannedText.trim()) {
          console.log('Scanned Text:', scannedText);

          // Sample QR data format: ID|Name
          const [id, name] = scannedText.split('|');

          if (id && name) {
            // Toggle status based on previous state
            const lastStatus = statusMap[id];
            const newStatus = lastStatus === 'IN' ? 'OUT' : 'IN';

            const scanData: ScanData = {
              id,
              name,
              status: newStatus,
              timestamp: new Date().toLocaleString(),
            };

            console.log('New Status:', scanData);

            // Update the status
            updateStatus(scanData);
          } else {
            setError('Invalid QR Code format');
          }

          scannedText = '';
        }
      } else {
        scannedText += event.key;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [statusMap]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', p: 2 }}>
      <Typography variant="h5">QR Code Scanner</Typography>

      {error && <Typography color="error">{error}</Typography>}

      {loading && <CircularProgress />}

      {/* Logs Section */}
      <Box sx={{ mt: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6">Attendance Logs</Typography>
        <List>
          {logs.map((log, index) => (
            <ListItem key={index}>
              {log.name} - {log.status} at {log.timestamp}
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SingleEntry;
