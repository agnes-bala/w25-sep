'use client';

import type { GridColDef } from '@mui/x-data-grid';

import { useForm } from 'react-hook-form';

import { Box, Button, Card, CardHeader, Divider, Grid2, MenuItem, Typography } from '@mui/material';
// eslint-disable-next-line perfectionist/sort-imports
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paymentOptions } from 'src/constants/selectoptions';

import { Field, Form } from 'src/components/hook-form';

import {
  RenderCellAmount,
  RenderCellCreatedAt,
  RenderCellDiscount,
} from 'src/sections/product/product-table-row';

const MyEntries = () => {
  const defaultValues = {
    campDates: 'All',
    paymentMode: 'All',
  };
  const methods = useForm({
    mode: 'all',
    // resolver: zodResolver(checkInPartnerSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    console.info(data);
  });
  const entries = [
    {
      id: 1,
      name: 'John Smith',
      mobileNumber: '9876543210',
      country: 'India',
      state: 'Karnataka',
      members: 5,
      amount: '1000',
      discount: 0,
      paymentMode: 'Cash',
      createdAt: '2025-05-02 11:07:00',
    },
    {
      id: 2,
      name: 'Jane Smith',
      mobileNumber: '9876543210',
      country: 'India',
      state: 'Karnataka',
      members: 5,
      amount: '1000',
      discount: 0,
      paymentMode: 'Cash',
      createdAt: '2025-05-02 11:07:00',
    },
  ];
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Partner Name',
      minWidth: 140,
      hideable: false,
    },
    {
      field: 'mobileNumber',
      headerName: 'Mobile Number',
      width: 140,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 120,
    },
    {
      field: 'state',
      headerName: 'State',
      width: 120,
    },
    {
      field: 'members',
      headerName: 'Members',
      width: 100,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 100,
      renderCell: (params) => <RenderCellAmount params={params} />,
    },
    {
      field: 'discount',
      headerName: 'Discount',
      width: 100,
      renderCell: (params) => <RenderCellDiscount params={params} />,
    },
    {
      field: 'paymentMode',
      headerName: 'Payment Mode',
      width: 120,
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
  ];
  return (
    <Card>
      <CardHeader title="My Entries" />
      <Divider />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid2 container spacing={2} sx={{ p: 3 }}>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <Field.Select name="campDates" label="Camp Dates" size="small" required>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="29-05-2025">29-05-2025</MenuItem>
              <MenuItem value="30-05-2025">30-05-2025</MenuItem>
              <MenuItem value="31-05-2025">31-05-2025</MenuItem>
              {/* <MenuItem value="05-05-2025">05-05-2025</MenuItem>
              <MenuItem value="06-05-2025">06-05-2025</MenuItem>
              <MenuItem value="07-05-2025">07-05-2025</MenuItem>
              <MenuItem value="08-05-2025">08-05-2025</MenuItem>
              <MenuItem value="09-05-2025">09-05-2025</MenuItem>
              <MenuItem value="10-05-2025">10-05-2025</MenuItem> */}
            </Field.Select>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 3 }}>
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
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              Show Entries
            </Button>
          </Grid2>
        </Grid2>
      </Form>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', px: 3 }}>
        <Typography variant="subtitle2" sx={{ pb: 2, pr: 3 }}>
          Total entries: 2
        </Typography>
        <Typography variant="subtitle2" sx={{ pb: 2, pr: 3 }}>
          Cash Amount: 200.00
        </Typography>
        <Typography variant="subtitle2" sx={{ pb: 2, pr: 3 }}>
          UPI Amount: 200.00
        </Typography>
        <Typography variant="subtitle2" sx={{ pb: 2 }}>
          Total Amount: 200.00
        </Typography>
      </Box>
      <DataGrid
        // checkboxSelection
        disableRowSelectionOnClick
        rows={entries}
        columns={columns}
        // loading={entriesLoading}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        // onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
        // columnVisibilityModel={columnVisibilityModel}
        // onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
        // slots={{
        //   toolbar: CustomToolbarCallback,
        //   noRowsOverlay: () => <EmptyContent />,
        //   noResultsOverlay: () => <EmptyContent title="No results found" />,
        // }}
        // slotProps={{
        //   toolbar: { setFilterButtonEl },
        //   panel: { anchorEl: filterButtonEl },
        //   columnsManagement: { getTogglableColumns },
        // }}
        sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
      />
    </Card>
  );
};

export default MyEntries;
