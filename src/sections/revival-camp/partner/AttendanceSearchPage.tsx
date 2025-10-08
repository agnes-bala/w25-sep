// 'use client';

// import { useState } from 'react';

// import LoadingButton from '@mui/lab/LoadingButton';

// import {
//     Box,
//     Button,
//     Card,
//     CardHeader,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Divider,
//     Typography,
//     List,
//     ListItem,
//     ListItemText,
//     ListItemButton,
//     Paper,
//     Alert,
//     TextField,
//     Grid2,
// } from '@mui/material';

// import { config } from 'src/constants/helpers';
// import { Iconify } from 'src/components/iconify';
// import { toast } from 'src/components/snackbar';
// import { useAuthContext } from 'src/auth/hooks';
// import MemberTable from './components/MemberTable';

// type AttendanceResult = {
//     id: number;
//     title: string;
//     fullName: string;
//     addr1: string | null;
//     addr2: string | null;
//     city: string;
//     country: string;
//     state: string;
//     district: string;
//     pincode: string | null;
//     mobileNumber: string;
//     extraMale: string;
//     extraFemale: string;
//     extraChild: string;
//     idGenerate: string | null;
//     isAttended: string;
//     paymentMode: string | null;
//     amount: string | null;
//     discount: string | null;
//     createdBy: string;
//     createdAt: string | null;
//     updatedBy: string | null;
//     updatedAt: string | null;
// };

// const AttendanceSearchPage: React.FC = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState<AttendanceResult[]>([]);
//     const [searchLoading, setSearchLoading] = useState(false);
//     const [searchDialogOpen, setSearchDialogOpen] = useState(false);
//     const [selectedResult, setSelectedResult] = useState<AttendanceResult | null>(null);
//     const [successLoading, setSuccessLoading] = useState(false);

//     const { user } = useAuthContext();

//     const handleSearch = async () => {
//         if (!searchQuery.trim()) {
//             toast.error('Please enter a name or mobile number to search');
//             return;
//         }

//         setSearchLoading(true);
//         try {
//             const response = await fetch(`${config.BASE_URL}/isAttendedYes?input=${encodeURIComponent(searchQuery)}`);

//             if (!response.ok) {
//                 throw new Error('Search failed');
//             }

//             const results: AttendanceResult[] = await response.json();
//             setSearchResults(results);

//             if (results.length === 0) {
//                 toast.info('No attended members found for this search.');
//                 setSearchDialogOpen(false);
//             } else {
//                 setSearchDialogOpen(true);
//             }
//         } catch (error) {
//             console.error('Search error:', error);
//             toast.error('Search failed. Please try again.');
//             setSearchResults([]);
//         } finally {
//             setSearchLoading(false);
//         }
//     };

//     // Handle Enter key press in search field
//     const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSearch();
//         }
//     };

//     const handleSelectResult = (result: AttendanceResult) => {
//         setSelectedResult(result);
//         setSearchDialogOpen(false);
//         setSearchQuery('');
//         toast.success('Member details loaded successfully');
//     };

//     const handleSuccess = async () => {
//         if (!selectedResult) {
//             toast.error('No member selected');
//             return;
//         }

//         setSuccessLoading(true);
//         try {
//             const response = await fetch(`${config.BASE_URL}/success`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     id: selectedResult.id,
//                     processedBy: user?.name || 'Unknown',
//                 }),
//             });

//             const textResponse = await response.text();
//             console.log('Success Response:', textResponse);

//             if (response.ok) {
//                 toast.success(textResponse || 'Successfully processed!', {
//                     position: 'top-center',
//                     icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//                 });

//                 // Clear the selected result after successful processing
//                 setSelectedResult(null);
//             } else {
//                 toast.error(textResponse || 'Failed to process', {
//                     position: 'top-center',
//                 });
//             }
//         } catch (error) {
//             console.error('Success API Error:', error);
//             toast.error('Failed to process. Please try again.');
//         } finally {
//             setSuccessLoading(false);
//         }
//     };

//     const clearSelection = () => {
//         setSelectedResult(null);
//         setSearchQuery('');
//         setSearchResults([]);
//     };

//     // Calculate total extra members count
//     const getTotalExtraMembers = (result: AttendanceResult) => {
//         const extraMale = parseInt(result.extraMale) || 0;
//         const extraFemale = parseInt(result.extraFemale) || 0;
//         const extraChild = parseInt(result.extraChild) || 0;
//         return extraMale + extraFemale + extraChild;
//     };

//     return (
//         <>
//             <Card sx={{ mt: 1 }}>
//                 <CardHeader
//                 // subheader="Search for attended members and process their records"
//                 />
//                 {/* <Divider /> */}

//                 {/* Search Section */}
//                 <Box
//                     sx={{
//                         px: 3,
//                         py: 2,
//                         gap: 2,
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         flexWrap: 'wrap',
//                         '@media (max-width: 600px)': {
//                             flexDirection: 'column',
//                             gap: 1,
//                         },
//                     }}
//                 >
//                     <TextField
//                         label="Search Name or Mobile"
//                         size="small"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         onKeyDown={handleSearchKeyDown}
//                         sx={{
//                             width: '300px',
//                             '@media (max-width: 600px)': {
//                                 width: '100%',
//                             },
//                         }}
//                     />

//                     <LoadingButton
//                         variant="outlined"
//                         color="inherit"
//                         type="button"
//                         onClick={handleSearch}
//                         startIcon={<Iconify icon="mingcute:search-3-line" />}
//                         loading={searchLoading}
//                         disabled={searchLoading}
//                     >
//                         Search
//                     </LoadingButton>

//                     <Button
//                         variant="outlined"
//                         color="secondary"
//                         type="button"
//                         onClick={clearSelection}
//                         startIcon={<Iconify icon="mingcute:close-line" />}
//                     >
//                         Clear
//                     </Button>
//                 </Box>

//                 {/* Selected Result Details */}
//                 {selectedResult && (
//                     <Box sx={{ px: 3, py: 2 }}>
//                         {/* <Alert severity="success" sx={{ mb: 3 }}>
//                             <Typography variant="h6" sx={{ mb: 2 }}>
//                                 Selected Member Details
//                             </Typography>
//                         </Alert> */}

//                         <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
//                             <LoadingButton
//                                 variant="contained"
//                                 color="success"
//                                 size="large"
//                                 onClick={handleSuccess}
//                                 loading={successLoading}
//                                 disabled={successLoading}
//                                 startIcon={<Iconify icon="solar:check-bold" />}
//                                 sx={{
//                                     px: 4,
//                                     py: 1.5,
//                                     fontSize: '1.1rem',
//                                     fontWeight: 'bold',
//                                 }}
//                             >
//                                 Mark as Processed
//                             </LoadingButton>
//                         </Box>

//                         <Paper variant="outlined" sx={{ p: 3 }}>
//                             <Grid2 container spacing={3}>
//                                 {/* Main Applicant Information */}
//                                 <Grid2 size={{ xs: 12 }}>
//                                     <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
//                                         Main Applicant Information
//                                     </Typography>
//                                 </Grid2>

//                                 <Grid2 size={{ xs: 12, sm: 4 }}>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Full Name
//                                     </Typography>
//                                     <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                                         {selectedResult.title} {selectedResult.fullName}
//                                     </Typography>
//                                 </Grid2>

//                                 <Grid2 size={{ xs: 12, sm: 4 }}>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Mobile Number
//                                     </Typography>
//                                     <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                                         {selectedResult.mobileNumber}
//                                     </Typography>
//                                 </Grid2>

//                                 <Grid2 size={{ xs: 12, sm: 4 }}>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Created By
//                                     </Typography>
//                                     <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                                         {selectedResult.createdBy}
//                                     </Typography>
//                                 </Grid2>

//                                 {/* <Grid2 size={{ xs: 12, sm: 6 }}>
//                                     <Typography variant="body2" color="text.secondary">
//                                         Registration Date
//                                     </Typography>
//                                     <Typography variant="body1">
//                                         {selectedResult.createdAt ? new Date(selectedResult.createdAt).toLocaleDateString() : 'N/A'}
//                                     </Typography>
//                                 </Grid2> */}

//                                 {/* Extra Members Count */}
//                                 <Grid2 size={{ xs: 12 }}>
//                                     <Divider sx={{ my: 2 }} />
//                                     <MemberTable
//                                         setValue={() => { }}
//                                         getValues={() => 0}
//                                         under7={0}
//                                         maleChild={0}
//                                         femaleChild={0}
//                                         extraFemale={0}
//                                         mode="display"
//                                         extraMaleDisplay={selectedResult.extraMale}
//                                         extraFemaleDisplay={selectedResult.extraFemale}
//                                         extraChildDisplay={selectedResult.extraChild}
//                                     />
//                                 </Grid2>

//                                 {/* Payment Details */}
//                                 {/* <Grid2 size={{xs:12}}>
//                   <Divider sx={{ my: 2 }} />
//                   <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
//                     Payment Details
//                   </Typography>
//                 </Grid2> */}

//                                 {/* <Grid2 size={{xs:12, sm:4}}>
//                   <Typography variant="body2" color="text.secondary">
//                     Payment Mode
//                   </Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
//                     {selectedResult.paymentMode || 'N/A'}
//                   </Typography>
//                 </Grid2>

//                 <Grid2 size={{xs:12, sm:4}}>
//                   <Typography variant="body2" color="text.secondary">
//                     Amount Paid
//                   </Typography>
//                   <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
//                     ₹{selectedResult.amount || '0'}
//                   </Typography>
//                 </Grid2>

//                 <Grid2 size={{xs:12, sm:4}}>
//                   <Typography variant="body2" color="text.secondary">
//                     Discount Applied
//                   </Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
//                     ₹{selectedResult.discount || '0'}
//                   </Typography>
//                 </Grid2> */}

//                                 {/* Location Details */}
//                                 {/* <Grid2 size={{xs:12}}>
//                   <Divider sx={{ my: 2 }} />
//                   <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
//                     Location Details
//                   </Typography>
//                 </Grid2> */}

//                                 {/* <Grid2 size={{xs:12}}>
//                   <Typography variant="body2" color="text.secondary">
//                     Address
//                   </Typography>
//                   <Typography variant="body1">
//                     {[selectedResult.addr1, selectedResult.addr2, selectedResult.city, selectedResult.district, selectedResult.state, selectedResult.country]
//                       .filter(Boolean)
//                       .join(', ')}
//                     {selectedResult.pincode && ` - ${selectedResult.pincode}`}
//                   </Typography>
//                 </Grid2> */}
//                             </Grid2>

//                             {/* Success Button */}

//                         </Paper>
//                     </Box>
//                 )}

//                 {/* Empty State */}
//                 {!selectedResult && (
//                     <Box sx={{ px: 3, py: 6, textAlign: 'center' }}>
//                         <Iconify icon="mingcute:search-3-line" width={64} height={64} sx={{ color: 'text.disabled', mb: 2 }} />
//                         <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
//                             Search for Attended Members
//                         </Typography>
//                         <Typography variant="body2" color="text.disabled">
//                             Enter a name or mobile number to search for members who have already attended
//                         </Typography>
//                     </Box>
//                 )}
//             </Card>

//             {/* Search Results Dialog */}
//             <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} maxWidth="md" fullWidth>
//                 <DialogTitle>Search Results - Attended Members</DialogTitle>
//                 <DialogContent>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                         Found {searchResults.length} attended member(s) for "{searchQuery}"
//                     </Typography>

//                     {searchResults.length > 0 ? (
//                         <Paper variant="outlined">
//                             <List>
//                                 {searchResults.map((result, index) => (
//                                     <ListItem key={result.id} divider={index < searchResults.length - 1}>
//                                         <ListItemButton onClick={() => handleSelectResult(result)}>
//                                             <ListItemText
//                                                 primary={
//                                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                                         <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                                                             {result.title} {result.fullName}
//                                                         </Typography>
//                                                         <Typography variant="body2" color="success.main" sx={{ ml: 2, fontWeight: 'bold' }}>
//                                                             ✓ Attended
//                                                         </Typography>
//                                                     </Box>
//                                                 }
//                                                 secondary={
//                                                     <>
//                                                         <Typography variant="body2" component="span">
//                                                             Mobile: {result.mobileNumber}
//                                                         </Typography>
//                                                         <br />
//                                                         <Typography variant="body2" component="span">
//                                                             Location: {result.city}, {result.district}, {result.state}
//                                                         </Typography>
//                                                         <br />
//                                                         <Typography variant="body2" component="span">
//                                                             Extra Members: Male({result.extraMale}), Female({result.extraFemale}), Child({result.extraChild})
//                                                         </Typography>
//                                                         <br />
//                                                         <Typography variant="body2" component="span" sx={{ fontWeight: 'bold', color: 'success.main' }}>
//                                                             Amount: ₹{result.amount || '0'}
//                                                         </Typography>
//                                                         <br />
//                                                         <Typography variant="body2" component="span" color="primary">
//                                                             Created by: {result.createdBy}
//                                                         </Typography>
//                                                     </>
//                                                 }
//                                             />
//                                         </ListItemButton>
//                                     </ListItem>
//                                 ))}
//                             </List>
//                         </Paper>
//                     ) : (
//                         <Typography variant="body1" align="center" sx={{ py: 3 }}>
//                             No results found
//                         </Typography>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setSearchDialogOpen(false)}>Cancel</Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// };

// export default AttendanceSearchPage;
