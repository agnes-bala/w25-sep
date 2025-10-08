// /* eslint-disable perfectionist/sort-imports */
// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import LoadingButton from '@mui/lab/LoadingButton';
// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardHeader,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   Grid,
//   List,
//   ListItem,
//   ListItemText,
//   Snackbar,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   Typography,
//   useTheme,
// } from '@mui/material';
// import { useState, useRef, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { useQRCode } from 'next-qrcode';
// import { Field, Form } from 'src/components/hook-form';
// import { Iconify } from 'src/components/iconify';

// import { searchPartnerSchema } from 'src/constants/schema';
// import { config } from 'src/constants/helpers';

// interface Child {
//   id: string;
//   child_name: string;
//   child_age: number;
//   parent_name: string;
//   mobile_number: string;
//   child_gender: string;
// }

// export default function BindQR() {
//   const theme = useTheme();
//   const [children, setChildren] = useState<Child[]>([]);
//   const [selectedChildren, setSelectedChildren] = useState<Child[]>([]);
//   const [parentOptions, setParentOptions] = useState<Child[]>([]);
//   const [parentName, setParentName] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');
//   const [openError, setOpenError] = useState(false);
//   const [showSelectionModal, setShowSelectionModal] = useState(false);

//   const [filteredParents, setFilteredParents] = useState<Child[]>([]);
//   const [searchInput, setSearchInput] = useState('');
//   const [currentPage, setCurrentPage] = useState(0);
//   const pageSize = 5;


//   const qrRef = useRef<HTMLDivElement>(null);
//   const { Canvas } = useQRCode();

//   const methods = useForm<{ searchTerm: string }>({
//     mode: 'all',
//     resolver: zodResolver(searchPartnerSchema),
//     defaultValues: { searchTerm: '' },
//   });

//   const { handleSubmit, reset, formState: { isSubmitting } } = methods;

//   const onSubmit = handleSubmit(async ({ searchTerm }) => {
//     try {
//       const { data } = await axios.get<Child[]>(
//         `${config.BASE_URL}/kidsDetails?input=${encodeURIComponent(searchTerm)}`
//       );

//       setChildren(data);

//       const uniqueParents = Array.from(
//         new Map(data.map(item => [`${item.parent_name}-${item.mobile_number}`, item])).values()
//       );

//       if (uniqueParents.length === 1) {
//         const { parent_name, mobile_number } = uniqueParents[0];
//         setParentName(parent_name);
//         setMobileNumber(mobile_number);
//         setSelectedChildren(
//           data.filter(child => child.parent_name === parent_name && child.mobile_number === mobile_number)
//         );
//       } else {
//         setParentOptions(uniqueParents);
//         setFilteredParents(uniqueParents);
//         setCurrentPage(0);
//         setShowSelectionModal(true);
//       }
//     } catch (err: any) {
//       console.error(err);
//       setErrorMsg(err.response?.data?.message || err.message || 'Failed to load partner');
//       setOpenError(true);
//       setChildren([]);
//       setParentName('');
//       setMobileNumber('');
//     }
//   });

//   useEffect(() => {
//     const filtered = parentOptions.filter(p =>
//       p.parent_name.toLowerCase().includes(searchInput.toLowerCase()) ||
//       p.mobile_number.includes(searchInput)
//     );
//     setFilteredParents(filtered);
//     setCurrentPage(0);
//   }, [searchInput, parentOptions]);


//   const handleParentSelect = (parent: Child) => {
//     const { parent_name, mobile_number } = parent;
//     setParentName(parent_name);
//     setMobileNumber(mobile_number);
//     setSelectedChildren(
//       children.filter(c => c.parent_name === parent_name && c.mobile_number === mobile_number)
//     );
//     setShowSelectionModal(false);
//   };

//   const handleCancel = () => {
//     reset();
//     setChildren([]);
//     setSelectedChildren([]);
//     setParentName('');
//     setMobileNumber('');
//     setErrorMsg('');
//     setOpenError(false);
//   };

//   const handleCloseError = (_: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') return;
//     setOpenError(false);
//   };

//   const handlePrint = async (list: Child[]) => {
//     const eligible = list.filter(c => c.child_age >= 9 && c.child_age <= 14);
//     if (!eligible.length) return;

//     const printWindow = window.open('', '_blank');
//     if (!printWindow) return;

//     const qrDataUrls = eligible.map(child => {
//       const wrapper = qrRef.current?.querySelector(`div[data-childid="${child.id}"]`);
//       const canvas = wrapper?.querySelector('canvas');
//       return canvas ? canvas.toDataURL() : '';
//     });

//     printWindow.document.write(`
//       <html>
//         <head>
//           <style>
//             @page { size: 50mm 50mm; margin:0 }
//             body {
//               margin:0; padding:0;
//               font-family:Arial,sans-serif;
//               display:flex; flex-wrap:wrap;
//               justify-content:center;
//             }
//             .label {
//               width:50mm; height:50mm;
//               display:flex; flex-direction:column;
//               align-items:center; justify-content:center;
//               text-align:center; overflow:hidden;
//             }
//             .qr { width:100px; height:100px; object-fit:contain }
//             .name { font-size:14px; font-weight:bold }
//             .id { font-size:12px }
//           </style>
//         </head>
//         <body>
//           ${eligible.map((child, index) => `
//             <div class="label">
//               <img src="${qrDataUrls[index]}" class="qr"/>
//               <div class="name">${child.child_name}</div>
//               <div class="id">${child.mobile_number}</div>
//             </div>`).join('')}
//           <script>window.onload = () => window.print();</script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   return (
//     <>
//       <Form methods={methods} onSubmit={onSubmit}>
//         <Card elevation={3} sx={{ borderRadius: 2 }}>
//           <CardHeader title={<Stack direction="row" alignItems="center" gap={1}><Iconify icon="material-symbols:search" width={24} /><Typography variant="h6">Search Child</Typography></Stack>} />
//           <Divider />
//           <Grid container spacing={2} sx={{ p: 3 }}>
//             <Grid item xs={12} md={6} lg={3}>
//               <Field.Text name="searchTerm" label="Mobile Number" placeholder="Enter mobile number to search" autoFocus required type="tel" size="small" InputProps={{ startAdornment: (<Iconify icon="solar:phone-bold" width={20} sx={{ mr: 1, color: 'text.disabled' }} />) }} />
//             </Grid>
//             <Grid item xs={12} md={2} lg={1}>
//               <LoadingButton startIcon={<Iconify icon="mingcute:search-3-line" />} type="submit" variant="contained" loading={isSubmitting} sx={{ py: 1.5, mt: 0.5 }} size='small' />
//             </Grid>
//             <Grid item xs={12} md={2} lg={1}>
//               <Button variant="outlined" fullWidth onClick={handleCancel} disabled={isSubmitting} color="error" size='small' startIcon={<Iconify icon="material-symbols:cancel-outline" />} sx={{ py: 1.5, mt: 0.5 }} />
//             </Grid>
//             <Grid item xs={12} md={6} lg={4}>
//               <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: parentName ? 'success.lighter' : 'grey.100', textAlign: 'center' }}>
//                 <Typography variant="subtitle1" color="text.primary">
//                   {parentName ? (
//                     <Stack direction="row" alignItems="center" gap={1} justifyContent="center">
//                       <Iconify icon="mdi:account-check" width={20} color={theme.palette.success.main} />
//                       <span>{parentName} – {mobileNumber}</span>
//                     </Stack>
//                   ) : (
//                     <Stack direction="row" alignItems="center" gap={1} justifyContent="center">
//                       <Iconify icon="mdi:account-remove" width={20} color="text.disabled" />
//                       <span>No partner loaded</span>
//                     </Stack>
//                   )}
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </Card>

//         <Card elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
//           <CardHeader title={<Stack direction="row" alignItems="center" gap={1}><Iconify icon="mdi:account-child" width={24} /><Typography variant="h6">Child Details</Typography></Stack>} />
//           <Divider />
//           <Grid container spacing={2} sx={{ p: 3 }}>
//             {selectedChildren.length > 0 ? (
//               selectedChildren.map((child) => (
//                 <Grid item xs={12} md={2} key={child.id}>
//                   <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
//                     <Stack direction="row" alignItems="center" gap={1.5}>
//                       <Iconify icon={child.child_gender === 'male' ? 'mdi:gender-male' : 'mdi:gender-female'} width={24} color={child.child_gender === 'female' ? theme.palette.info.main : theme.palette.warning.main} />
//                       <div>
//                         <Typography variant="subtitle1" fontWeight={600}>{child.child_name}</Typography>
//                         <Typography variant="body2" color="text.secondary">Age: {child.child_age}</Typography>
//                       </div>
//                     </Stack>
//                   </Card>
//                 </Grid>
//               ))
//             ) : (
//               <Grid item xs={12}>
//                 <Stack spacing={1} alignItems="center" sx={{ py: 4 }}>
//                   <Iconify icon="ion:sad-outline" width={40} color="text.disabled" />
//                   <Typography color="text.secondary" variant="body1">No children found!</Typography>
//                 </Stack>
//               </Grid>
//             )}
//           </Grid>

//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
//             <Button variant="contained" disabled={!selectedChildren.length} onClick={() => handlePrint(selectedChildren)} startIcon={<Iconify icon="material-symbols:print-outline" />} sx={{ px: 4, py: 1.5 }}>
//               Print QR
//             </Button>
//           </Box>
//         </Card>

//         <div ref={qrRef} style={{ display: 'none' }}>
//           {selectedChildren.map((child) => (
//             <div key={child.id} data-childid={child.id}>
//               <Canvas text={`${child.id}`} options={{ errorCorrectionLevel: 'M', margin: 2, scale: 4, width: 200, color: { dark: '#000000', light: '#FFFFFF' } }} />
//             </div>
//           ))}
//         </div>
//       </Form>

//       <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
//         <Alert severity="error" sx={{ width: '100%', bgcolor: 'error.lighter', color: 'error.dark', '& .MuiAlert-icon': { color: 'error.dark' } }}>
//           <Stack direction="row" alignItems="center" gap={1}>
//             <Iconify icon="material-symbols:error-outline" width={24} />
//             {errorMsg}
//           </Stack>
//         </Alert>
//       </Snackbar>

//       <Dialog open={showSelectionModal} onClose={() => setShowSelectionModal(false)} fullWidth maxWidth="sm">
//         <DialogTitle>Select Parent</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Search"
//             fullWidth
//             margin="normal"
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//           />
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Parent Name</TableCell>
//                 <TableCell>Mobile Number</TableCell>
//                 <TableCell align="right">Select</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredParents
//                 .slice(currentPage * pageSize, currentPage * pageSize + pageSize)
//                 .map((p, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{p.parent_name}</TableCell>
//                     <TableCell>{p.mobile_number}</TableCell>
//                     <TableCell align="right">
//                       <Button variant="outlined" onClick={() => handleParentSelect(p)}>
//                         Select
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//           <TablePagination
//             component="div"
//             count={filteredParents.length}
//             page={currentPage}
//             onPageChange={(_, newPage) => setCurrentPage(newPage)}
//             rowsPerPage={pageSize}
//             rowsPerPageOptions={[pageSize]}
//           />
//         </DialogContent>
//       </Dialog>


//       {/* <Dialog open={showSelectionModal} onClose={() => setShowSelectionModal(false)}>
//         <DialogTitle>Select Parent</DialogTitle>
//         <DialogContent>
//           <List>
//             {parentOptions.map((p, index) => (
//               <ListItem button key={index} onClick={() => handleParentSelect(p)}>
//                 <ListItemText primary={p.parent_name} secondary={`Mobile: ${p.mobile_number}`} />
//               </ListItem>
//             ))}
//           </List>
//         </DialogContent>
//       </Dialog> */}
//     </>
//   );
// }


/* eslint-disable perfectionist/sort-imports */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useQRCode } from 'next-qrcode';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { config } from 'src/constants/helpers';
import { searchPartnerSchema } from 'src/constants/schema';

interface Child {
  id: string;
  child_name: string;
  child_age: number;
  parent_name: string;
  mobile_number: string;
  child_gender: string;
}

export default function BindQR() {
  const theme = useTheme();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<Child[]>([]);
  const [parentOptions, setParentOptions] = useState<Child[]>([]);
  const [parentName, setParentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [openError, setOpenError] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const [filteredParents, setFilteredParents] = useState<Child[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;


  const qrRef = useRef<HTMLDivElement>(null);
  const { Canvas } = useQRCode();

  const methods = useForm<{ searchTerm: string }>({
    mode: 'all',
    resolver: zodResolver(searchPartnerSchema),
    defaultValues: { searchTerm: '' },
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async ({ searchTerm }) => {
    try {
      const { data } = await axios.get<Child[]>(
        `${config.BASE_URL}/kidsDetails?input=${encodeURIComponent(searchTerm)}`
      );

      setChildren(data);

      const uniqueParents = Array.from(
        new Map(data.map(item => [`${item.parent_name}-${item.mobile_number}`, item])).values()
      );

      if (uniqueParents.length === 1) {
        const { parent_name, mobile_number } = uniqueParents[0];
        setParentName(parent_name);
        setMobileNumber(mobile_number);
        setSelectedChildren(
          data.filter(child => child.parent_name === parent_name && child.mobile_number === mobile_number)
        );
      } else {
        setParentOptions(uniqueParents);
        setFilteredParents(uniqueParents);
        setCurrentPage(0);
        setShowSelectionModal(true);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to load partner');
      setOpenError(true);
      setChildren([]);
      setParentName('');
      setMobileNumber('');
    }
  });

  useEffect(() => {
    const filtered = parentOptions.filter(p =>
      p.parent_name.toLowerCase().includes(searchInput.toLowerCase()) ||
      p.mobile_number.includes(searchInput)
    );
    setFilteredParents(filtered);
    setCurrentPage(0);
  }, [searchInput, parentOptions]);


  const handleParentSelect = (parent: Child) => {
    const { parent_name, mobile_number } = parent;
    setParentName(parent_name);
    setMobileNumber(mobile_number);
    setSelectedChildren(
      children.filter(c => c.parent_name === parent_name && c.mobile_number === mobile_number)
    );
    setShowSelectionModal(false);
  };

  const handleCancel = () => {
    reset();
    setChildren([]);
    setSelectedChildren([]);
    setParentName('');
    setMobileNumber('');
    setErrorMsg('');
    setOpenError(false);
  };

  const handleCloseError = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenError(false);
  };


  //near 50*25
  const handlePrint = async (list: Child[]) => {
    const eligible = list.filter(c => c.child_age >= 6 && c.child_age <= 15);
    if (!eligible.length) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrDataUrls = eligible.map(child => {
      const wrapper = qrRef.current?.querySelector(`div[data-childid="${child.id}"]`);
      const canvas = wrapper?.querySelector('canvas');
      return canvas ? canvas.toDataURL() : '';
    });

    printWindow.document.write(`
      <html>
        <head>
          <style>
            @page { size: 50mm 25mm; margin: 0 }
            html, body {
              margin: 0; padding: 0;
              height: 100%;
              font-family: Arial, sans-serif;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
            }
            .label {
              width: 50mm; height: 25mm;
              display: flex; flex-direction: row;
              align-items: center; justify-content: center;
              text-align: center; overflow: hidden;
              box-sizing: border-box;
              padding: 0;
            }
            .qr {
              width: 40px; height: 40px;
              object-fit: contain; margin-right: 8px;
            }
            .text {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .name { font-size: 12px; font-weight: bold; line-height: 1.2 }
            .id { font-size: 10px; line-height: 1.2 }
          </style>
        </head>
        <body>
          ${eligible.map((child, index) => `
            <div class="label">
              <img src="${qrDataUrls[index]}" class="qr"/>
              <div class="text">
                <div class="name">${child.child_name}</div>
                <div class="id">${child.mobile_number}</div>
              </div>
            </div>
          `).join('')}
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };




  //working 50*50
  // const handlePrint = async (list: Child[]) => {
  //   const eligible = list.filter(c => c.child_age >= 9 && c.child_age <= 14);
  //   if (!eligible.length) return;

  //   const printWindow = window.open('', '_blank');
  //   if (!printWindow) return;

  //   const qrDataUrls = eligible.map(child => {
  //     const wrapper = qrRef.current?.querySelector(`div[data-childid="${child.id}"]`);
  //     const canvas = wrapper?.querySelector('canvas');
  //     return canvas ? canvas.toDataURL() : '';
  //   });

  //   printWindow.document.write(`
  //     <html>
  //       <head>
  //         <style>
  //           @page { size: 50mm 50mm; margin:0 }
  //           body {
  //             margin:0; padding:0;
  //             font-family:Arial,sans-serif;
  //             display:flex; flex-wrap:wrap;
  //             justify-content:center;
  //           }
  //           .label {
  //             width:50mm; height:50mm;
  //             display:flex; flex-direction:column;
  //             align-items:center; justify-content:center;
  //             text-align:center; overflow:hidden;
  //           }
  //           .qr { width:100px; height:100px; object-fit:contain }
  //           .name { font-size:14px; font-weight:bold }
  //           .id { font-size:12px }
  //         </style>
  //       </head>
  //       <body>
  //         ${eligible.map((child, index) => `
  //           <div class="label">
  //             <img src="${qrDataUrls[index]}" class="qr"/>
  //             <div class="name">${child.child_name}</div>
  //             <div class="id">${child.mobile_number}</div>
  //           </div>`).join('')}
  //         <script>window.onload = () => window.print();</script>
  //       </body>
  //     </html>
  //   `);
  //   printWindow.document.close();
  // };



  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardHeader title={<Stack direction="row" alignItems="center" gap={1}><Iconify icon="material-symbols:search" width={24} /><Typography variant="h6">Search Child</Typography></Stack>} />
          <Divider />
          <Grid container spacing={2} sx={{ p: 3 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Field.Text name="searchTerm" label="Mobile Number" placeholder="Enter mobile number to search" autoFocus required type="tel" size="small" InputProps={{ startAdornment: (<Iconify icon="solar:phone-bold" width={20} sx={{ mr: 1, color: 'text.disabled' }} />) }} />
            </Grid>
            <Grid item xs={12} md={2} lg={1}>
              <LoadingButton startIcon={<Iconify icon="mingcute:search-3-line" />} type="submit" variant="contained" loading={isSubmitting} sx={{ py: 1.5, mt: 0.5 }} size='small' />
            </Grid>
            <Grid item xs={12} md={2} lg={1}>
              <Button variant="outlined" fullWidth onClick={handleCancel} disabled={isSubmitting} color="error" size='small' startIcon={<Iconify icon="material-symbols:cancel-outline" />} sx={{ py: 1.5, mt: 0.5 }} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: parentName ? 'success.lighter' : 'grey.100', textAlign: 'center' }}>
                <Typography variant="subtitle1" color="text.primary">
                  {parentName ? (
                    <Stack direction="row" alignItems="center" gap={1} justifyContent="center">
                      <Iconify icon="mdi:account-check" width={20} color={theme.palette.success.main} />
                      <span>{parentName} – {mobileNumber}</span>
                    </Stack>
                  ) : (
                    <Stack direction="row" alignItems="center" gap={1} justifyContent="center">
                      <Iconify icon="mdi:account-remove" width={20} color="text.disabled" />
                      <span>No partner loaded</span>
                    </Stack>
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        <Card elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
          <CardHeader title={<Stack direction="row" alignItems="center" gap={1}><Iconify icon="mdi:account-child" width={24} /><Typography variant="h6">Child Details</Typography></Stack>} />
          <Divider />
          <Grid container spacing={2} sx={{ p: 3 }}>
            {selectedChildren.length > 0 ? (
              selectedChildren.map((child) => (
                <Grid item xs={12} md={2} key={child.id}>
                  <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                      <Iconify icon={child.child_gender === 'male' ? 'mdi:gender-male' : 'mdi:gender-female'} width={24} color={child.child_gender === 'female' ? theme.palette.info.main : theme.palette.warning.main} />
                      <div>
                        <Typography variant="subtitle1" fontWeight={600}>{child.child_name}</Typography>
                        <Typography variant="body2" color="text.secondary">Age: {child.child_age}</Typography>
                      </div>
                    </Stack>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Stack spacing={1} alignItems="center" sx={{ py: 4 }}>
                  <Iconify icon="ion:sad-outline" width={40} color="text.disabled" />
                  <Typography color="text.secondary" variant="body1">No children found!</Typography>
                </Stack>
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
            <Button variant="contained" disabled={!selectedChildren.length} onClick={() => handlePrint(selectedChildren)} startIcon={<Iconify icon="material-symbols:print-outline" />} sx={{ px: 4, py: 1.5 }}>
              Print QR
            </Button>
          </Box>
        </Card>

        <div ref={qrRef} style={{ display: 'none' }}>
          {selectedChildren.map((child) => (
            <div key={child.id} data-childid={child.id}>
              <Canvas text={`${child.id}`} options={{ errorCorrectionLevel: 'M', margin: 2, scale: 4, width: 200, color: { dark: '#000000', light: '#FFFFFF' } }} />
            </div>
          ))}
        </div>
      </Form>

      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="error" sx={{ width: '100%', bgcolor: 'error.lighter', color: 'error.dark', '& .MuiAlert-icon': { color: 'error.dark' } }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Iconify icon="material-symbols:error-outline" width={24} />
            {errorMsg}
          </Stack>
        </Alert>
      </Snackbar>

      <Dialog open={showSelectionModal} onClose={() => setShowSelectionModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Select Parent</DialogTitle>
        <DialogContent>
          <TextField
            label="Search"
            fullWidth
            margin="normal"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parent Name</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell align="right">Select</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredParents
                .slice(currentPage * pageSize, currentPage * pageSize + pageSize)
                .map((p, index) => (
                  <TableRow key={index}>
                    <TableCell>{p.parent_name}</TableCell>
                    <TableCell>{p.mobile_number}</TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" onClick={() => handleParentSelect(p)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredParents.length}
            page={currentPage}
            onPageChange={(_, newPage) => setCurrentPage(newPage)}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
          />
        </DialogContent>
      </Dialog>


      {/* <Dialog open={showSelectionModal} onClose={() => setShowSelectionModal(false)}>
        <DialogTitle>Select Parent</DialogTitle>
        <DialogContent>
          <List>
            {parentOptions.map((p, index) => (
              <ListItem button key={index} onClick={() => handleParentSelect(p)}>
                <ListItemText primary={p.parent_name} secondary={`Mobile: ${p.mobile_number}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog> */}
    </>
  );
}


