'use client';

import type { GridColDef } from '@mui/x-data-grid';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid2,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { config } from 'src/constants/helpers';

import { Field, Form } from 'src/components/hook-form';
import { paymentOptions } from 'src/constants/selectoptions';

type Entry = {
  id: number;
  staffName: string;
  date: string;
  cashAmount: number;
  upiAmount: number;
  discountAmount: number;
  totalAmount: number;
  createdBy: string;
};

const AmountReport = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [staffList, setStaffList] = useState<string[]>([]);
  const [summary, setSummary] = useState({
    totalEntries: 0,
    cashAmount: 0,
    upiAmount: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    axios.get(`${config.BASE_URL}/staffNames`)
      .then(res => setStaffList(res.data))
      .catch(err => console.error('Failed to fetch staff names', err));
  }, []);

  const columns: GridColDef[] = [
    { field: 'staffName', headerName: 'Staff Name', minWidth: 140 },
    { field: 'date', headerName: 'Date', width: 140 },
    { field: 'cashAmount', headerName: 'Cash Amount', width: 120 },
    { field: 'upiAmount', headerName: 'UPI Amount', width: 120 },
    { field: 'discountAmount', headerName: 'Discount', width: 140 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 140 },
  ];

  const defaultValues = {
    staffList: 'All',
    campDates: 'All',
    paymentMode: 'All',
  };

  const methods = useForm({ mode: 'all', defaultValues });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCancel = () => {
    methods.reset();
    setEntries([]);
    setSummary({
      totalEntries: 0,
      cashAmount: 0,
      upiAmount: 0,
      totalAmount: 0,
    });
  };

  // const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stName, setStaffName] = useState('Unknown');
  const [staffRole, setStaffRole] = useState('Unknown');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.name) {
      setStaffName(user.name);
      setStaffRole(user.role);
    }
  }, []);

  const role = staffRole;
  const userName = stName;

  const onSubmit = handleSubmit(async (formData) => {
    let { staffList, campDates, paymentMode } = formData;

    if (role.toLowerCase() !== 'admin') {
      staffList = userName;
    }

    const url = `${config.BASE_URL}/amount-details?staffName=${staffList}&campDate=${campDates}&paymentMode=${paymentMode}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      const enrichedData: Entry[] = data.map((entry: any, index: number) => {
        const cash = parseFloat(entry.Cash_Amount || '0');
        const upi = parseFloat(entry.UPI_Amount || '0');
        const discount = parseFloat(entry.Discount_Amount || '0');

        return {
          id: index + 1,
          staffName: entry.Staff_Name || '',
          date: entry.Date || '',
          cashAmount: cash,
          upiAmount: upi,
          discountAmount: discount,
          totalAmount: cash + upi - discount,
          createdBy: entry.Created_By || '',
        };
      });

      setEntries(enrichedData);

      const cashAmount = enrichedData.reduce((sum, e) => sum + e.cashAmount, 0);
      const upiAmount = enrichedData.reduce((sum, e) => sum + e.upiAmount, 0);
      const totalAmount = enrichedData.reduce((sum, e) => sum + e.totalAmount, 0);

      setSummary({
        totalEntries: enrichedData.length,
        cashAmount,
        upiAmount,
        totalAmount,
      });
    } catch (error) {
      console.error('API Error:', error);
    }
  });

  const downloadCSV = () => {
    const headers = ['Staff Name', 'Date', 'Cash Amount', 'UPI Amount', 'Discount', 'Total Amount'];
    const rows = entries.map(e =>
      [e.staffName, e.date, e.cashAmount, e.upiAmount, e.discountAmount, e.totalAmount]
    );

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'amount-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;

    const html = `
      <html>
      <head><title>Amount Report</title></head>
      <body>
        <h2>Amount Report</h2>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Date</th>
              <th>Cash</th>
              <th>UPI</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${entries.map(e => `
              <tr>
                <td>${e.staffName}</td>
                <td>${e.date}</td>
                <td>${e.cashAmount}</td>
                <td>${e.upiAmount}</td>
                <td>${e.discountAmount}</td>
                <td>${e.totalAmount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          }
        </script>
      </body>
      </html>
    `;

    win.document.write(html);
    win.document.close();
  };

  return (
    <Card>
      <CardHeader title="Amount Report" />
      <Divider />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid2 container spacing={2} sx={{ p: 3 }}>
          {role === 'Admin' && (
            <Grid2 size={{ xs: 12, md: 2 }}>
              <Field.Select name="staffList" label="Staff List" size="small" required>
                <MenuItem value="All">All</MenuItem>
                {staffList.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid2>
          )}
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Field.Select name="campDates" label="Camp Dates" size="small" required>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="09-10-2025">
                09-10-2025
              </MenuItem>
              <MenuItem value="10-10-2025">
                10-10-2025
              </MenuItem>
              <MenuItem value="11-10-2025">
                11-10-2025
              </MenuItem>

            </Field.Select>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Field.Select name="paymentMode" label="Payment Mode" size="small" required>
              <MenuItem value="All">All</MenuItem>
              {paymentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="outlined" color="primary" disabled={isSubmitting}>
                Show Entries
              </Button>
              <Button variant="outlined" color="secondary" disabled={isSubmitting} onClick={handleCancel}>
                Reset
              </Button>
            </Stack>
          </Grid2>
        </Grid2>
      </Form>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, py: 2 }}>
          <Typography variant="subtitle2">Total entries: {summary.totalEntries}</Typography>
          <Typography variant="subtitle2">Cash Amount: {summary.cashAmount.toFixed()}</Typography>
          <Typography variant="subtitle2">UPI Amount: {summary.upiAmount.toFixed()}</Typography>
          <Typography variant="subtitle2">Total Amount: {summary.totalAmount.toFixed()}</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={downloadCSV} disabled={!entries.length}>Download CSV</Button>
          <Button variant="outlined" onClick={downloadPDF} disabled={!entries.length}>Download PDF</Button>
        </Stack>
      </Box>

      <DataGrid
        disableRowSelectionOnClick
        rows={entries}
        columns={columns}
        getRowHeight={() => 40}
        pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{
          [`& .${gridClasses.cell}`]: {
            alignItems: 'center',
            display: 'inline-flex',
          },
        }}
      />
    </Card>
  );
};

export default AmountReport;