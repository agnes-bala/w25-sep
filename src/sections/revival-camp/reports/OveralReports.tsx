'use client';

// import Grid2 from '@mui/material/Unstable_Grid2';
import type { GridColDef } from '@mui/x-data-grid';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid2,
  MenuItem,
  TextField,
} from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { config } from 'src/constants/helpers';

import { Field, Form } from 'src/components/hook-form';

import {
  RenderCellCreatedAt,
} from 'src/sections/product/product-table-row';
import { paymentOptions } from 'src/constants/selectoptions';

const OverallReports = () => {
  const [staffList, setStaffList] = useState<string[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const defaultValues = {
    staffList: 'All',
    campDates: 'All',
    paymentMode: 'All',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  // const user = JSON.parse(localStorage.getItem('user') || '{}');
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

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}/staffNames`)
      .then((res) => setStaffList(res.data))
      .catch((err) => console.error('Failed to fetch staff names', err));
  }, []);

  const fetchData = async (staffName: string, campDate: string, paymentMode: string) => {
    setLoading(true);
    try {
      // For non-admin users, always use their own name regardless of the form input
      if (role !== 'Admin') {
        staffName = staffName; // This should be the current user's name
      }

      const response = await axios.get(
        `${config.BASE_URL}/report?staffName=${staffName}&campDate=${campDate}&paymentMode=${paymentMode}`
      );
      const data = response.data || [];
      const formatted = data.map((item: any, index: number) => ({
        id: index + 1,
        name: item.Partner_Name,
        mobileNumber: item.Mobile_Number,
        country: item.Country,
        state: item.State,
        district: item.district,
        // extraMale: item.ExtraMale,
        // ChurchName: item.ChurchName,
        femaleChild: item.femaleChild,
        maleChild: item.maleChild,
        extraFemale: item.Extra_Female,
        // infant: item.Infant,
        // extraChild: item.Extra_Child,
        day1: item.Day1,
        day2: item.Day2,
        amount: item.amount,
        discount: item.discount,
        paymentMode: item.payment_mode,
        cashAmount: item.Cash_Amount,
        upiAmount: item.Upi_Amount,
        upiRef: item.Upi_Ref_Number,
        createdAt: item.Created_At,
        createdBy: item.Created_By || 'N/A',
      }));
      setEntries(formatted);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    // For non-admin users, pass their name instead of the form value
    const staffNameToUse = role !== 'Admin' ? staffName : data.staffList;
    await fetchData(staffNameToUse, data.campDates, data.paymentMode);
  });

  const handleCancel = () => {
    methods.reset();
    setEntries([]);
    setSearchTerm('');
  };

  const filteredEntries = entries.filter((entry) =>
    Object.values(entry).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Partner Name', minWidth: 140 },
    { field: 'mobileNumber', headerName: 'Mobile Number', width: 140 },
    { field: 'state', headerName: 'State', width: 100 },
    { field: 'district', headerName: 'District', width: 100 },
    { field: 'extraFemale', headerName: 'Female', width: 120 },
    { field: 'maleChild', headerName: 'Male Child', width: 120 },
    { field: 'femaleChild', headerName: 'Female Child', width: 120 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'discount', headerName: 'Discount', width: 100 },
    { field: 'paymentMode', headerName: 'Mode', width: 100 },
    { field: 'upiRef', headerName: 'UPI NO', width: 100 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    { field: 'createdBy', headerName: 'Created By', width: 120 },
  ];


  return (
    <Card>
      <CardHeader title="Visitor Entries Report" />
      <Divider />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid2 container spacing={2} sx={{ p: 3 }}>
          {role === 'Admin' && (
            // <Grid2  xs={12} md={3}>
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
              {/* Add actual camp date options here */}
              <MenuItem value="09-10-2025">09-10-2025</MenuItem>
              <MenuItem value="10-10-2025">10-10-2025</MenuItem>
              <MenuItem value="11-10-2025">11-10-2025</MenuItem>
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
          <Grid2 size={{ xs: 12, md: 3 }}>
            <TextField
              size="small"
              label="Search"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 3 }} display="flex" alignItems="center" gap={1}>
            <Button type="submit" variant="contained" disabled={isSubmitting || loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
            <Button onClick={handleCancel} variant="outlined" color="secondary">
              Reset
            </Button>
          </Grid2>
        </Grid2>
      </Form>
      <Divider />
      <Box p={2}>
        <DataGrid
          rows={filteredEntries}
          columns={columns}
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
        />
      </Box>
    </Card>
  );
};

export default OverallReports;