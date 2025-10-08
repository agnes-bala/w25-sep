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
import { CONFIG } from 'src/global-config';

const CheckReport = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const defaultValues = {
    staffList: 'All',
    campDates: 'All',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
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

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${CONFIG.serverUrl}/onlineReport`);
      const data = response.data || [];
      const formatted = data.map((item: any) => ({
        id: Number(item.id),
        title: item.title || 'N/A',
        full_name: item.full_name?.trim() || 'N/A',
        mobile_number: item.mobile_number || 'N/A',
        addr1: item.addr1 || 'N/A',
        addr2: item.addr2 || 'N/A',
        city: item.city || 'N/A',
        country: item.country || 'N/A',
        state: item.state || 'N/A',
        district: item.district || 'N/A',
        pincode: item.pincode || 'N/A',
        created_by: item.created_by || 'N/A',
        created_at: item.created_at || 'N/A',
        id_generate: item.id_generate || 'N/A',
        is_attended: item.is_attended || 'no',
        payment_mode: item.payment_mode || 'N/A',
        amount: item.amount || '0',
        discount: item.discount || '0',
        extra_male: item.extra_male || '0',
        extra_female: item.extra_female || '0',
        male_child: item.male_child || '0',
        female_child: item.female_child || '0',
        upi_number: item.upi_number || 'N/A',
        under_7: item.under_7 || '0'
      }));
      setEntries(formatted);
    } catch (error) {
      console.error('Error fetching partner data:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async () => {
    await fetchData();
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
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    // {
    //   field: 'id_generate',
    //   headerName: 'Generated ID',
    //   width: 100,
    // },
    {
      field: 'title',
      headerName: 'Title',
      width: 80,
    },
    {
      field: 'full_name',
      headerName: 'Full Name',
      minWidth: 150,
      // flex: 1
    },
    {
      field: 'mobile_number',
      headerName: 'Mobile Number',
      width: 130
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 100
    },
    {
      field: 'state',
      headerName: 'State',
      width: 120
    },
    {
      field: 'district',
      headerName: 'District',
      width: 120
    },
    {
      field: 'city',
      headerName: 'City',
      width: 100
    }, 
  ];

  return (
    <Card>
      <CardHeader title="Online Entries" />
      <Divider />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid2 container spacing={2} sx={{ p: 3 }}>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <TextField
              size="small"
              label="Search"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search all fields..."
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 3 }} display="flex" alignItems="center" gap={1}>
            <Button type="submit" variant="contained" disabled={isSubmitting || loading}>
              {loading ? <CircularProgress size={24} /> : 'Load Partners'}
            </Button>
            <Button onClick={handleCancel} variant="outlined" color="secondary">
              Reset
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }} display="flex" alignItems="center" justifyContent="flex-end">
            <Chip
              label={`Total Records: ${filteredEntries.length}`}
              color="primary"
              variant="outlined"
            />
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
          pageSizeOptions={[5, 10, 20, 50, { value: -1, label: 'All' }]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: {
              sortModel: [{ field: 'id', sort: 'asc' }],
            },
          }}
          sx={{
            [`& .${gridClasses.cell}`]: {
              alignItems: 'center',
              display: 'inline-flex',
              whiteSpace: 'normal',
              wordWrap: 'break-word'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
            }
          }}
          autoHeight
        />
      </Box>
    </Card>
  );
};

export default CheckReport;