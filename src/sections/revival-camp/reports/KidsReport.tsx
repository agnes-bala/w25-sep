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

import { RenderCellCreatedAt } from 'src/sections/product/product-table-row';

type KidEntry = {
  id: number;
  parent: string;
  name: string;
  mobileNumber: string;
  country: string;
  state: string;
  district: string;
  age: number;
  gender: string;
  createdAt: string;
  createdBy: string;
};

const KidsReport = () => {
  const [entries, setEntries] = useState<KidEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<string[]>([]);

  const defaultValues = {
    staffList: 'All',
    campDates: 'All',
  };
  useEffect(() => {
    axios.get(`${config.BASE_URL}/staffNames`
    )
      .then(res => {
        setStaffList(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch staff names', err);
      });
  }, []);

  const [staffRole, setStaffRole] = useState('Unknown');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.name) {
      setStaffRole(user.role);
    }
  }, []);

  const role = staffRole;

  const methods = useForm({ mode: 'all', defaultValues });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fetchKidsData = async (staffName: string, campDate: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.BASE_URL}/kids?campDate=${campDate}&staffName=${staffName}`
      );
      const data = response.data || [];
      const formatted = data.map((item: any, index: number) => ({
        id: index + 1,
        parent: item.parentName,
        name: item.childName,
        mobileNumber: item.mobileNumber,
        country: item.country,
        state: item.state,
        district: item.district,
        age: item.childAge,
        gender: item.childGender,
        createdAt: item.createdAt,
        createdBy: item.createdBy || 'N/A',
      }));
      setEntries(formatted);
    } catch (error) {
      console.error('Error fetching kids data:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    await fetchKidsData(data.staffList, data.campDates);
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
    { field: 'parent', headerName: 'Parent Name', minWidth: 140 },
    { field: 'name', headerName: 'Child Name', minWidth: 140 },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 120,
      renderCell: (params) => {
        const gender = params.value?.toLowerCase();
        const color = gender === 'male' ? '#b9e2f5' : '#cdc6ff'; // blue / pink
        return (
          <Chip
            label={gender.charAt(0).toUpperCase() + gender.slice(1)}
            style={{
              backgroundColor: color,
              color: '#000000',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          />
        );
      },
    },
    { field: 'mobileNumber', headerName: 'Mobile Number', width: 140 },
    { field: 'country', headerName: 'Country', width: 120 },
    { field: 'state', headerName: 'State', width: 120 },
    {
      field: 'district',
      headerName: 'District',
      width: 120,
      // renderCell: (params) => <RenderCellAmount params={params} />,
    },
    { field: 'age', headerName: 'Age', width: 100 },


    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 180,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    { field: 'createdBy', headerName: 'Created by', width: 140 },
  ];

  return (
    <Card>
      <CardHeader title="Kids Report" />
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
              {[
                '02-05-2025',
                '03-05-2025',
                '04-05-2025',
                '05-05-2025',
                '06-05-2025',
                '07-05-2025',
                '08-05-2025',
                '09-05-2025',
                '10-05-2025',
              ].map((date) => (
                <MenuItem key={date} value={date}>
                  {date}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid2>


          <Grid2 size={{ xs: 12, md: 3 }} display="flex" alignItems="center">
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              Show Entries
            </Button>
            <Button
              onClick={handleCancel}
              variant="outlined"
              color="error"
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search entries..."
              size="small"
            />
          </Grid2>
        </Grid2>
      </Form>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={filteredEntries}
          columns={columns}
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={{
            [`& .${gridClasses.cell}`]: {
              alignItems: 'center',
              display: 'inline-flex',
            },
            p: 2,
          }}
        />
      )}
    </Card>
  );
};

export default KidsReport;
