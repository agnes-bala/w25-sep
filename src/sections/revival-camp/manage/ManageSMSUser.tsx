// 'use client';

// import {
//   Button,
//   Card,
//   CardHeader,
//   Divider,
//   Grid,
//   IconButton,
//   InputAdornment,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TableFooter,
//   TablePagination,
//   MenuItem,
//   Box,
//   Typography,
// } from '@mui/material';
// import { useBoolean } from 'minimal-shared/hooks';
// import { useForm } from 'react-hook-form';
// import { Field, Form } from 'src/components/hook-form';
// import { Iconify } from 'src/components/iconify';
// import { Label } from 'src/components/label';
// import axios from 'axios';

// import { useEffect, useState } from 'react';
// import { config } from 'src/constants/helpers';
// import { toast } from 'sonner';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { smsSchema } from 'src/constants/schema';


// type FormData = {
//   id?: string;
//   user_name: string;
//   mobile_number: string;
//   status?: string;
// };

// type SMSUser = {
//   id: string;
//   user_name: string;
//   mobile_number: string;
//   status: string;
// };

// const ManageSMSUser = () => {
//   const showPassword = useBoolean();
//   const [smsUserList, setSmsUserList] = useState<SMSUser[]>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   const defaultValues: FormData = {
//     user_name: '',
//     mobile_number: '',
//     status: 'Active',
//   };

//   const methods = useForm<FormData>({
//     mode: 'all',
//     resolver: zodResolver(smsSchema),
//     defaultValues,
//   });

//   const {
//     handleSubmit,
//     formState: { isSubmitting },
//     reset,
//     setValue,
//   } = methods;

//   const fetchSMSUserList = async () => {
//     try {
//       const response = await axios.get<SMSUser[]>(`${config.BASE_URL}/listSmsUser`);
//       setSmsUserList(response.data);
//       console.log(response, 'response');
//     } catch (error) {
//       //need to apply position for the toast at top-right 
//       toast.error('Failed to fetch SMS user list');
//       console.error('Fetch SMS User List Error:', error);
//     }
//   };

//   useEffect(() => {
//     fetchSMSUserList();
//   }, []);

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       // const user = JSON.parse(localStorage.getItem('user') || '{}');
//       const [staffName, setStaffName] = useState('Unknown');

//       useEffect(() => {
//         const user = JSON.parse(localStorage.getItem('user') || '{}');
//         if (user?.name) {
//           setStaffName(user.name);
//         }
//       }, []);

//       const createdOrUpdatedBy = staffName;

//       if (editingId) {
//         await axios.put(`${config.BASE_URL}/editSms/${editingId}`, {
//           ...data,
//           updated_by: createdOrUpdatedBy,
//         });
//         toast.success('SMS User updated successfully');
//       } else {
//         await axios.post(`${config.BASE_URL}/addSmsUser`, {
//           ...data,
//           created_by: createdOrUpdatedBy,
//         });
//         toast.success('SMS User added successfully');
//       }
//       reset();
//       setEditingId(null);
//       fetchSMSUserList();
//     } catch (error: any) {
//       const errorMessage = error.response?.data || 'Failed to add/update SMS user';
//       console.log(errorMessage, 'errorMessage');
//       toast.error(errorMessage);
//       console.error('Error:', error);
//     }
//   });

//   const handleEdit = async (id: string) => {
//     try {
//       const response = await axios.get<FormData>(`${config.BASE_URL}/smsUserId/${id}`);
//       const smsUser = response.data;

//       setValue('user_name', smsUser.user_name);
//       setValue('mobile_number', smsUser.mobile_number);
//       setValue('status', smsUser.status);

//       setEditingId(id);
//     } catch (error) {
//       toast.error('Failed to fetch SMS user details');
//       console.error('Edit Error:', error);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await axios.delete(`${config.BASE_URL}/delete/${id}`);
//       fetchSMSUserList();
//       toast.info('Delete Success');
//     } catch (error: any) {
//       const errorMessage = error.response?.data || 'Failed to delete SMS user';
//       toast.error(errorMessage);
//       console.error('Delete Error:', error);
//     }
//   };

//   const handleChangePage = (_: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <Grid container spacing={2}>

//       {/* Form Section */}
//       <Grid item xs={12} md={6}>
//         <Card>
//           <CardHeader title={editingId ? 'Edit SMS User' : 'Add SMS User'} />
//           <Divider />
//           <Form methods={methods} onSubmit={onSubmit}>
//             <Grid container spacing={3} sx={{ p: 3 }}>
//               <Grid item xs={12}>
//                 <Field.Text name="user_name" label="User Name" size="small" />
//               </Grid>
//               <Grid item xs={12}>
//                 <Field.Text name="mobile_number" label="Mobile Number" size="small" />
//               </Grid>
//               <Grid item xs={12}>
//                 <Field.Select name="status" label="Status" size="small">
//                   <MenuItem value="Active">Active</MenuItem>
//                   <MenuItem value="Inactive">Inactive</MenuItem>
//                 </Field.Select>
//               </Grid>
//               <Grid item xs={12}>
//                 <Button type="submit" disabled={isSubmitting} variant="contained" fullWidth>
//                   {isSubmitting ? 'Saving...' : editingId ? 'Update SMS User' : 'Add SMS User'}
//                 </Button>

//               </Grid>


//             </Grid>
//           </Form>
//         </Card>
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <Card>
//           <CardHeader title="SMS Users List" />
//           <Divider />
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>User Name</TableCell>
//                   <TableCell>Mobile Number</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {smsUserList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
//                   <TableRow key={user.id}>
//                     <TableCell>{user.user_name}</TableCell>
//                     <TableCell>{user.mobile_number}</TableCell>
//                     <TableCell>
//                       <Label color={user.status === 'Active' ? 'success' : 'error'}>
//                         {user.status}
//                       </Label>
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         color="warning"
//                         onClick={() => handleEdit(user.id)}
//                         disabled={isSubmitting}
//                       >
//                         Edit
//                       </Button>

//                       <Button
//                         color="error"
//                         onClick={() => handleDelete(user.id)}
//                         style={{ marginLeft: '8px' }}
//                       >
//                         Delete
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//               <TableFooter>
//                 <TableRow>
//                   <TableCell colSpan={4}>
//                     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                       <TablePagination
//                         rowsPerPageOptions={[5, 10, 25]}
//                         count={smsUserList.length}
//                         rowsPerPage={rowsPerPage}
//                         page={page}
//                         onPageChange={handleChangePage}
//                         onRowsPerPageChange={handleChangeRowsPerPage}
//                       />
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               </TableFooter>
//             </Table>
//           </TableContainer>
//         </Card>
//       </Grid>

//     </Grid>
//   );
// };

// export default ManageSMSUser;

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
  TableRow,
  TableFooter,
  TablePagination,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { useBoolean } from 'minimal-shared/hooks';
import { useForm } from 'react-hook-form';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import axios from 'axios';

import { useEffect, useState } from 'react';
import { config } from 'src/constants/helpers';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { smsSchema } from 'src/constants/schema';

type FormData = {
  id?: string;
  user_name: string;
  mobile_number: string;
  status?: string;
};

type SMSUser = {
  id: string;
  user_name: string;
  mobile_number: string;
  status: string;
};

const ManageSMSUser = () => {
  const showPassword = useBoolean();
  const [smsUserList, setSmsUserList] = useState<SMSUser[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('Unknown');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.name) {
      setStaffName(user.name);
    }
  }, []);

  const defaultValues: FormData = {
    user_name: '',
    mobile_number: '',
    status: 'Active',
  };

  const methods = useForm<FormData>({
    mode: 'all',
    resolver: zodResolver(smsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;

  const fetchSMSUserList = async () => {
    try {
      const response = await axios.get<SMSUser[]>(`${config.BASE_URL}/listSmsUser`);
      setSmsUserList(response.data);
      console.log(response, 'response');
    } catch (error) {
      toast.error('Failed to fetch SMS user list');
      console.error('Fetch SMS User List Error:', error);
    }
  };

  useEffect(() => {
    fetchSMSUserList();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const createdOrUpdatedBy = staffName;

      if (editingId) {
        await axios.put(`${config.BASE_URL}/editSms/${editingId}`, {
          ...data,
          updated_by: createdOrUpdatedBy,
        });
        toast.success('SMS User updated successfully');
      } else {
        await axios.post(`${config.BASE_URL}/addSmsUser`, {
          ...data,
          created_by: createdOrUpdatedBy,
        });
        toast.success('SMS User added successfully');
      }
      reset();
      setEditingId(null);
      fetchSMSUserList();
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Failed to add/update SMS user';
      console.log(errorMessage, 'errorMessage');
      toast.error(errorMessage);
      console.error('Error:', error);
    }
  });

  const handleEdit = async (id: string) => {
    try {
      const response = await axios.get<FormData>(`${config.BASE_URL}/smsUserId/${id}`);
      const smsUser = response.data;

      setValue('user_name', smsUser.user_name);
      setValue('mobile_number', smsUser.mobile_number);
      setValue('status', smsUser.status);

      setEditingId(id);
    } catch (error) {
      toast.error('Failed to fetch SMS user details');
      console.error('Edit Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${config.BASE_URL}/delete/${id}`);
      fetchSMSUserList();
      toast.info('Delete Success');
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Failed to delete SMS user';
      toast.error(errorMessage);
      console.error('Delete Error:', error);
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
          <CardHeader title={editingId ? 'Edit SMS User' : 'Add SMS User'} />
          <Divider />
          <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3} sx={{ p: 3 }}>
              <Grid item xs={12}>
                <Field.Text name="user_name" label="User Name" size="small" />
              </Grid>
              <Grid item xs={12}>
                <Field.Text name="mobile_number" label="Mobile Number" size="small" />
              </Grid>
              <Grid item xs={12}>
                <Field.Select name="status" label="Status" size="small">
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Field.Select>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" disabled={isSubmitting} variant="contained" fullWidth>
                  {isSubmitting ? 'Saving...' : editingId ? 'Update SMS User' : 'Add SMS User'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="SMS Users List" />
          <Divider />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {smsUserList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.user_name}</TableCell>
                    <TableCell>{user.mobile_number}</TableCell>
                    <TableCell>
                      <Label color={user.status === 'Active' ? 'success' : 'error'}>
                        {user.status}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="warning"
                        onClick={() => handleEdit(user.id)}
                        disabled={isSubmitting}
                      >
                        Edit
                      </Button>

                      <Button
                        color="error"
                        onClick={() => handleDelete(user.id)}
                        style={{ marginLeft: '8px' }}
                      >
                        Delete
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
                        count={smsUserList.length}
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
                      count={smsUserList.length}
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

export default ManageSMSUser;