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
  Typography,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { config } from 'src/constants/helpers';

import { Field, Form } from 'src/components/hook-form';


type Entry = {
  id: number;
  staffName: string;
  date: string;
  amount: number;
  paymentMode: string;
  discountAmount: number;
  totalAmount: number;
  createdBy: string;
};


const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = hours.toString().padStart(2, '0');

  return `${day}-${month}-${year} : ${hoursStr}:${minutes} ${ampm}`;
};


const MyEntries = () => {
  const [staffList, setStaffList] = useState<string[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [summary, setSummary] = useState({
    totalEntries: 0,
    cashAmount: 0,
    upiAmount: 0,
    totalAmount: 0,
  });

  const [staffRole, setStaffRole] = useState('Unknown');
  const [staffName, setStaffName] = useState('Unknown');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.name) {
      setStaffRole(user.role);
      setStaffName(user.name);
    }
  }, []);


  const role = staffRole || 'Unknown';

  const columns: GridColDef[] = [
    { field: 'staffName', headerName: 'Staff Name', minWidth: 140 },
    // { field: 'amount', headerName: 'Amount', width: 120, type: 'number' },
    { field: 'paymentMode', headerName: 'Mode', width: 120 },
    { field: 'discountAmount', headerName: 'Discount', width: 140, type: 'number' },
    { field: 'totalAmount', headerName: 'Total Amount', width: 140, type: 'number' },
    { field: 'date', headerName: 'Created On', width: 240 },
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

  useEffect(() => {
    axios.get(`${config.BASE_URL}/staffNames`)
      .then(res => {
        setStaffList(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch staff names', err);
      });
  }, []);

  const onSubmit = handleSubmit(async (formData) => {

    if (role !== 'Admin') {
      formData.staffList = staffName;
    }

    const { staffList, campDates, paymentMode } = formData;
    const url = `${config.BASE_URL}/food-details?staffName=${staffList}&campDate=${campDates}&paymentMode=${paymentMode}`;

    console.log(staffList, 'staffList');

    try {

      const response = await axios.get(url);
      const data = response.data;

      const enrichedData: Entry[] = data.map((entry: any, index: number) => {
        const amount = parseFloat(entry.Amount || '0');
        const discount = parseFloat(entry.Discount || '0');
        const total = parseFloat(entry.Total_Amount || '0');

        return {
          id: index + 1,
          staffName: entry.Staff_Name || '',
          date: entry.Created_At ? formatDate(entry.Created_At) : '',
          amount,
          paymentMode: entry.Payment_Mode || '',
          discountAmount: discount,
          totalAmount: total,
          createdBy: entry.Created_By || '',
        };
      });

      setEntries(enrichedData);

      const cashAmount = enrichedData.reduce(
        (sum, entry) =>
          entry.paymentMode.toLowerCase() === 'cash' ? sum + entry.totalAmount : sum,
        0
      );
      const upiAmount = enrichedData.reduce(
        (sum, entry) =>
          entry.paymentMode.toLowerCase() === 'upi' ? sum + entry.totalAmount : sum,
        0
      );
      const totalAmount = enrichedData.reduce((sum, entry) => sum + entry.totalAmount, 0);


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

  return (
    <Card>
      <CardHeader title="Food Report" />
      <Divider />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid2 container spacing={2} sx={{ p: 3 }}>

          {role === 'Admin' && (
            <Grid2 size={{ xs: 12, md: 3 }}>
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
          <Grid2 size={{ xs: 12, md: 3 }}>
            <Field.Select name="campDates" label="Camp Dates" size="small" required>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="24-06">24-06-2025</MenuItem>
              <MenuItem value="25-06">25-06-2025</MenuItem>
              <MenuItem value="26-06">26-06-2025</MenuItem>
            </Field.Select>
          </Grid2>
          {/* <Grid2 size={{ xs: 12, md: 3 }}>
            <Field.Select name="paymentMode" label="Payment Mode" size="small" required>
              <MenuItem value="All">All</MenuItem>
              {paymentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid2> */}
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              Show Entries
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 1 }}>
            <Button variant="contained" color="secondary" onClick={handleCancel}>
              Reset
            </Button>
          </Grid2>
        </Grid2>
      </Form>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', px: 3 }}>
        <Typography variant="subtitle2" sx={{ pb: 2, pr: 3 }}>
          Total entries: {summary.totalEntries}
        </Typography>
        <Typography variant="subtitle2" sx={{ pb: 2, pr: 3 }}>
          Cash Amount: {summary.cashAmount.toFixed()}
        </Typography>
        <Typography variant="subtitle2" sx={{ pb: 2, pr: 3 }}>
          UPI Amount: {summary.upiAmount.toFixed()}
        </Typography>
        <Typography variant="subtitle2" sx={{ pb: 2 }}>
          Total Amount: {summary.totalAmount.toFixed()}
        </Typography>
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

export default MyEntries;