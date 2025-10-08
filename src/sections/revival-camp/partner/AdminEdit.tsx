// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { toast } from 'src/components/snackbar';
// import {
//   Box,
//   Button,
//   Card,
//   CardHeader,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid2,
//   MenuItem,
//   TextField,
//   Typography,
//   Checkbox,
//   Alert,
//   Paper,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Pagination,
//   InputAdornment,
// } from '@mui/material';
// import { getDistricts, getStates } from 'src/utils/helpers';
// import { Field, Form } from 'src/components/hook-form';
// import { Iconify } from 'src/components/iconify';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { titleOptions, paymentOptions } from 'src/constants/selectoptions';
// import { config } from 'src/constants/helpers';
// import MemberTable from './components/MemberTable';

// interface PartnerFormProps {
//   countries: { value: string; label: string }[];
//   states: { value: string; label: string }[];
//   districts: { value: string; label: string }[];
// }

// interface PartnerFormData {
//   id: string;
//   mobileNumber: string;
//   title: string;
//   searchTerm: string;
//   fullName: string;
//   city: string;
//   country: string;
//   state: string;
//   district: string;
//   under: number;
//   maleChild: number;
//   femaleChild: number;
//   extraFemale: number;
//   idGenerate: string;
//   isAttended: string;
//   textReminderConsent: boolean;
//   searchMobileNumber: string;
//   paymentMode: string;
//   upiRefNumber: string;
//   discount: number;
//   discountType: string;
//   discountBy: string;
//   amount: number;
//   discountPassword: string;
//   paidAmount: number;
//   pincode: string;
//   addr1: string;
//   addr2: string;
// }

// interface SearchResult {
//   id: number;
//   title: string;
//   fullName: string;
//   mobileNumber: string;
//   country: string;
//   state: string;
//   district: string;
//   city: string;
//   // extraMale: string;

//   extraFemale: string;
//   under: string;
//   maleChild: string;
//   femaleChild: string;
//   // extraChild: string;
//   idGenerate: string;
//   isAttended: string;
//   textReminderConsent: string;
//   createdBy: string;
//   paymentMode: string;
//   upiRefNumber: string;
//   discount: number;
//   discountType: string;
//   discountBy: string;
//   amount: number;
//   paidAmount: number;
//   pincode: string;
//   addr1: string;
//   addr2: string;
// }

// const AdminDetails: React.FC<PartnerFormProps> = ({ countries, states, districts }) => {
//   const [loading, setLoading] = useState(false);
//   const [hasPartnerDetails, setHasPartnerDetails] = useState(false);
//   const [statesList, setStatesList] = useState(states);
//   const [districtsList, setDistrictsList] = useState(districts);
//   const [districtVisible, setDistrictVisible] = useState(false);
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//   const [showResultsDialog, setShowResultsDialog] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
//   const [showDiscountFields, setShowDiscountFields] = useState(false);
//   const [discountError, setDiscountError] = useState('');
//   const [paidAmount, setPaidAmount] = useState<number>(0);
//   const [returnAmount, setReturnAmount] = useState<number>(0);
//   const [total, setTotal] = useState(200);
//   const [showUpiRefField, setShowUpiRefField] = useState(false);

//   // New state for age-based member tracking
//   const [memberCounts, setMemberCounts] = useState<{
//     under: number;
//     maleChild: number;
//     femaleChild: number;
//     extraFemale: number
//   }>({
//     under: 0,
//     maleChild: 0,
//     femaleChild: 0,
//     extraFemale: 0
//   });

//   const ROWS_PER_PAGE = 10;

//   // Discount configuration
//   const MAX_DISCOUNT_PERCENTAGE = 100;
//   const DISCOUNT_PASSWORD = 'admin123';

//   // Calculate amount based on age-based fee structure (matching NewAddPage)
//   const calculateAmount = (counts: {
//     under: number;
//     maleChild: number;
//     femaleChild: number;
//     extraFemale: number
//   }) => {
//     // Base amount for the main registrant (sister)
//     const baseAmount = 200;

//     // Age-based fees
//     const underFee = counts.under * 0; // No fee for under 7
//     const maleChildFee = counts.maleChild * 100; // Rs. 100 for male children 7-14
//     const femaleChildFee = counts.femaleChild * 100; // Rs. 100 for female children 7-14
//     const extraFemaleFee = counts.extraFemale * 200; // Rs. 200 for females 14+

//     return baseAmount + underFee + maleChildFee + femaleChildFee + extraFemaleFee;
//   };


//   // Calculate discount amount ensuring it doesn't exceed total amount
//   const calculateDiscount = (discountValue: number, discountType: string, totalAmount: number) => {
//     if (discountType === 'percentage') {
//       const percentageDiscount = (totalAmount * discountValue) / 100;
//       return Math.min(percentageDiscount, totalAmount);
//     }
//     return Math.min(discountValue, totalAmount);
//   };

//   const defaultValues = {
//     id: '',
//     mobileNumber: '',
//     title: '',
//     fullName: '',
//     country: 'India',
//     state: 'Andhra Pradesh',
//     district: '',
//     city: '',
//     // Old fields for backward compatibility
//     // extraMale: '0',
//     // extraChild: '0',
//     // New age-based fields
//     under: 0,
//     maleChild: 0,
//     femaleChild: 0,
//     extraFemale: 0,
//     idGenerate: "",
//     searchTerm: '',
//     isAttended: 'yes',
//     textReminderConsent: false,
//     searchMobileNumber: '',
//     paymentMode: 'cash',
//     upiRefNumber: '',
//     discount: 0,
//     discountType: 'fixed',
//     discountBy: '',
//     amount: 200,
//     discountPassword: '',
//     paidAmount: 0,
//     pincode: '',
//     addr1: '',
//     addr2: '',
//   };

//   const methods = useForm<PartnerFormData>({
//     mode: 'all',
//     defaultValues,
//   });

//   const {
//     handleSubmit,
//     setValue,
//     getValues,
//     control,
//     reset,
//     watch,
//     formState: { isSubmitting, errors },
//   } = methods;

//   const watchPaymentMode = watch('paymentMode');
//   // Watch age-based fields
//   const watchUnder = watch('under') || 0;
//   const watchMaleChild = watch('maleChild') || 0;
//   const watchFemaleChild = watch('femaleChild') || 0;
//   const watchExtraFemale = watch('extraFemale') || 0;
//   const watchDiscount = watch('discount') || 0;
//   const watchDiscountType = watch('discountType') || 'fixed';

//   // Update UPI reference field visibility when payment mode changes
//   useEffect(() => {
//     setShowUpiRefField(watchPaymentMode === 'upi');
//     if (watchPaymentMode !== 'upi') {
//       setValue('upiRefNumber', '');
//     }
//   }, [watchPaymentMode, setValue]);

//   // Calculate total amount whenever age-based members or discount changes
//   useEffect(() => {
//     const calculatedAmount = calculateAmount(memberCounts);

//     let finalDiscount = 0;
//     if (watchDiscount > 0) {
//       finalDiscount = calculateDiscount(watchDiscount, watchDiscountType, calculatedAmount);

//       if (watchDiscountType === 'percentage' && watchDiscount > MAX_DISCOUNT_PERCENTAGE) {
//         setDiscountError(`Discount cannot exceed ${MAX_DISCOUNT_PERCENTAGE}%`);
//         finalDiscount = calculateDiscount(MAX_DISCOUNT_PERCENTAGE, 'percentage', calculatedAmount);
//       } else {
//         setDiscountError('');
//       }
//     }

//     const finalAmount = Math.max(0, calculatedAmount - finalDiscount);
//     setTotal(finalAmount);
//     setValue('amount', finalAmount);
//   }, [memberCounts, watchDiscount, watchDiscountType, setValue]);

//   // Update member counts when form fields change
//   useEffect(() => {
//     setMemberCounts({
//       under: watchUnder,
//       maleChild: watchMaleChild,
//       femaleChild: watchFemaleChild,
//       extraFemale: watchExtraFemale
//     });
//   }, [watchUnder, watchMaleChild, watchFemaleChild, watchExtraFemale]);

//   // Calculate return amount whenever paidAmount or total changes
//   useEffect(() => {
//     setReturnAmount(paidAmount - total);
//   }, [paidAmount, total]);

//   const handleReset = () => {
//     methods.reset(defaultValues);
//     setDistrictVisible(false);
//     setStatesList(states);
//     setDistrictsList(districts);
//     setHasPartnerDetails(false);
//     setSearchResults([]);
//     setSelectedResult(null);
//     setSearchQuery('');
//     setShowDiscountFields(false);
//     setDiscountError('');
//     setPaidAmount(0);
//     setReturnAmount(0);
//     setTotal(200);
//     setShowUpiRefField(false);

//     // Reset member counts
//     setMemberCounts({ under: 0, maleChild: 0, femaleChild: 0, extraFemale: 0 });
//   };

//   const onSubmit = async (data: PartnerFormData) => {
//     setLoading(true);
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     const updated_by = user?.name || 'Unknown';

//     // Validate discount password if discount is applied
//     if (data.discount > 0) {
//       if (!validateDiscountPassword()) {
//         toast.error('Invalid discount password. Please check and try again.');
//         setLoading(false);
//         return;
//       }
//     }

//     // Validate UPI reference number if payment mode is UPI
//     if (data.paymentMode === 'upi' && !data.upiRefNumber?.trim()) {
//       toast.error('UPI Reference Number is mandatory for UPI payments');
//       setLoading(false);
//       return;
//     }

//     try {
//       const payload = {
//         id: data.id,
//         fullName: data.fullName,
//         title: data.title,
//         country: data.country,
//         state: data.state,
//         district: data.district,
//         city: data.city,
//         extraFemale: String(data.extraFemale || 0),
//         under: String(data.under || 0),
//         maleChild: String(data.maleChild || 0),
//         femaleChild: String(data.femaleChild || 0),
//         mobileNumber: data.mobileNumber,
//         searchMobileNumber: data.searchMobileNumber,
//         idGenerate: data.idGenerate,
//         isAttended: data.isAttended,
//         updated_by: updated_by,
//         textReminderConsent: data.textReminderConsent ? 'y' : 'n',
//         paymentMode: data.paymentMode,
//         upiRefNumber: data.upiRefNumber,
//         discount: String(data.discount || 0),
//         discountType: data.discountType,
//         discountBy: data.discountBy,
//         amount: String(data.amount || 0),
//         paidAmount: String(data.paidAmount || 0),
//         pincode: data.pincode, // Note: using 'pincode' to match your desired output
//         addr1: data.addr1,
//         addr2: data.addr2,
//       };

//       const response = await fetch(`${config.BASE_URL}/editData`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const responseText = await response.text();
//         toast.success(responseText, {
//           position: 'top-center',
//           richColors: true,
//           icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//         });
//         handleReset();
//       } else {
//         const responseText = await response.text();
//         toast.error(responseText, {
//           position: 'top-center',
//           richColors: true,
//           icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//         });
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       toast.error('An error occurred during submission');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) {
//       toast.error('Please enter a mobile number, name, or ID to search');
//       return;
//     }

//     setSearchLoading(true);

//     try {
//       const queryString = `input=${encodeURIComponent(searchQuery)}`;
//       const url = `${config.BASE_URL}/isAttendedYes?${queryString}`;
//       console.log('Request URL:', url);

//       const response = await fetch(url);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data?.message || data?.error || 'Failed to fetch visitor details');
//       }

//       if (!data || data.length === 0) {
//         toast.info('No matching visitor found.');
//         setSearchResults([]);
//         return;
//       }

//       // FIXED: Filter only attended visitors (case-insensitive check)
//       const attendedVisitors = data.filter((visitor: SearchResult) =>
//         visitor.isAttended?.toLowerCase() === 'yes'
//       );

//       if (attendedVisitors.length === 0) {
//         toast.info('No attended visitors found with the provided details.');
//         setSearchResults([]);
//         return;
//       }

//       setSearchResults(attendedVisitors);
//       setShowResultsDialog(true);
//     } catch (error: any) {
//       console.error('Error fetching data:', error);
//       toast.error(error.message || 'Failed to fetch visitor details', {
//         position: 'top-center',
//         richColors: true,
//         icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//       });
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleSelectResult = (result: SearchResult) => {
//     setSelectedResult(result);
//     fillFormWithPartnerData(result);
//     setShowResultsDialog(false);
//     setSearchQuery('');
//   };

//   const fillFormWithPartnerData = async (data: SearchResult) => {
//     setValue('id', data.id.toString());
//     setValue('fullName', data.fullName || '');
//     setValue('title', data.title || '');
//     setValue('country', data.country || 'India');
//     setValue('state', data.state || 'Andhra Pradesh');
//     setValue('district', data.district || '');
//     setValue('city', data.city || '');
//     // setValue('extraMale', data.extraMale || '0');
//     setValue('extraFemale', parseInt(data.extraFemale || '0'));
//     // setValue('extraChild', data.extraChild || '0');
//     setValue('mobileNumber', data.mobileNumber || '');
//     setValue('idGenerate', data.idGenerate || '');
//     setValue('isAttended', data.isAttended || 'yes');
//     setValue('searchMobileNumber', data.mobileNumber || '');
//     setValue('textReminderConsent', data.textReminderConsent === 'y');
//     setValue('paymentMode', data.paymentMode || 'cash');
//     setValue('upiRefNumber', data.upiRefNumber || '');
//     setValue('discount', (data.discount) || 0);
//     setValue('discountType', data.discountType || 'fixed');
//     setValue('discountBy', data.discountBy || '');
//     setValue('amount', (data.amount) || 200);
//     setValue('paidAmount', (data.paidAmount) || 0);
//     setValue('pincode', data.pincode || '');
//     setValue('addr1', data.addr1 || '');
//     setValue('addr2', data.addr2 || '');

//     // For backward compatibility, distribute old data into new age-based fields
//     const maleChild = parseInt(data.maleChild) || 0;
//     const extraFemale = parseInt(data.extraFemale) || 0;
//     const femaleChild = parseInt(data.femaleChild) || 0;
//     const under = parseInt(data.under) || 0;
//     // const extraChild = parseInt(data.extraChild) || 0;

//     // Distribute old data into new age-based fields (you might need to adjust this logic)
//     setValue('maleChild', maleChild); // Assume all males are 7-14 for backward compatibility
//     setValue('extraFemale', extraFemale); // Assume all females are above 14 for backward compatibility
//     setValue('femaleChild', femaleChild); // Assume children are female 7-14 for backward compatibility
//     setValue('under', under);

//     // Set paid amount for display
//     setPaidAmount((data.paidAmount) || 0);

//     // Handle country/state/district fetch logic
//     if (data.country && data.country !== 'India') {
//       const statesData = await getStates(data.country);
//       setStatesList(statesData);
//       setDistrictVisible(true);
//     } else {
//       const districtsData = await getDistricts(data.country || 'India', data.state || 'Andhra Pradesh');
//       setDistrictsList(districtsData);
//       setValue('district', data.district || '');
//     }

//     setHasPartnerDetails(true);
//     toast.success('Visitor details loaded successfully');
//   };

//   // Handle discount field changes with validation
//   const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = Math.max(0, parseInt(e.target.value) || 0);
//     const calculatedAmount = calculateAmount(memberCounts);

//     if (watchDiscountType === 'percentage') {
//       if (value > MAX_DISCOUNT_PERCENTAGE) {
//         setDiscountError(`Discount cannot exceed ${MAX_DISCOUNT_PERCENTAGE}%`);
//         setValue('discount', MAX_DISCOUNT_PERCENTAGE);
//       } else {
//         setDiscountError('');
//         setValue('discount', value);
//       }
//     } else {
//       // Fixed amount validation - ensure it doesn't exceed total amount
//       if (value > calculatedAmount) {
//         setDiscountError(`Discount cannot exceed total amount ₹${calculatedAmount}`);
//         setValue('discount', calculatedAmount);
//       } else {
//         setDiscountError('');
//         setValue('discount', value);
//       }
//     }
//   };

//   // Toggle discount fields visibility
//   const toggleDiscountFields = () => {
//     setShowDiscountFields(!showDiscountFields);
//     if (!showDiscountFields) {
//       setValue('discount', 0);
//       setValue('discountType', 'fixed');
//       setValue('discountPassword', '');
//       setValue('discountBy', '');
//       setDiscountError('');
//     }
//   };

//   // Validate discount password
//   const validateDiscountPassword = () => {
//     const password = getValues('discountPassword');
//     if (password !== DISCOUNT_PASSWORD) {
//       setDiscountError('Invalid discount password');
//       return false;
//     }
//     setDiscountError('');
//     return true;
//   };

//   const filteredResults = useMemo(() => {
//     return searchResults.filter(
//       (partner) =>
//         partner.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         partner.mobileNumber?.includes(searchQuery) ||
//         partner.idGenerate?.toLowerCase().includes(searchQuery.toLowerCase())
//       // partner.churchName?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [searchResults, searchQuery]);

//   const paginatedResults = useMemo(() => {
//     const start = (currentPage - 1) * ROWS_PER_PAGE;
//     return filteredResults.slice(start, start + ROWS_PER_PAGE);
//   }, [filteredResults, currentPage]);

//   const handleCountryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const country = e.target.value;
//     setValue('country', country);
//     const statesData = await getStates(country);
//     setStatesList(statesData);
//     setValue('state', statesData[0]?.value || '');
//     setValue('district', '');
//   };

//   const handleStateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const state = e.target.value;
//     setValue('state', state);
//     const country = getValues('country');
//     if (country === 'India') {
//       const districtsData = await getDistricts(country, state);
//       setDistrictsList(districtsData);
//       setValue('district', districtsData[0]?.value || '');
//     } else {
//       setDistrictsList([]);
//       setDistrictVisible(true);
//     }
//   };

//   const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSearch();
//     }
//   };

//   return (
//     <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Card sx={{ mt: 1 }}>
//         <CardHeader title="Update Attended Visitor" />
//         {/* <Divider /> */}

//         {/* Search Section */}
//         <Grid2 container spacing={2} sx={{ px: 3, mt: 2, mb: 2 }}>
//           <Grid2 size={{ xs: 12, sm: 4 }}>
//             <TextField
//               label="Search Attended Visitors (Mobile / Name / ID )"
//               variant="outlined"
//               fullWidth
//               size="small"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={handleSearchKeyDown}
//             />
//           </Grid2>
//           <Grid2 size={{ xs: 12, sm: 4, md: 2 }}>
//             <LoadingButton
//               startIcon={<Iconify icon="mingcute:search-3-line" />}
//               variant="contained"
//               onClick={handleSearch}
//               loading={searchLoading}
//               sx={{
//                 py: 1.5,
//                 mt: 0.5,
//                 '@media (max-width: 600px)': {
//                   width: '100%'
//                 }
//               }}
//               size="small"
//               fullWidth
//             >
//               Search
//             </LoadingButton>
//           </Grid2>
//           <Grid2 size={{ xs: 12, sm: 4, md: 2 }}>
//             <Button
//               variant="outlined"
//               fullWidth
//               onClick={handleReset}
//               color="error"
//               size="small"
//               startIcon={<Iconify icon="material-symbols:cancel-outline" />}
//               sx={{ py: 1.5, mt: 0.5 }}
//             >
//               Cancel
//             </Button>
//           </Grid2>
//         </Grid2>

//       </Card>

//       {/* <Divider /> */}

//       <Card sx={{ mt: 1 }}>
//         {hasPartnerDetails && (
//           <Card sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
//             {/* <CardHeader title="Visitor Details" /> */}
//             {/* <Divider /> */}
//             <Box
//               sx={{
//                 flex: 1,
//                 overflow: 'auto',
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(5, 1fr)',
//                 '@media (max-width: 900px)': {
//                   gridTemplateColumns: 'repeat(2, 1fr)',
//                 },
//                 '@media (max-width: 600px)': {
//                   gridTemplateColumns: 'repeat(1, 1fr)',
//                 },
//                 gap: 2,
//                 p: 3,
//               }}
//             >
//               <Field.Select name="title" label="Title" size="small" required>
//                 {titleOptions.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Field.Select>
//               <Field.Text name="idGenerate" label="ID Generate" size="small" disabled />
//               <Field.Text name="fullName" label="Full Name" size="small" required />
//               <Field.Text name="mobileNumber" label="Mobile Number" size="small" required />

//               {/* <Field.Select
//                 name="country"
//                 label="Country"
//                 size="small"
//                 required
//                 onChange={handleCountryChange}
//               >
//                 {countries.map((option: { value: string; label: string }) => (
//                   <MenuItem value={option.value} key={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Field.Select> */}

//               <Field.Select
//                 name="state"
//                 label="State"
//                 size="small"
//                 required
//                 onChange={handleStateChange}
//               >
//                 {statesList.map((option: { value: string; label: string }) => (
//                   <MenuItem value={option.value} key={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Field.Select>

//               <Field.Select
//                 name="district"
//                 label="District"
//                 size="small"
//                 disabled={districtVisible}
//                 required
//                 style={{
//                   display: districtVisible ? 'none' : 'block',
//                 }}
//               >
//                 {districtsList.map((option: { value: string; label: string }) => (
//                   <MenuItem value={option.value} key={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </Field.Select>

//               <Field.Text label="Place" name="city" size="small" />
//               <Field.Text name="pincode" label="Pincode" size="small" inputProps={{ maxLength: 6 }} />
//               <Field.Text name="addr1" label="Address Line 1" size="small" />
//               <Field.Text name="addr2" label="Address Line 2" size="small" />


//             </Box>


//             {/* Member Count and Payment Section */}
//             <Box sx={{
//               mt: 1,
//               display: "grid",
//               gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
//               gap: 2,
//               alignItems: "start"
//             }}>

//               {/* Left Side - Member Count Table */}
//               <Box sx={{
//                 p: 1.5,
//                 bgcolor: 'background.paper',
//                 borderRadius: 1,
//                 // boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//               }}>
//                 <MemberTable
//                   setValue={setValue}
//                   getValues={getValues}
//                   under={watchUnder}
//                   maleChild={watchMaleChild}
//                   femaleChild={watchFemaleChild}
//                   extraFemale={watchExtraFemale}
//                   // disabled={isAttendedYes}
//                   showQuickAdd={true}
//                   mode="form"
//                 />
//               </Box>

//               {/* Right Side - Payment and Other Fields */}
//               <Box sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 1.5,
//                 p: 1.5,
//                 bgcolor: 'background.paper',
//                 borderRadius: 1,
//                 // boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//               }}>
//                 {/* <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
//                             Payment Details
//                           </Typography> */}

//                 {/* Payment Mode Field */}
//                 <Field.Select
//                   name="paymentMode"
//                   label="Payment Mode"
//                   size="small"
//                   required
//                   sx={{ maxWidth: '200px' }}

//                 // disabled={isAttendedYes}
//                 >
//                   {paymentOptions.map((option) => (
//                     <MenuItem value={option.value} key={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Field.Select>

//                 {/* UPI Reference Number Field - Conditionally Rendered */}
//                 {showUpiRefField && (
//                   <Field.Text
//                     name="upiRefNumber"
//                     label="UPI Reference Number"
//                     size="small"
//                     required={watchPaymentMode === 'upi'}
//                     sx={{ maxWidth: '200px' }}
//                   // disabled={isAttendedYes}
//                   />
//                 )}

//                 {/* Text Reminder Consent */}
//                 {/* <Box>
//                   <Controller
//                     name="textReminderConsent"
//                     control={control}
//                     render={({ field }) => (
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             {...field}
//                             checked={field.value}
//                             onChange={(e) => field.onChange(e.target.checked)}
//                             color="primary"
//                           // disabled={isAttendedYes}
//                           />
//                         }
//                         label={
//                           <Typography variant="body2">
//                             I agree to receive messages
//                           </Typography>
//                         }
//                       />
//                     )}
//                   />
//                 </Box> */}

//                 {/* Discount Toggle Button */}
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   startIcon={<Iconify icon={showDiscountFields ? "mingcute:up-line" : "mingcute:down-line"} />}
//                   onClick={toggleDiscountFields}
//                   // disabled={isAttendedYes}
//                   sx={{ alignSelf: 'flex-start', mt: 1, maxWidth: '200px' }}
//                 >
//                   {showDiscountFields ? 'Hide Discount Options' : 'Apply Discount'}
//                 </Button>

//                 {/* Discount Fields */}
//                 {showDiscountFields && (
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.5 }}>
//                     <Field.Select
//                       name="discountType"
//                       label="Discount Type"
//                       size="small"
//                       sx={{ maxWidth: '200px' }}
//                     // disabled={isAttendedYes}
//                     >
//                       <MenuItem value="fixed">Fixed Amount (₹)</MenuItem>
//                       <MenuItem value="percentage">Percentage (%)</MenuItem>
//                     </Field.Select>

//                     <Field.Text
//                       name="discount"
//                       label={`Discount ${watchDiscountType === 'percentage' ? '(%)' : '(₹)'}`}
//                       size="small"
//                       type="number"
//                       sx={{ maxWidth: '200px' }}
//                       inputProps={{
//                         min: 0,
//                         max: watchDiscountType === 'percentage' ? MAX_DISCOUNT_PERCENTAGE : calculateAmount(memberCounts)
//                       }}
//                       onChange={handleDiscountChange}
//                       error={!!discountError}
//                       helperText={discountError}
//                     // disabled={isAttendedYes}
//                     />

//                     <Field.Text
//                       name="discountPassword"
//                       label="Discount Password"
//                       size="small"
//                       type="password"
//                       sx={{ maxWidth: '200px' }}
//                       required={watchDiscount > 0}
//                     // disabled={isAttendedYes}
//                     />

//                     <Field.Text
//                       name="discountBy"
//                       label="Approved By"
//                       sx={{ maxWidth: '200px' }}
//                       size="small"
//                       required={watchDiscount > 0}
//                     // disabled={isAttendedYes}
//                     />

//                     {discountError && (
//                       <Alert severity="error">
//                         {discountError}
//                       </Alert>
//                     )}
//                   </Box>
//                 )}
//               </Box>

//             </Box>

//             {/* Payment Details Section - Fixed at bottom */}
//             <Box sx={{ borderColor: 'divider' }}>
//               {/* Amount Display */}
//               <Box sx={{ p: 3, bgcolor: 'primary.inherit', color: 'inherit' }}>
//                 <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
//                   <Grid2 container spacing={2} alignItems="center" justifyContent="flex-end" display={"grid"}>
//                     {/* Paid Amount Input */}
//                     <Grid2 size={{ xs: 12, sm: 12 }}>
//                       <TextField
//                         fullWidth
//                         label="Paid Amount"
//                         type="number"
//                         value={paidAmount}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaidAmount(Number(e.target.value))}
//                         InputProps={{
//                           startAdornment: <InputAdornment position="start">₹</InputAdornment>,
//                         }}
//                         variant="outlined"
//                         size="small"
//                       />
//                     </Grid2>

//                     {/* Return Amount Display */}
//                     <Grid2 size={{ xs: 12, sm: 12 }}>
//                       <Box sx={{
//                         p: 1,
//                         bgcolor: returnAmount >= 0 ? 'success.light' : 'error.light',
//                         borderRadius: 1,
//                         textAlign: 'center'
//                       }}>
//                         <Typography variant="body1" fontWeight="bold">
//                           {returnAmount >= 0 ? 'Return: ₹' : 'Due: ₹'}{Math.abs(returnAmount)}
//                         </Typography>
//                       </Box>
//                     </Grid2>
//                   </Grid2>
//                 </Box>

//                 {/* Total Amount Display */}
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
//                   <Box>
//                     {watchDiscount > 0 && (
//                       <Typography variant="body2" color="error">
//                         Discount Applied: {watchDiscount}{watchDiscountType === 'percentage' ? '%' : '₹'}
//                       </Typography>
//                     )}
//                     <Typography variant="body2" color="text.secondary">
//                       Payment Mode: {watchPaymentMode === 'upi' ? 'UPI' : 'Cash'}
//                     </Typography>


//                   </Box>
//                   <Typography variant="h4" fontWeight="bold">
//                     Total Amount: ₹{total}
//                   </Typography>
//                 </Box>
//               </Box>

//               <Box sx={{
//                 px: 3,
//                 py: 2,
//                 display: 'flex',
//                 gap: 3,
//                 justifyContent: 'center',
//                 '@media (max-width: 600px)': {
//                   flexDirection: 'column',
//                   gap: 2
//                 }
//               }}>
//                 <Button variant="outlined" color="error" onClick={handleReset}>
//                   Cancel
//                 </Button>
//                 <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
//                   Update Visitor
//                 </LoadingButton>
//               </Box>
//             </Box>
//           </Card>
//         )}
//       </Card>

//       {/* Search Results Dialog */}
//       <Dialog
//         open={showResultsDialog}
//         onClose={() => setShowResultsDialog(false)}
//         maxWidth="md"
//         fullWidth
//         sx={{
//           '& .MuiDialog-paper': {
//             '@media (max-width: 600px)': {
//               margin: 1,
//               width: 'calc(100% - 16px)',
//               maxHeight: 'calc(100% - 16px)'
//             }
//           }
//         }}
//       >
//         <DialogTitle>Select Attended Visitor</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Search visitors..."
//             fullWidth
//             margin="dense"
//             size="small"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//             Found {filteredResults.length} attended visitor(s) for "{searchQuery}"
//           </Typography>

//           {filteredResults.length > 0 ? (
//             <Paper variant="outlined">
//               <List>
//                 {paginatedResults.map((partner, index) => (
//                   <ListItem key={partner.id} divider={index < paginatedResults.length - 1}>
//                     <ListItemButton onClick={() => handleSelectResult(partner)}>
//                       <ListItemText
//                         primary={
//                           <Typography variant="subtitle1">
//                             {partner.title} {partner.fullName}
//                           </Typography>
//                         }
//                         secondary={
//                           <>
//                             <Typography variant="body2" component="span">
//                               Mobile: {partner.mobileNumber}
//                             </Typography>
//                             <br />
//                             <Typography variant="body2" component="span">
//                               Location: {partner.city}, {partner.district}, {partner.state}
//                             </Typography>
//                             <br />
//                             <Typography variant="body2" component="span">
//                               ID: {partner.idGenerate}
//                             </Typography>
//                             <br />
//                             <Typography variant="body2" component="span">
//                               Child Male({partner.maleChild}), Child Female({partner.femaleChild}), Under 7({partner.under}), Extra Female({partner.extraFemale})
//                             </Typography>
//                             <br />
//                             <br />
//                             <Typography variant="body2" component="span" color="primary">
//                               Created by: {partner.createdBy}
//                             </Typography>
//                           </>
//                         }
//                       />
//                     </ListItemButton>
//                   </ListItem>
//                 ))}
//               </List>

//               <Box display="flex" justifyContent="center" mt={2} pb={2}>
//                 <Pagination
//                   count={Math.ceil(filteredResults.length / ROWS_PER_PAGE)}
//                   page={currentPage}
//                   onChange={(event, page) => setCurrentPage(page)}
//                   color="primary"
//                 />
//               </Box>
//             </Paper>
//           ) : (
//             <Typography variant="body1" align="center" sx={{ py: 3 }}>
//               No attended visitors found
//             </Typography>
//           )}
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setShowResultsDialog(false)}>Cancel</Button>
//         </DialogActions>
//       </Dialog>

//     </Form>
//   );
// };

// export default AdminDetails;
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'src/components/snackbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid2,
  MenuItem,
  TextField,
  Typography,
  Checkbox,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  InputAdornment,
} from '@mui/material';
import { getDistricts, getStates } from 'src/utils/helpers';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import LoadingButton from '@mui/lab/LoadingButton';
import { titleOptions, paymentOptions } from 'src/constants/selectoptions';
import { config } from 'src/constants/helpers';
import MemberTable from './components/MemberTable';

interface PartnerFormProps {
  countries: { value: string; label: string }[];
  states: { value: string; label: string }[];
  districts: { value: string; label: string }[];
}

interface PartnerFormData {
  id: string;
  mobileNumber: string;
  title: string;
  searchTerm: string;
  fullName: string;
  city: string;
  country: string;
  state: string;
  district: string;
  under: number;
  maleChild: number;
  femaleChild: number;
  extraFemale: number;
  idGenerate: string;
  isAttended: string;
  textReminderConsent: boolean;
  searchMobileNumber: string;
  paymentMode: string;
  upiRefNumber: string;
  discount: number;
  discountType: string;
  discountBy: string;
  amount: number;
  discountPassword: string;
  paidAmount: number;
  pincode: string;
  addr1: string;
  addr2: string;
}

interface SearchResult {
  id: number;
  title: string;
  fullName: string;
  mobileNumber: string;
  country: string;
  state: string;
  district: string;
  city: string;
  extraFemale: string;
  under: string;
  maleChild: string;
  femaleChild: string;
  idGenerate: string;
  isAttended: string;
  textReminderConsent: string;
  createdBy: string;
  paymentMode: string;
  upiRefNumber: string;
  discount: number;
  discountType: string;
  discountBy: string;
  amount: number;
  paidAmount: number;
  pincode: string;
  addr1: string;
  addr2: string;
}

const AdminDetails: React.FC<PartnerFormProps> = ({ countries, states, districts }) => {
  const [loading, setLoading] = useState(false);
  const [hasPartnerDetails, setHasPartnerDetails] = useState(false);
  const [statesList, setStatesList] = useState(states);
  const [districtsList, setDistrictsList] = useState(districts);
  const [districtVisible, setDistrictVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [showDiscountFields, setShowDiscountFields] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [returnAmount, setReturnAmount] = useState<number>(0);
  const [total, setTotal] = useState(200);
  const [showUpiRefField, setShowUpiRefField] = useState(false);

  // New state for age-based member tracking
  const [memberCounts, setMemberCounts] = useState<{
    under: number;
    maleChild: number;
    femaleChild: number;
    extraFemale: number;
  }>({
    under: 0,
    maleChild: 0,
    femaleChild: 0,
    extraFemale: 0,
  });

  const ROWS_PER_PAGE = 10;

  // Discount configuration
  const MAX_DISCOUNT_PERCENTAGE = 100;
  const DISCOUNT_PASSWORD = 'admin123';

  // Calculate base amount based on age-based fee structure
  const calculateBaseAmount = (counts: {
    under: number;
    maleChild: number;
    femaleChild: number;
    extraFemale: number;
  }) => {
    const baseAmount = 200; // Base amount for main registrant
    const underFee = counts.under * 0; // No fee for under 7
    const maleChildFee = counts.maleChild * 100; // Rs. 100 for male children 7-14
    const femaleChildFee = counts.femaleChild * 100; // Rs. 100 for female children 7-14
    const extraFemaleFee = counts.extraFemale * 200; // Rs. 200 for females 14+

    return baseAmount + underFee + maleChildFee + femaleChildFee + extraFemaleFee;
  };

  // Calculate discount amount ensuring it doesn't exceed total amount
  const calculateDiscountAmount = (discountValue: number, discountType: string, totalAmount: number) => {
    if (discountType === 'percentage') {
      const percentageDiscount = (totalAmount * discountValue) / 100;
      return Math.min(percentageDiscount, totalAmount);
    }
    return Math.min(discountValue, totalAmount);
  };

  const defaultValues = {
    id: '',
    mobileNumber: '',
    title: '',
    fullName: '',
    country: 'India',
    state: 'Andhra Pradesh',
    district: '',
    city: '',
    under: 0,
    maleChild: 0,
    femaleChild: 0,
    extraFemale: 0,
    idGenerate: '',
    searchTerm: '',
    isAttended: 'yes',
    textReminderConsent: false,
    searchMobileNumber: '',
    paymentMode: 'cash',
    upiRefNumber: '',
    discount: 0,
    discountType: 'fixed',
    discountBy: '',
    amount: 200,
    discountPassword: '',
    paidAmount: 0,
    pincode: '',
    addr1: '',
    addr2: '',
  };

  const methods = useForm<PartnerFormData>({
    mode: 'all',
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const watchPaymentMode = watch('paymentMode');
  const watchUnder = watch('under') || 0;
  const watchMaleChild = watch('maleChild') || 0;
  const watchFemaleChild = watch('femaleChild') || 0;
  const watchExtraFemale = watch('extraFemale') || 0;
  const watchDiscount = watch('discount') || 0;
  const watchDiscountType = watch('discountType') || 'fixed';
  const watchAmount = watch('amount') || 0;

  // Update UPI reference field visibility when payment mode changes
  useEffect(() => {
    setShowUpiRefField(watchPaymentMode === 'upi');
    if (watchPaymentMode !== 'upi') {
      setValue('upiRefNumber', '');
    }
  }, [watchPaymentMode, setValue]);

  // Calculate total amount whenever age-based members or discount changes
  useEffect(() => {
    const baseAmount = calculateBaseAmount(memberCounts);
    
    let finalAmount = baseAmount;
    let finalDiscount = 0;

    if (watchDiscount > 0) {
      finalDiscount = calculateDiscountAmount(watchDiscount, watchDiscountType, baseAmount);
      
      if (watchDiscountType === 'percentage' && watchDiscount > MAX_DISCOUNT_PERCENTAGE) {
        setDiscountError(`Discount cannot exceed ${MAX_DISCOUNT_PERCENTAGE}%`);
        finalDiscount = calculateDiscountAmount(MAX_DISCOUNT_PERCENTAGE, 'percentage', baseAmount);
      } else if (watchDiscountType === 'fixed' && watchDiscount > baseAmount) {
        setDiscountError(`Discount cannot exceed total amount ₹${baseAmount}`);
        finalDiscount = baseAmount;
      } else {
        setDiscountError('');
      }

      finalAmount = Math.max(0, baseAmount - finalDiscount);
    }

    setTotal(finalAmount);
    setValue('amount', finalAmount);
  }, [memberCounts, watchDiscount, watchDiscountType, setValue]);

  // Update member counts when form fields change
  useEffect(() => {
    setMemberCounts({
      under: watchUnder,
      maleChild: watchMaleChild,
      femaleChild: watchFemaleChild,
      extraFemale: watchExtraFemale,
    });
  }, [watchUnder, watchMaleChild, watchFemaleChild, watchExtraFemale]);

  // Calculate return amount whenever paidAmount or total changes
  useEffect(() => {
    setReturnAmount(paidAmount - total);
  }, [paidAmount, total]);

  // Update paid amount when form value changes
  useEffect(() => {
    const formPaidAmount = getValues('paidAmount') || 0;
    setPaidAmount(formPaidAmount);
  }, [getValues('paidAmount')]);

  const handleReset = () => {
    methods.reset(defaultValues);
    setDistrictVisible(false);
    setStatesList(states);
    setDistrictsList(districts);
    setHasPartnerDetails(false);
    setSearchResults([]);
    setSelectedResult(null);
    setSearchQuery('');
    setShowDiscountFields(false);
    setDiscountError('');
    setPaidAmount(0);
    setReturnAmount(0);
    setTotal(200);
    setShowUpiRefField(false);

    // Reset member counts
    setMemberCounts({ under: 0, maleChild: 0, femaleChild: 0, extraFemale: 0 });
  };

  const onSubmit = async (data: PartnerFormData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updated_by = user?.name || 'Unknown';

    // Validate discount password if discount is applied
    if (data.discount > 0) {
      if (!validateDiscountPassword()) {
        toast.error('Invalid discount password. Please check and try again.');
        setLoading(false);
        return;
      }
    }

    // Validate UPI reference number if payment mode is UPI
    if (data.paymentMode === 'upi' && !data.upiRefNumber?.trim()) {
      toast.error('UPI Reference Number is mandatory for UPI payments');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        id: data.id,
        fullName: data.fullName,
        title: data.title,
        country: data.country,
        state: data.state,
        district: data.district,
        city: data.city,
        extraFemale: String(data.extraFemale || 0),
        under: String(data.under || 0),
        maleChild: String(data.maleChild || 0),
        femaleChild: String(data.femaleChild || 0),
        mobileNumber: data.mobileNumber,
        searchMobileNumber: data.searchMobileNumber,
        idGenerate: data.idGenerate,
        isAttended: data.isAttended,
        updated_by: updated_by,
        textReminderConsent: data.textReminderConsent ? 'y' : 'n',
        paymentMode: data.paymentMode,
        upiRefNumber: data.upiRefNumber,
        discount: String(data.discount || 0),
        discountType: data.discountType,
        discountBy: data.discountBy,
        amount: String(data.amount || 0),
        paidAmount: String(data.paidAmount || 0),
        pincode: data.pincode,
        addr1: data.addr1,
        addr2: data.addr2,
      };

      const response = await fetch(`${config.BASE_URL}/editData`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseText = await response.text();
        toast.success(responseText, {
          position: 'top-center',
          richColors: true,
          icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
        });
        handleReset();
      } else {
        const responseText = await response.text();
        toast.error(responseText, {
          position: 'top-center',
          richColors: true,
          icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred during submission');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a mobile number, name, or ID to search');
      return;
    }

    setSearchLoading(true);

    try {
      const queryString = `input=${encodeURIComponent(searchQuery)}`;
      const url = `${config.BASE_URL}/isAttendedYes?${queryString}`;
      console.log('Request URL:', url);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to fetch visitor details');
      }

      if (!data || data.length === 0) {
        toast.info('No matching visitor found.');
        setSearchResults([]);
        return;
      }

      // Filter only attended visitors (case-insensitive check)
      const attendedVisitors = data.filter((visitor: SearchResult) =>
        visitor.isAttended?.toLowerCase() === 'yes'
      );

      if (attendedVisitors.length === 0) {
        toast.info('No attended visitors found with the provided details.');
        setSearchResults([]);
        return;
      }

      setSearchResults(attendedVisitors);
      setShowResultsDialog(true);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to fetch visitor details', {
        position: 'top-center',
        richColors: true,
        icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setSelectedResult(result);
    fillFormWithPartnerData(result);
    setShowResultsDialog(false);
    setSearchQuery('');
  };

  const fillFormWithPartnerData = async (data: SearchResult) => {
    // Reset form first to clear any previous values
    methods.reset(defaultValues);

    // Set basic form values
    setValue('id', data.id.toString());
    setValue('fullName', data.fullName || '');
    setValue('title', data.title || '');
    setValue('country', data.country || 'India');
    setValue('state', data.state || 'Andhra Pradesh');
    setValue('district', data.district || '');
    setValue('city', data.city || '');
    setValue('mobileNumber', data.mobileNumber || '');
    setValue('idGenerate', data.idGenerate || '');
    setValue('isAttended', data.isAttended || 'yes');
    setValue('searchMobileNumber', data.mobileNumber || '');
    setValue('textReminderConsent', data.textReminderConsent === 'y');
    setValue('paymentMode', data.paymentMode || 'cash');
    setValue('upiRefNumber', data.upiRefNumber || '');
    setValue('pincode', data.pincode || '');
    setValue('addr1', data.addr1 || '');
    setValue('addr2', data.addr2 || '');

    // Set age-based member counts
    const maleChild = parseInt(data.maleChild) || 0;
    const extraFemale = parseInt(data.extraFemale) || 0;
    const femaleChild = parseInt(data.femaleChild) || 0;
    const under = parseInt(data.under) || 0;

    setValue('maleChild', maleChild);
    setValue('extraFemale', extraFemale);
    setValue('femaleChild', femaleChild);
    setValue('under', under);

    // Update member counts state
    setMemberCounts({
      under,
      maleChild,
      femaleChild,
      extraFemale,
    });

    // Handle discount fields - IMPORTANT: Set discount BEFORE amount
    const discount = data.discount || 0;
    const discountType = data.discountType || 'fixed';
    const discountBy = data.discountBy || '';
    const amount = data.amount || 0;
    const paidAmount = data.paidAmount || 0;

    setValue('discount', discount);
    setValue('discountType', discountType);
    setValue('discountBy', discountBy);
    setValue('paidAmount', paidAmount);
    setValue('discountPassword', 'admin123');
    // setValue('')

    // Show discount fields if discount was applied
    if (discount > 0) {
      setShowDiscountFields(true);
    }

    // Set paid amount for display
    setPaidAmount(paidAmount);

    // Calculate and set the final amount
    const baseAmount = calculateBaseAmount({ under, maleChild, femaleChild, extraFemale });
    let finalAmount = baseAmount;

    if (discount > 0) {
      const discountAmount = calculateDiscountAmount(discount, discountType, baseAmount);
      finalAmount = Math.max(0, baseAmount - discountAmount);
    }

    setValue('amount', finalAmount);
    setTotal(finalAmount);

    // Handle country/state/district fetch logic
    if (data.country && data.country !== 'India') {
      const statesData = await getStates(data.country);
      setStatesList(statesData);
      setDistrictVisible(true);
    } else {
      const districtsData = await getDistricts(data.country || 'India', data.state || 'Andhra Pradesh');
      setDistrictsList(districtsData);
      setValue('district', data.district || '');
    }

    setHasPartnerDetails(true);
    toast.success('Visitor details loaded successfully');
  };

  // Handle discount field changes with validation
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    const baseAmount = calculateBaseAmount(memberCounts);

    if (watchDiscountType === 'percentage') {
      if (value > MAX_DISCOUNT_PERCENTAGE) {
        setDiscountError(`Discount cannot exceed ${MAX_DISCOUNT_PERCENTAGE}%`);
        setValue('discount', MAX_DISCOUNT_PERCENTAGE);
      } else {
        setDiscountError('');
        setValue('discount', value);
      }
    } else {
      // Fixed amount validation - ensure it doesn't exceed total amount
      if (value > baseAmount) {
        setDiscountError(`Discount cannot exceed total amount ₹${baseAmount}`);
        setValue('discount', baseAmount);
      } else {
        setDiscountError('');
        setValue('discount', value);
      }
    }
  };

  // Toggle discount fields visibility
  const toggleDiscountFields = () => {
    setShowDiscountFields(!showDiscountFields);
    if (!showDiscountFields) {
      setValue('discount', 0);
      setValue('discountType', 'fixed');
      setValue('discountPassword', '');
      setValue('discountBy', '');
      setDiscountError('');
    }
  };

  // Validate discount password
  const validateDiscountPassword = () => {
    const password = getValues('discountPassword');
    if (password !== DISCOUNT_PASSWORD) {
      setDiscountError('Invalid discount password');
      return false;
    }
    setDiscountError('');
    return true;
  };

  const filteredResults = useMemo(() => {
    return searchResults.filter(
      (partner) =>
        partner.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.mobileNumber?.includes(searchQuery) ||
        partner.idGenerate?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchResults, searchQuery]);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredResults.slice(start, start + ROWS_PER_PAGE);
  }, [filteredResults, currentPage]);

  const handleCountryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const country = e.target.value;
    setValue('country', country);
    const statesData = await getStates(country);
    setStatesList(statesData);
    setValue('state', statesData[0]?.value || '');
    setValue('district', '');
  };

  const handleStateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const state = e.target.value;
    setValue('state', state);
    const country = getValues('country');
    if (country === 'India') {
      const districtsData = await getDistricts(country, state);
      setDistrictsList(districtsData);
      setValue('district', districtsData[0]?.value || '');
    } else {
      setDistrictsList([]);
      setDistrictVisible(true);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ mt: 1 }}>
        <CardHeader title="Update Attended Visitor" />

        {/* Search Section */}
        <Grid2 container spacing={2} sx={{ px: 3, mt: 2, mb: 2 }}>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Search Attended Visitors (Mobile / Name / ID )"
              variant="outlined"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4, md: 2 }}>
            <LoadingButton
              startIcon={<Iconify icon="mingcute:search-3-line" />}
              variant="contained"
              onClick={handleSearch}
              loading={searchLoading}
              sx={{
                py: 1.5,
                mt: 0.5,
                '@media (max-width: 600px)': {
                  width: '100%'
                }
              }}
              size="small"
              fullWidth
            >
              Search
            </LoadingButton>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4, md: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleReset}
              color="error"
              size="small"
              startIcon={<Iconify icon="material-symbols:cancel-outline" />}
              sx={{ py: 1.5, mt: 0.5 }}
            >
              Cancel
            </Button>
          </Grid2>
        </Grid2>
      </Card>

      <Card sx={{ mt: 1 }}>
        {hasPartnerDetails && (
          <Card sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                '@media (max-width: 900px)': {
                  gridTemplateColumns: 'repeat(2, 1fr)',
                },
                '@media (max-width: 600px)': {
                  gridTemplateColumns: 'repeat(1, 1fr)',
                },
                gap: 2,
                p: 3,
              }}
            >
              <Field.Select name="title" label="Title" size="small" required>
                {titleOptions.map((option) => (
                  <MenuItem value={option.value} key={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="idGenerate" label="ID Generate" size="small" disabled />
              <Field.Text name="fullName" label="Full Name" size="small" required />
              <Field.Text name="mobileNumber" label="Mobile Number" size="small" required />

              <Field.Select
                name="state"
                label="State"
                size="small"
                required
                onChange={handleStateChange}
              >
                {statesList.map((option: { value: string; label: string }) => (
                  <MenuItem value={option.value} key={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select
                name="district"
                label="District"
                size="small"
                disabled={districtVisible}
                required
                style={{
                  display: districtVisible ? 'none' : 'block',
                }}
              >
                {districtsList.map((option: { value: string; label: string }) => (
                  <MenuItem value={option.value} key={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text label="Place" name="city" size="small" />
              <Field.Text name="pincode" label="Pincode" size="small" inputProps={{ maxLength: 6 }} />
              <Field.Text name="addr1" label="Address Line 1" size="small" />
              <Field.Text name="addr2" label="Address Line 2" size="small" />
            </Box>

            {/* Member Count and Payment Section */}
            <Box sx={{
              mt: 1,
              display: "grid",
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
              alignItems: "start"
            }}>
              {/* Left Side - Member Count Table */}
              <Box sx={{
                p: 1.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}>
                <MemberTable
                  setValue={setValue}
                  getValues={getValues}
                  under={watchUnder}
                  maleChild={watchMaleChild}
                  femaleChild={watchFemaleChild}
                  extraFemale={watchExtraFemale}
                  showQuickAdd={true}
                  mode="form"
                />
              </Box>

              {/* Right Side - Payment and Other Fields */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                p: 1.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
              }}>
                <Field.Select
                  name="paymentMode"
                  label="Payment Mode"
                  size="small"
                  required
                  sx={{ maxWidth: '200px' }}
                >
                  {paymentOptions.map((option) => (
                    <MenuItem value={option.value} key={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>

                {/* UPI Reference Number Field - Conditionally Rendered */}
                {showUpiRefField && (
                  <Field.Text
                    name="upiRefNumber"
                    label="UPI Reference Number"
                    size="small"
                    required={watchPaymentMode === 'upi'}
                    sx={{ maxWidth: '200px' }}
                  />
                )}

                {/* Discount Toggle Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Iconify icon={showDiscountFields ? "mingcute:up-line" : "mingcute:down-line"} />}
                  onClick={toggleDiscountFields}
                  sx={{ alignSelf: 'flex-start', mt: 1, maxWidth: '200px' }}
                >
                  {showDiscountFields ? 'Hide Discount Options' : 'Apply Discount'}
                </Button>

                {/* Discount Fields */}
                {showDiscountFields && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.5 }}>
                    <Field.Select
                      name="discountType"
                      label="Discount Type"
                      size="small"
                      sx={{ maxWidth: '200px' }}
                    >
                      <MenuItem value="fixed">Fixed Amount (₹)</MenuItem>
                      <MenuItem value="percentage">Percentage (%)</MenuItem>
                    </Field.Select>

                    <Field.Text
                      name="discount"
                      label={`Discount ${watchDiscountType === 'percentage' ? '(%)' : '(₹)'}`}
                      size="small"
                      type="number"
                      sx={{ maxWidth: '200px' }}
                      inputProps={{
                        min: 0,
                        max: watchDiscountType === 'percentage' ? MAX_DISCOUNT_PERCENTAGE : calculateBaseAmount(memberCounts)
                      }}
                      onChange={handleDiscountChange}
                      error={!!discountError}
                      helperText={discountError}
                    />

                    <Field.Text
                      name="discountPassword"
                      label="Discount Password"
                      size="small"
                      type="password"
                      sx={{ maxWidth: '200px' }}
                      required={watchDiscount > 0}
                    />

                    <Field.Text
                      name="discountBy"
                      label="Approved By"
                      sx={{ maxWidth: '200px' }}
                      size="small"
                      required={watchDiscount > 0}
                    />

                    {discountError && (
                      <Alert severity="error">
                        {discountError}
                      </Alert>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Payment Details Section - Fixed at bottom */}
            <Box sx={{ borderColor: 'divider' }}>
              {/* Amount Display */}
              <Box sx={{ p: 3, bgcolor: 'primary.inherit', color: 'inherit' }}>
                <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Grid2 container spacing={2} alignItems="center" justifyContent="flex-end" display={"grid"}>
                    {/* Paid Amount Input */}
                    <Grid2 size={{ xs: 12, sm: 12 }}>
                      <TextField
                        fullWidth
                        label="Paid Amount"
                        type="number"
                        value={paidAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newPaidAmount = Number(e.target.value);
                          setPaidAmount(newPaidAmount);
                          setValue('paidAmount', newPaidAmount);
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        variant="outlined"
                        size="small"
                      />
                    </Grid2>

                    {/* Return Amount Display */}
                    <Grid2 size={{ xs: 12, sm: 12 }}>
                      <Box sx={{
                        p: 1,
                        bgcolor: returnAmount >= 0 ? 'success.light' : 'error.light',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}>
                        <Typography variant="body1" fontWeight="bold">
                          {returnAmount >= 0 ? 'Return: ₹' : 'Due: ₹'}{Math.abs(returnAmount)}
                        </Typography>
                      </Box>
                    </Grid2>
                  </Grid2>
                </Box>

                {/* Total Amount Display */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                  <Box>
                    {watchDiscount > 0 && (
                      <Typography variant="body2" color="error">
                        Discount Applied: {watchDiscount}{watchDiscountType === 'percentage' ? '%' : '₹'}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      Payment Mode: {watchPaymentMode === 'upi' ? 'UPI' : 'Cash'}
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    Total Amount: ₹{total}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{
                px: 3,
                py: 2,
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                '@media (max-width: 600px)': {
                  flexDirection: 'column',
                  gap: 2
                }
              }}>
                <Button variant="outlined" color="error" onClick={handleReset}>
                  Cancel
                </Button>
                <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                  Update Visitor
                </LoadingButton>
              </Box>
            </Box>
          </Card>
        )}
      </Card>

      {/* Search Results Dialog */}
      <Dialog
        open={showResultsDialog}
        onClose={() => setShowResultsDialog(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            '@media (max-width: 600px)': {
              margin: 1,
              width: 'calc(100% - 16px)',
              maxHeight: 'calc(100% - 16px)'
            }
          }
        }}
      >
        <DialogTitle>Select Attended Visitor</DialogTitle>
        <DialogContent>
          <TextField
            label="Search visitors..."
            fullWidth
            margin="dense"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Found {filteredResults.length} attended visitor(s) for "{searchQuery}"
          </Typography>

          {filteredResults.length > 0 ? (
            <Paper variant="outlined">
              <List>
                {paginatedResults.map((partner, index) => (
                  <ListItem key={partner.id} divider={index < paginatedResults.length - 1}>
                    <ListItemButton onClick={() => handleSelectResult(partner)}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {partner.title} {partner.fullName}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              Mobile: {partner.mobileNumber}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              Location: {partner.city}, {partner.district}, {partner.state}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              ID: {partner.idGenerate}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              Child Male({partner.maleChild}), Child Female({partner.femaleChild}), Under 7({partner.under}), Extra Female({partner.extraFemale})
                            </Typography>
                            <br />
                            <br />
                            <Typography variant="body2" component="span" color="primary">
                              Created by: {partner.createdBy}
                            </Typography>
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              <Box display="flex" justifyContent="center" mt={2} pb={2}>
                <Pagination
                  count={Math.ceil(filteredResults.length / ROWS_PER_PAGE)}
                  page={currentPage}
                  onChange={(event, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            </Paper>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              No attended visitors found
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowResultsDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Form>
  );
};

export default AdminDetails;