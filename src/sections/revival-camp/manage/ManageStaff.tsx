'use client';

import {
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  MenuItem,
  TableFooter,
  TableRow,
  TablePagination,
} from '@mui/material';
import { useBoolean } from 'minimal-shared/hooks';
import { useForm } from 'react-hook-form';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import axios from 'axios';
import { roleOptions } from 'src/constants/selectoptions';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { config } from 'src/constants/helpers';
import { staffSchema } from 'src/constants/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

type FormData = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

type Staff = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
};

const ManageStaff = () => {
  const showPassword = useBoolean();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('Unknown');

  const defaultValues: FormData = {
    name: '',
    email: '',
    password: '',
    role: '',
  };

  const methods = useForm<FormData>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(staffSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;

  const fetchStaffList = async () => {
    try {
      const response = await axios.get<Staff[]>(`${config.BASE_URL}/listStaff`);
      setStaffList(response.data);
    } catch (error) {
      toast.error('Failed to fetch staff list');
      // alert(error);
      console.error('Fetch Staff List Error:', error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.name) {
      setStaffName(user.name);
    }
  }, []);

  useEffect(() => {
    fetchStaffList();
  }, []);


  const onSubmit = handleSubmit(async (data) => {
    try {
      const createdOrUpdatedBy = staffName; // Now we can use the state value directly

      if (editingId) {
        await axios.put(`${config.BASE_URL}/edit/${editingId}`, {
          ...data,
          updated_byy: createdOrUpdatedBy,
        });
        toast.success('Staff updated successfully');
      } else {
        await axios.post(`${config.BASE_URL}/register`, {
          ...data,
          created_by: createdOrUpdatedBy,
        });
        toast.success('Staff added successfully');
      }

      reset();
      setEditingId(null);
      fetchStaffList();
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Failed to add/update staff';
      toast.error(errorMessage);
      console.error('Error:', error);
    }
  });


  const handleEdit = async (id: string) => {
    try {
      const response = await axios.get<FormData>(`${config.BASE_URL}/staffId/${id}`);
      const staff = response.data;

      setValue('name', staff.name);
      setValue('email', staff.email);
      setValue('password', staff.password);
      setValue('role', staff.role);

      setEditingId(id);
      setEditingName(staff.name);
    } catch (error) {
      toast.error('Failed to fetch staff details');
      console.error('Edit Error:', error);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={2}>
      {/* Form Section */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title={editingId ? `Edit Staff (${editingName})` : 'Add Staff'} />
          <Divider />
          <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3} sx={{ p: 3 }}>
              <Grid item xs={12}>
                <Field.Text name="name" label="Staff Name" size="small" />
              </Grid>
              <Grid item xs={12}>
                <Field.Text name="email" label="Staff Mail" size="small" />
              </Grid>
              <Grid item xs={12}>
                <Field.Text
                  name="password"
                  label="Staff Password"
                  size="small"
                  type={showPassword.value ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={showPassword.onToggle} edge="end">
                          <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field.Select name="role" label="Staff Role" size="small" required>
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" disabled={isSubmitting} variant="contained" fullWidth>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Staff' : 'Add Staff'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Staff List" />
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Staff Name</TableCell>
                  <TableCell>Staff Email</TableCell>
                  <TableCell>Staff Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>
                      <Label color={staff.role === 'Admin' ? 'error' : 'success'}>
                        {staff.role}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="warning"
                        onClick={() => handleEdit(staff.id)}
                        disabled={isSubmitting}
                      >
                        Edit
                      </Button>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        count={staffList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter> */}

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} style={{ padding: 0 }}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={staffList.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '100%'
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ManageStaff;