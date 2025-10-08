'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
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
  Grid2,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { getDistricts, getStates } from 'src/utils/helpers';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import LoadingButton from '@mui/lab/LoadingButton';
import { titleOptions, typeOptions } from 'src/constants/selectoptions';
import { config } from 'src/constants/helpers';

interface PartnerFormProps {
  countries: { value: string; label: string }[];
  states: { value: string; label: string }[];
  districts: { value: string; label: string }[];
}

interface PartnerFormData {
  mobileNumber: string;
  title: string;
  searchTerm: string;
  type: string;
  fullName: string;
  churchName: string;
  city: string;
  country: string;
  state: string;
  district: string;
  addressLine1: string;
  addressLine2: string;
  paymentMode: string;
  upiRefNumber: string;
  extraMale: string;
  extraFemale: string;
  extraChild: string;
  discount: number;
  memberList: Member[];
}

interface Partner {
  id: number;
  title: string;
  fullName: string;
  gender: string;
  mobileNumber: string;
  email: string;
  churchName: string;
  churchType: string;
  addr1: string;
  addr2: string;
  city: string;
  country: string;
  state: string;
  district: string;
  pincode: string;
  createdAt: string;
  isAttended: string;
  // Add other properties as needed
}

interface Member {
  id: string;
  name: string;
  gender: string;
  status: boolean;
  age: string;
}

const PartnerDetails: React.FC<PartnerFormProps> = ({ countries, states, districts }) => {
  const [loading, setLoading] = useState(false);
  const [hasPartnerDetails, setHasPartnerDetails] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [statesList, setStatesList] = useState(states);
  const [districtsList, setDistrictsList] = useState(districts);
  const [districtVisible, setDistrictVisible] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [isAttended, setIsAttended] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const ROWS_PER_PAGE = 10;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user?.role || '');
    setUserName(user?.name || '');
  }, []);

  const canEdit = isAttended !== 'yes' || userRole === 'Admin';

  const defaultValues = {
    mobileNumber: '',
    title: '',
    fullName: '',
    country: 'India',
    state: 'Tamil Nadu',
    district: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
    paymentMode: 'Cash',
    upiRefNumber: '',
    discount: 0,
    memberList: [] as Member[],
    extraMale: '0',
    churchName: '',
    extraFemale: '0',
    extraChild: '0',
    searchTerm: '',
    idGenerate: '',
    type: 'Stayer',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues
  });

  const { handleSubmit, setValue, getValues, formState: { isSubmitting } } = methods;

  const handleReset = () => {
    methods.reset(defaultValues);
    setMembers([]);
    setDistrictVisible(false);
    setStatesList(states);
    setDistrictsList(districts);
    setHasPartnerDetails(false);
    setSearchResults([]);
    setProfileId(null);
    setIsAttended('');
  };

  const onSubmit = async (data: PartnerFormData) => {
    setLoading(true);
    const created_by = userName || 'Unknown';

    const payload = {
      id: null,
      profileId: profileId,
      full_name: data.fullName,
      title: data.title,
      churchName: data.churchName,
      country: data.country,
      state: data.state,
      district: data.district,
      city: data.city,
      extraMale: data.extraMale,
      extraFemale: data.extraFemale,
      extraChild: data.extraChild,
      mobileNumber: data.mobileNumber,
      type: data.type,
      created_by,
      isAttended: 'yes',
      isOnline: 'yes',
      textReminderConsent: 'n',
    };

    try {
      const response = await fetch(`${config.BASE_URL}/addDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      if (response.status === 200 || response.status === 201) {
        const message = isJson ? (await response.json()).message : await response.text();
        toast.success(message || 'Submitted successfully', {
          position: 'top-center',
          icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
        });
        handleReset();
      } else {
        const message = isJson ? (await response.json()).message : await response.text();
        toast.error(message || 'Bad request or server error', {
          position: 'top-center',
          icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred during submission', {
        position: 'top-center',
        icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const transformFamilyMembers = (members: any[]): Member[] => {
    if (!members) return [];
    return members.map((member) => ({
      id: member.profile_id || uuidv4(),
      name: member.member_name || "Unknown",
      gender: member.member_gender || "N/A",
      status: true,
      age: member.member_age?.toString() || "0",
    }));
  };

  const fetchPartnerDetails = async (): Promise<void> => {
    const input = getValues('searchTerm')?.trim() || '';

    if (!input) {
      toast.error('Please enter a mobile number, name, or ID');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.BASE_URL}/visitors?input=${encodeURIComponent(input)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Partner | Partner[] = await response.json();
      console.log('Fetched partner data:', data);

      // Normalize the response to always be an array
      const results: Partner[] = Array.isArray(data) ? data : [data];

      if (results.length > 1) {
        setSearchResults(results);
        setShowResultsDialog(true);
      } else if (results.length === 1) {
        const partner = results[0];
        fillFormWithPartnerData(partner);
        setProfileId(partner.id.toString()); // FIXED: Convert number to string
        toast.success('Partner details loaded successfully', {
          position: "top-center",
          icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
        });
      } else {
        toast.info('No matching partner found', {
          position: "top-center",
          icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (error instanceof Error && error.message.includes('404')) {
        toast.error('Partner not found', {
          position: "top-center",
          icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
        });
      } else {
        toast.error('Failed to connect to partner service', {
          position: "top-center",
          icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fillFormWithPartnerData = (data: any) => {
    console.log('Filling form with data:', data);
    
    setValue('fullName', data.fullName || data.full_name || '');
    setValue('title', data.title || '');
    setValue('churchName', data.churchName || '');
    setValue('type', data.type || 'Stayer');
    setValue('country', data.country || 'India');
    setValue('state', data.state || 'Tamil Nadu');
    setValue('district', data.district || '');
    setValue('city', data.city || '');
    setValue('extraMale', data.extraMale || data.extrafuild || '0');
    setValue('extraFemale', data.extraFemale || data.extrafemale || '0');
    setValue('extraChild', data.extraChild || '0');
    setValue('mobileNumber', data.mobileNumber || data.nobileNumber || '');

    setIsAttended(data.isAttended || '');

    if (data.country !== 'India') {
      getStates(data.country).then(statesData => {
        setStatesList(statesData);
        setDistrictVisible(true);
      });
    } else {
      getDistricts(data.country, data.state).then(districtsData => {
        setDistrictsList(districtsData);
        setValue('district', data.district || '');
      });
    }

    const transformedMembers = transformFamilyMembers(data.familyMembers || []);
    setMembers(transformedMembers);
    setValue('memberList', transformedMembers);
    setHasPartnerDetails(true);
  };

  const handleSelectPartner = (partner: any) => {
    fillFormWithPartnerData(partner);
    setProfileId(partner.id.toString()); // FIXED: Convert number to string
    setShowResultsDialog(false);
  };

  const filteredResults = useMemo(() => {
    return searchResults.filter(partner =>
      partner.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.mobileNumber?.includes(searchQuery) ||
      partner.idGenerate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.type?.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{gap: 2, display: 'flex', flexDirection: 'column'}}>

        <Card sx={{ mt: 1 }}>
          <CardHeader title="Search Partner" />
          <Divider />
          <Grid2 container spacing={2} sx={{ px: 3, mt: 2, mb: 2 }}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <TextField
                label="Search (Mobile / Name / ID)"
                variant="outlined"
                fullWidth
                size="small"
                {...methods.register('searchTerm')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    fetchPartnerDetails();
                  }
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 2, lg: 1 }}>
              <LoadingButton
                startIcon={<Iconify icon="mingcute:search-3-line" />}
                variant="outlined"
                onClick={fetchPartnerDetails}
                loading={loading}
                sx={{ py: 1.5, mt: 0.5 }}
                size="small"
                fullWidth
              >
                Search
              </LoadingButton>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 2, lg: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleReset}
                color="error"
                size="small"
                startIcon={<Iconify icon="material-symbols:cancel-outline" />}
                sx={{ py: 1.5, mt: 0.5 }}
              >
                Clear
              </Button>
            </Grid2>
          </Grid2>
        </Card>

        {hasPartnerDetails && (
          <Card>
            <CardHeader title="Partner Details" />
            <Divider />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, p: 3 }}>
              <Field.Select name="title" label="Title" size="small" required>
                {titleOptions.map((option) => (
                  <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="fullName" label="Full Name" size="small" required />
              <Field.Text name="churchName" label="Church Name" size="small" required />
              <Field.Text name="mobileNumber" label="Mobile Number" size="small" required />
              <Field.Select name="type" label="Type" size="small" required>
                {typeOptions.map((option) => (
                  <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="country" label="Country" size="small" required onChange={handleCountryChange}>
                {countries.map((option) => (
                  <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                ))}
              </Field.Select>
              <Field.Select name="state" label="State" size="small" required onChange={handleStateChange}>
                {statesList.map((option) => (
                  <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                ))}
              </Field.Select>
              <Field.Select
                name="district"
                label="District"
                size="small"
                style={{ display: districtVisible ? 'none' : 'block' }}
              >
                {districtsList.map((option) => (
                  <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="city" label="City" size="small" />
              <Field.Text name="extraMale" label="Extra Male" size="small" type="number" />
              <Field.Text name="extraFemale" label="Extra Female" size="small" type="number" />
              <Field.Text name="extraChild" label="Extra Child" size="small" type="number" />
            </Box>

            <Divider />

            <Box sx={{ px: 3, py: 2, display: 'flex', gap: 3, justifyContent: 'center' }}>
              <Button variant="outlined" color="error" onClick={handleReset}>
                Cancel
              </Button>

              {canEdit && (
                <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                  Check in
                </LoadingButton>
              )}
            </Box>
          </Card>
        )}

        {isAttended === 'yes' && (
          <Alert severity="info" sx={{ mt: 2 }}>
            This partner has already been checked in. Only administrators can modify checked-in records.
          </Alert>
        )}

      </Box>

      <Dialog open={showResultsDialog} onClose={() => setShowResultsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Select Partner</DialogTitle>
        <DialogContent>
          <TextField
            label="Search partners..."
            fullWidth
            margin="dense"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Mobile</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedResults.map((partner) => (
                <TableRow
                  key={partner.id}
                  hover
                  onClick={() => handleSelectPartner(partner)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{partner.idGenerate || partner.id}</TableCell>
                  <TableCell>{partner.full_name || 'Unknown'}</TableCell>
                  <TableCell>{partner.mobileNumber || 'Unknown number'}</TableCell>
                  <TableCell>{`${partner.district || 'Unknown district'}, ${partner.state || 'Unknown state'}`}</TableCell>
                  <TableCell>
                    <Chip 
                      label={partner.isAttended === 'yes' ? 'Checked In' : 'Not Checked In'} 
                      color={partner.isAttended === 'yes' ? 'success' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil(filteredResults.length / ROWS_PER_PAGE)}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowResultsDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </Form>
  );
};

export default PartnerDetails;

// /3rd
// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { v4 as uuidv4 } from 'uuid';
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
//   Divider,
//   Grid2,
//   MenuItem,
//   TextField,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Pagination,
//   Chip,
//   Alert,
//   CircularProgress,
// } from '@mui/material';
// import { getDistricts, getStates } from 'src/utils/helpers';
// import { Field, Form } from 'src/components/hook-form';
// import { Iconify } from 'src/components/iconify';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { titleOptions, typeOptions } from 'src/constants/selectoptions';
// import { config } from 'src/constants/helpers';

// interface PartnerFormProps {
//   countries: { value: string; label: string }[];
//   states: { value: string; label: string }[];
//   districts: { value: string; label: string }[];
// }

// interface PartnerFormData {
//   mobileNumber: string;
//   title: string;
//   searchTerm: string;
//   type: string;
//   fullName: string;
//   churchName: string;
//   city: string;
//   country: string;
//   state: string;
//   district: string;
//   addressLine1: string;
//   addressLine2: string;
//   paymentMode: string;
//   upiRefNumber: string;
//   extraMale: string;
//   extraFemale: string;
//   extraChild: string;
//   discount: number;
//   memberList: Member[];
// }

// interface Partner {
//   id: number;
//   title: string;
//   fullName: string;
//   gender: string;
//   mobileNumber: string;
//   email: string;
//   churchName: string;
//   churchType: string;
//   addr1: string;
//   addr2: string;
//   city: string;
//   country: string;
//   state: string;
//   district: string;
//   pincode: string;
//   createdAt: string;
//   isAttended: string;
//   // Add other properties as needed
// }

// interface Member {
//   id: string;
//   name: string;
//   gender: string;
//   status: boolean;
//   age: string;
// }

// const PartnerDetails: React.FC<PartnerFormProps> = ({ countries, states, districts }) => {
//   const [loading, setLoading] = useState(false);
//   const [hasPartnerDetails, setHasPartnerDetails] = useState(false);
//   const [profileId, setProfileId] = useState<string | null>(null);
//   const [statesList, setStatesList] = useState(states);
//   const [districtsList, setDistrictsList] = useState(districts);
//   const [districtVisible, setDistrictVisible] = useState(false);
//   const [members, setMembers] = useState<Member[]>([]);
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [showResultsDialog, setShowResultsDialog] = useState(false);
//   const [isAttended, setIsAttended] = useState('');
//   const [userRole, setUserRole] = useState('');
//   const [userName, setUserName] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const ROWS_PER_PAGE = 10;

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     setUserRole(user?.role || '');
//     setUserName(user?.name || '');
//   }, []);

//   const canEdit = isAttended !== 'yes' || userRole === 'Admin';

//   const defaultValues = {
//     mobileNumber: '',
//     title: '',
//     fullName: '',
//     country: 'India',
//     state: 'Tamil Nadu',
//     district: '',
//     city: '',
//     addressLine1: '',
//     addressLine2: '',
//     paymentMode: 'Cash',
//     upiRefNumber: '',
//     discount: 0,
//     memberList: [] as Member[],
//     extraMale: '0',
//     churchName: '',
//     extraFemale: '0',
//     extraChild: '0',
//     searchTerm: '',
//     idGenerate: '',
//     type: 'Stayer',
//   };

//   const methods = useForm({
//     mode: 'all',
//     defaultValues
//   });

//   const { handleSubmit, setValue, getValues, formState: { isSubmitting } } = methods;

//   const handleReset = () => {
//     methods.reset(defaultValues);
//     setMembers([]);
//     setDistrictVisible(false);
//     setStatesList(states);
//     setDistrictsList(districts);
//     setHasPartnerDetails(false);
//     setSearchResults([]);
//     setProfileId(null);
//     setIsAttended('');
//   };

//   const onSubmit = async (data: PartnerFormData) => {
//     setLoading(true);
//     const created_by = userName || 'Unknown';

//     const payload = {
//       id: null,
//       profileId: profileId,
//       full_name: data.fullName,
//       title: data.title,
//       churchName: data.churchName,
//       country: data.country,
//       state: data.state,
//       district: data.district,
//       city: data.city,
//       extraMale: data.extraMale,
//       extraFemale: data.extraFemale,
//       extraChild: data.extraChild,
//       mobileNumber: data.mobileNumber,
//       type: data.type,
//       created_by,
//       isAttended: 'yes',
//       isOnline: 'yes',
//       textReminderConsent: 'n',
//     };

//     try {
//       const response = await fetch(`${config.BASE_URL}/addDetails`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const contentType = response.headers.get('content-type') || '';
//       const isJson = contentType.includes('application/json');

//       if (response.status === 200 || response.status === 201) {
//         const message = isJson ? (await response.json()).message : await response.text();
//         toast.success(message || 'Submitted successfully', {
//           position: 'top-center',
//           icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//         });
//         handleReset();
//       } else {
//         const message = isJson ? (await response.json()).message : await response.text();
//         toast.error(message || 'Bad request or server error', {
//           position: 'top-center',
//           icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//         });
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       toast.error('An error occurred during submission', {
//         position: 'top-center',
//         icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformFamilyMembers = (members: any[]): Member[] => {
//     if (!members) return [];
//     return members.map((member) => ({
//       id: member.profile_id || uuidv4(),
//       name: member.member_name || "Unknown",
//       gender: member.member_gender || "N/A",
//       status: true,
//       age: member.member_age?.toString() || "0",
//     }));
//   };

  

// const fetchPartnerDetails = async (): Promise<void> => {
//   const input = getValues('searchTerm')?.trim() || '';

//   if (!input) {
//     toast.error('Please enter a mobile number, name, or ID');
//     return;
//   }

//   setLoading(true);

//   try {
//     const response = await fetch(`${config.BASE_URL}/visitors?input=${encodeURIComponent(input)}`);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data: Partner | Partner[] = await response.json();
//     console.log('Fetched partner data:', data);

//     // Normalize the response to always be an array
//     const results: Partner[] = Array.isArray(data) ? data : [data];

//     if (results.length > 1) {
//       setSearchResults(results);
//       setShowResultsDialog(true);
//     } else if (results.length === 1) {
//       const partner = results[0];
//       fillFormWithPartnerData(partner);
//       setProfileId(partner.id);
//       toast.success('Partner details loaded successfully', {
//         position: "top-center",
//         icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//       });
//     } else {
//       toast.info('No matching partner found', {
//         position: "top-center",
//         icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//       });
//     }
//   } catch (error) {
//     console.error('Fetch error:', error);
//     if (error instanceof Error && error.message.includes('404')) {
//       toast.error('Partner not found', {
//         position: "top-center",
//         icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//       });
//     } else {
//       toast.error('Failed to connect to partner service', {
//         position: "top-center",
//         icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//       });
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   // const fetchPartnerDetails = async () => {
//   //   const input = getValues('searchTerm')?.trim() || '';

//   //   if (!input) {
//   //     toast.error('Please enter a mobile number, name, or ID');
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     const response = await fetch(`${config.BASE_URL}/visitors?input=${encodeURIComponent(input)}`);
//   //     console.log('Response status:', response.status);

//   //     if (response.status === 200) {
//   //       const data = await response.json();
//   //       console.log('Fetched partner data:', data);

//   //       if (data && Array.isArray(data)) {
//   //         if (data.length > 1) {
//   //           setSearchResults(data);
//   //           setShowResultsDialog(true);
//   //         } else if (data.length === 1) {
//   //           const partner = data[0];
//   //           fillFormWithPartnerData(partner);
//   //           setProfileId(partner.id);
//   //           toast.success('Partner details loaded successfully', {
//   //             position: "top-center",
//   //             icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//   //           });
//   //         } else {
//   //           toast.info('No matching partner found', {
//   //             position: "top-center",
//   //             icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//   //           });
//   //         }
//   //       } else {
//   //         toast.error('Invalid response format from server', {
//   //           position: "top-center",
//   //           icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//   //         });
//   //       }
//   //     } else if (response.status === 404) {
//   //       toast.error('Partner not found', {
//   //         position: "top-center",
//   //         icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//   //       });
//   //     } else {
//   //       toast.error(`Error fetching partner details: ${response.status}`, {
//   //         position: "top-center",
//   //         icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error('Fetch error:', error);
//   //     toast.error('Failed to connect to partner service', {
//   //       position: "top-center",
//   //       icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//   //     });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fillFormWithPartnerData = (data: any) => {
//     console.log('Filling form with data:', data);
    
//     setValue('fullName', data.fullName || data.full_name || '');
//     setValue('title', data.title || '');
//     setValue('churchName', data.churchName || '');
//     setValue('type', data.type || 'Stayer');
//     setValue('country', data.country || 'India');
//     setValue('state', data.state || 'Tamil Nadu');
//     setValue('district', data.district || '');
//     setValue('city', data.city || '');
//     setValue('extraMale', data.extraMale || data.extrafuild || '0');
//     setValue('extraFemale', data.extraFemale || data.extrafemale || '0');
//     setValue('extraChild', data.extraChild || '0');
//     setValue('mobileNumber', data.mobileNumber || data.nobileNumber || '');

//     setIsAttended(data.isAttended || '');

//     if (data.country !== 'India') {
//       getStates(data.country).then(statesData => {
//         setStatesList(statesData);
//         setDistrictVisible(true);
//       });
//     } else {
//       getDistricts(data.country, data.state).then(districtsData => {
//         setDistrictsList(districtsData);
//         setValue('district', data.district || '');
//       });
//     }

//     const transformedMembers = transformFamilyMembers(data.familyMembers || []);
//     setMembers(transformedMembers);
//     setValue('memberList', transformedMembers);
//     setHasPartnerDetails(true);
//   };

//   const handleSelectPartner = (partner: any) => {
//     fillFormWithPartnerData(partner);
//     setProfileId(partner.id);
//     setShowResultsDialog(false);
//   };

//   const filteredResults = useMemo(() => {
//     return searchResults.filter(partner =>
//       partner.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       partner.mobileNumber?.includes(searchQuery) ||
//       partner.idGenerate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       partner.type?.toLowerCase().includes(searchQuery.toLowerCase())
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

//   return (
//     <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Box sx={{gap: 2, display: 'flex', flexDirection: 'column'}}>

//         <Card sx={{ mt: 1 }}>
//           <CardHeader title="Search Partner" />
//           <Divider />
//           <Grid2 container spacing={2} sx={{ px: 3, mt: 2, mb: 2 }}>
//             <Grid2 size={{ xs: 12, md: 4 }}>
//               <TextField
//                 label="Search (Mobile / Name / ID)"
//                 variant="outlined"
//                 fullWidth
//                 size="small"
//                 {...methods.register('searchTerm')}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     e.preventDefault();
//                     fetchPartnerDetails();
//                   }
//                 }}
//               />
//             </Grid2>
//             <Grid2 size={{ xs: 12, md: 2, lg: 1 }}>
//               <LoadingButton
//                 startIcon={<Iconify icon="mingcute:search-3-line" />}
//                 variant="contained"
//                 onClick={fetchPartnerDetails}
//                 loading={loading}
//                 sx={{ py: 1.5, mt: 0.5 }}
//                 size="small"
//                 fullWidth
//               >
//                 Search
//               </LoadingButton>
//             </Grid2>
//             <Grid2 size={{ xs: 12, md: 2, lg: 1 }}>
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 onClick={handleReset}
//                 color="error"
//                 size="small"
//                 startIcon={<Iconify icon="material-symbols:cancel-outline" />}
//                 sx={{ py: 1.5, mt: 0.5 }}
//               >
//                 Clear
//               </Button>
//             </Grid2>
//           </Grid2>
//         </Card>

//         {hasPartnerDetails && (
//           <Card>
//             <CardHeader title="Partner Details" />
//             <Divider />
//             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, p: 3 }}>
//               <Field.Select name="title" label="Title" size="small" required>
//                 {titleOptions.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>
//               <Field.Text name="fullName" label="Full Name" size="small" required />
//               <Field.Text name="churchName" label="Church Name" size="small" required />
//               <Field.Text name="mobileNumber" label="Mobile Number" size="small" required />
//               <Field.Select name="type" label="Type" size="small" required>
//                 {typeOptions.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>

//               <Field.Select name="country" label="Country" size="small" required onChange={handleCountryChange}>
//                 {countries.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>
//               <Field.Select name="state" label="State" size="small" required onChange={handleStateChange}>
//                 {statesList.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>
//               <Field.Select
//                 name="district"
//                 label="District"
//                 size="small"
//                 style={{ display: districtVisible ? 'none' : 'block' }}
//               >
//                 {districtsList.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>
//               <Field.Text name="city" label="City" size="small" />
//               <Field.Text name="extraMale" label="Extra Male" size="small" type="number" />
//               <Field.Text name="extraFemale" label="Extra Female" size="small" type="number" />
//               <Field.Text name="extraChild" label="Extra Child" size="small" type="number" />
//             </Box>

//             <Divider />

//             <Box sx={{ px: 3, py: 2, display: 'flex', gap: 3, justifyContent: 'center' }}>
//               <Button variant="outlined" color="error" onClick={handleReset}>
//                 Cancel
//               </Button>

//               {canEdit && (
//                 <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
//                   Check in
//                 </LoadingButton>
//               )}
//             </Box>
//           </Card>
//         )}

//         {isAttended === 'yes' && (
//           <Alert severity="info" sx={{ mt: 2 }}>
//             This partner has already been checked in. Only administrators can modify checked-in records.
//           </Alert>
//         )}

//       </Box>

//       <Dialog open={showResultsDialog} onClose={() => setShowResultsDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Select Partner</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Search partners..."
//             fullWidth
//             margin="dense"
//             size="small"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><strong>ID</strong></TableCell>
//                 <TableCell><strong>Name</strong></TableCell>
//                 <TableCell><strong>Mobile</strong></TableCell>
//                 <TableCell><strong>Location</strong></TableCell>
//                 <TableCell><strong>Status</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedResults.map((partner) => (
//                 <TableRow
//                   key={partner.id}
//                   hover
//                   onClick={() => handleSelectPartner(partner)}
//                   sx={{ cursor: 'pointer' }}
//                 >
//                   <TableCell>{partner.idGenerate || partner.id}</TableCell>
//                   <TableCell>{partner.full_name || 'Unknown'}</TableCell>
//                   <TableCell>{partner.mobileNumber || 'Unknown number'}</TableCell>
//                   <TableCell>{`${partner.district || 'Unknown district'}, ${partner.state || 'Unknown state'}`}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={partner.isAttended === 'yes' ? 'Checked In' : 'Not Checked In'} 
//                       color={partner.isAttended === 'yes' ? 'success' : 'default'} 
//                       size="small" 
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <Box display="flex" justifyContent="center" mt={2}>
//             <Pagination
//               count={Math.ceil(filteredResults.length / ROWS_PER_PAGE)}
//               page={currentPage}
//               onChange={(event, page) => setCurrentPage(page)}
//               color="primary"
//             />
//           </Box>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setShowResultsDialog(false)}>Cancel</Button>
//         </DialogActions>
//       </Dialog>

//     </Form>
//   );
// };

// export default PartnerDetails;

//2nd
// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { v4 as uuidv4 } from 'uuid';
// import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
// import { toast } from 'src/components/snackbar';
// import {
//   Box,
//   Button,
//   Card,
//   CardHeader,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   Grid2,
//   InputLabel,
//   MenuItem,
//   Select,
//   Switch,
//   TextField,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Pagination,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from '@mui/material';

// import { getDistricts, getStates } from 'src/utils/helpers';
// import { Field, Form } from 'src/components/hook-form';
// import { Iconify } from 'src/components/iconify';
// import { DataGrid } from '@mui/x-data-grid';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { genderOptions, occupationOptions, titleOptions, typeOptions } from 'src/constants/selectoptions';
// import { config } from 'src/constants/helpers';

// interface PartnerFormProps {
//   countries: { value: string; label: string }[];
//   states: { value: string; label: string }[];
//   districts: { value: string; label: string }[];
// }

// interface PartnerFormData {
//   mobileNumber: string;
//   title: string;
//   searchTerm: string;
//   type: string;
//   fullName: string;
//   // occupation: string;
//   churchName: string;
//   city: string;
//   country: string;
//   state: string;
//   district: string;
//   addressLine1: string;
//   addressLine2: string;
//   paymentMode: string;
//   upiRefNumber: string;
//   extraMale: string;
//   extraFemale: string;
//   extraChild: string;
//   discount: number;
//   memberList: Member[];
// }

// interface Member {
//   id: string;
//   name: string;
//   gender: string;
//   status: boolean;
//   age: string;
// }

// enum Gender {
//   Male = 'male',
//   Female = 'female',
// }

// const PartnerDetails: React.FC<PartnerFormProps> = ({ countries, states, districts }) => {

//   const [loading, setLoading] = useState(false);
//   const [hasPartnerDetails, setHasPartnerDetails] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [gender, setGender] = useState<Gender | ''>('');
//   const [profileId, setProfileId] = useState<string | null>(null);
//   const [textReminderChecked, setTextReminderChecked] = useState(false);

//   const [memberName, setMemberName] = useState('');
//   const [age, setAge] = useState('');
//   const [statesList, setStatesList] = useState(states);
//   const [districtsList, setDistrictsList] = useState(districts);
//   const [districtVisible, setDistrictVisible] = useState(false);
//   const [members, setMembers] = useState<Member[]>([]);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [entries, setEntries] = useState<any[]>([]);
//   const [showResultsDialog, setShowResultsDialog] = useState(false);
//   const [isAttended, setIsAttended] = useState('');
//   // const [userRole, setUserRole] = useState('');

//   const [userRole, setUserRole] = useState('');
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     setUserRole(user?.role || '');
//     setUserName(user?.name || '');
//   }, []);

//   const canEdit = isAttended !== 'yes' || userRole === 'Admin';

//   const ROWS_PER_PAGE = 10;

//   const defaultValues = {
//     mobileNumber: '',
//     title: '',
//     fullName: '',
//     // occupation: 'others',
//     country: 'India',
//     state: 'Andhra Pradesh',
//     district: '',
//     city: '',
//     addressLine1: '',
//     addressLine2: '',
//     paymentMode: 'Cash',
//     upiRefNumber: '',
//     discount: 0,
//     memberList: [] as Member[],
//     extraMale: '0',
//     churchName: '',
//     extraFemale: '0',
//     extraChild: '0',
//     searchTerm: '',
//     idGenerate: '',
//     type: 'Stayer',
//   };

//   const methods = useForm({
//     mode: 'all',
//     defaultValues
//   });

//   const { handleSubmit, setValue, getValues, formState: { isSubmitting } } = methods;

//   const handleReset = () => {
//     methods.reset(defaultValues);
//     setMembers([]);
//     setErrorMsg('');
//     setDistrictVisible(false);
//     setStatesList(states);
//     setDistrictsList(districts);
//     setHasPartnerDetails(false);
//     setSearchResults([]);
//     setProfileId(null);
//   };

//   const onSubmit = async (data: PartnerFormData) => {
//     setLoading(true);
//     const created_by = userName || 'Unknown';

//     const payload = {
//       id: null,
//       profileId: profileId,
//       full_name: data.fullName,
//       title: data.title,
//       // occupation: data.occupation,
//       churchName: data.churchName,
//       country: data.country,
//       state: data.state,
//       district: data.district,
//       city: data.city,
//       extraMale: data.extraMale,
//       extraFemale: data.extraFemale,
//       extraChild: data.extraChild,
//       mobileNumber: data.mobileNumber,
//       type: data.type,
//       created_by,
//       isAttended: 'yes',
//       isOnline: 'yes',
//       textReminderConsent: 'n',
//     };

//     try {
//       const response = await fetch(`${config.BASE_URL}/addDetails`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const contentType = response.headers.get('content-type') || '';
//       const isJson = contentType.includes('application/json');

//       if (response.status === 200 || response.status === 201) {
//         const message = isJson ? (await response.json()).message : await response.text();
//         toast.success(message || 'Submitted successfully', {
//           position: 'top-center',
//           richColors: true,
//           icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//         });
//         handleReset();
//       } else {
//         const message = isJson ? (await response.json()).message : await response.text();
//         toast.error(message || 'Bad request or server error', {
//           position: 'top-center',
//           richColors: true,
//           icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//         });
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       toast.error('An error occurred during submission', {
//         position: 'top-center',
//         richColors: true,
//         icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformFamilyMembers = (members: any[]): Member[] => {
//     if (!members) return [];
//     return members.map((member) => ({
//       id: member.profile_id || uuidv4(),
//       name: member.member_name || "Unknown",
//       gender: member.member_gender || "N/A",
//       status: true,
//       age: member.member_age?.toString() || "0",
//     }));
//   };

//   const fetchPartnerDetails = async () => {
//     const input = getValues('searchTerm')?.trim() || '';

//     if (!input) {
//       toast.error('Please enter a mobile number, name, or ID');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${config.BASE_URL}/visitors?input=${encodeURIComponent(input)}`);

//       console.log(response, 'Fetch response');

//       if (response.status === 200) {
//         const data = await response.json();
//         console.log(data, 'Fetched partner data');

//         // Check if we have multiple results
//         if (data && data.length > 1) {
//           // Show dialog with multiple results
//           setSearchResults(data);
//           setShowResultsDialog(true);
//         } else if (data && data.length === 1) {
//           // Single result - fill the form directly
//           const partner = data[0];
//           fillFormWithPartnerData(partner);
//           setProfileId(partner.id);
//           toast.success('Partner details loaded successfully', {
//             position: "top-center",
//             richColors: true,
//             icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//           });
//         } else {
//           toast.info('No matching partner found', {
//             position: "top-center",
//             richColors: true,
//             icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//           });
//         }
//       } else if (response.status === 404) {
//         toast.error('Partner not found', {
//           position: "top-center",
//           richColors: true,
//           icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//         });
//       } else {
//         toast.error('Error fetching partner details', {
//           position: "top-center",
//           richColors: true,
//           icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//         });
//       }
//     } catch (error) {
//       toast.error('Failed to connect to partner service', {
//         position: "top-center",
//         richColors: true,
//         icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fillFormWithPartnerData = (data: any) => {
//     setValue('fullName', data.full_name || '');
//     setValue('title', data.title || '');
//     setValue('churchName', data.churchName || '');
//     setValue('type', data.type || 'Stayer');
//     setValue('country', data.country || 'India');
//     setValue('state', data.state || 'Andhra Pradesh');
//     setValue('district', data.district || '');
//     setValue('city', data.city || '');
//     setValue('extraMale', data.extraMale || '0');
//     setValue('extraFemale', data.extraFemale || '0');
//     setValue('extraChild', data.extraChild || '0');
//     setValue('mobileNumber', data.mobileNumber || '');


//     // Set isAttended status
//     setIsAttended(data.isAttended || '');

//     if (data.country !== 'India') {
//       getStates(data.country).then(statesData => {
//         setStatesList(statesData);
//         setDistrictVisible(true);
//       });
//     } else {
//       getDistricts(data.country, data.state).then(districtsData => {
//         setDistrictsList(districtsData);
//         setValue('district', data.district || '');
//       });
//     }

//     const transformedMembers = transformFamilyMembers(data.familyMembers || []);
//     setMembers(transformedMembers);
//     setValue('memberList', transformedMembers);
//     setHasPartnerDetails(true);
//   };

//   const handleSelectPartner = (partner: any) => {
//     fillFormWithPartnerData(partner);
//     setProfileId(partner.id);
//     setShowResultsDialog(false);
//   };

//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredResults = useMemo(() => {
//     return searchResults.filter(partner =>
//       partner.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       partner.mobileNumber?.includes(searchQuery) ||
//       partner.idGenerate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       partner.type?.toLowerCase().includes(searchQuery.toLowerCase())
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

//   return (
//     <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Box sx={{gap: 2, display: 'flex', flexDirection: 'column'}}>

//         <Card sx={{ mt: 1 }}>
//           <CardHeader title="Search Partner" />
//           <Divider />
//           <Grid2 container spacing={2} sx={{ px: 3, mt: 2, mb: 2 }}>
//             <Grid2 size={{ xs: 12, md: 4 }}>
//               <TextField
//                 label="Search (Mobile / Name / ID)"
//                 variant="outlined"
//                 fullWidth
//                 size="small"
//                 {...methods.register('searchTerm')}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     e.preventDefault();
//                     fetchPartnerDetails();
//                   }
//                 }}
//               />

//               {errorMsg && <Typography color="error">{errorMsg}</Typography>}
//             </Grid2>
//             <Grid2 size={{ xs: 12, md: 2, lg: 1 }}>
//               <LoadingButton
//                 startIcon={<Iconify icon="mingcute:search-3-line" />}
//                 variant="contained"
//                 onClick={fetchPartnerDetails}
//                 loading={loading}
//                 sx={{ py: 1.5, mt: 0.5 }}
//                 size="small"
//               />
//             </Grid2>
//             <Grid2 size={{ xs: 12, md: 2, lg: 1 }}>
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 onClick={handleReset}
//                 color="error"
//                 size="small"
//                 startIcon={<Iconify icon="material-symbols:cancel-outline" />}
//                 sx={{ py: 1.5, mt: 0.5 }}
//               />
//             </Grid2>
//           </Grid2>
//         </Card>


//         <Card>
//           {hasPartnerDetails && (
//             // <Card sx={{ mt: 1 }}>
//             // <CardHeader title="Partner Details" />
//             // <Divider />
//             <>
//               <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, p: 3 }}>
//                 <Field.Select name="title" label="Title" size="small" required>
//                   {titleOptions.map((option) => (
//                     <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                   ))}
//                 </Field.Select>
//                 <Field.Text name="fullName" label="Full Name" size="small" required />
//                 <Field.Text name="churchName" label="Church Name" size="small" required />
//                 <Field.Text name="mobileNumber" label="Mobile Number" size="small" required />
//                 <Field.Select name="type" label="Type" size="small" required>
//                   {typeOptions.map((option) => (
//                     <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                   ))}
//                 </Field.Select>

//                 <Field.Select name="country" label="Country" size="small" required onChange={handleCountryChange}>
//                   {countries.map((option) => (
//                     <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                   ))}
//                 </Field.Select>
//                 <Field.Select name="state" label="State" size="small" required onChange={handleStateChange}>
//                   {statesList.map((option) => (
//                     <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                   ))}
//                 </Field.Select>
//                 <Field.Select
//                   name="district"
//                   label="District"
//                   size="small"
//                   style={{ display: districtVisible ? 'none' : 'block' }}
//                 >
//                   {districtsList.map((option) => (
//                     <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                   ))}
//                 </Field.Select>
//                 <Field.Text name="city" label="City" size="small" />
//                 <Field.Text name="extraMale" label="Extra Male" size="small" type="number" />
//                 <Field.Text name="extraFemale" label="Extra Female" size="small" type="number" />
//                 <Field.Text name="extraChild" label="Extra Child" size="small" type="number" />
//               </Box>


//               <Divider />

//               <Box sx={{ px: 3, py: 2, display: 'flex', gap: 3, justifyContent: 'center' }}>
//                 <Button variant="outlined" color="error" onClick={handleReset}>
//                   Cancel
//                 </Button>

//                 {canEdit && (
//                   <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
//                     Check in
//                   </LoadingButton>
//                 )}
//               </Box>
//               {/* </Card> */}

//             </>
//           )}
//         </Card>


//       </Box>

//       <Dialog open={showResultsDialog} onClose={() => setShowResultsDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Select Partner</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Search partners..."
//             fullWidth
//             margin="dense"
//             size="small"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />

//           <Table sx={{ mt: 2 }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell><strong>ID</strong></TableCell>
//                 <TableCell><strong>Name</strong></TableCell>
//                 <TableCell><strong>Mobile</strong></TableCell>
//                 <TableCell><strong>Location</strong></TableCell>
//                 <TableCell><strong>Status</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedResults.map((partner) => (
//                 <TableRow
//                   key={partner.id}
//                   hover
//                   onClick={() => handleSelectPartner(partner)}
//                   sx={{ cursor: 'pointer' }}
//                 >
//                   <TableCell>{partner.idGenerate || partner.id}</TableCell>
//                   <TableCell>{partner.full_name || 'Unknown'}</TableCell>
//                   <TableCell>{partner.mobileNumber || 'Unknown number'}</TableCell>
//                   <TableCell>{`${partner.district || 'Unknown district'}, ${partner.state || 'Unknown state'}`}</TableCell>
//                   <TableCell>{partner.isAttended === 'yes' ? 'Checked In' : 'Not Checked In'}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <Box display="flex" justifyContent="center" mt={2}>
//             <Pagination
//               count={Math.ceil(filteredResults.length / ROWS_PER_PAGE)}
//               page={currentPage}
//               onChange={(event, page) => setCurrentPage(page)}
//               color="primary"
//             />
//           </Box>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setShowResultsDialog(false)}>Cancel</Button>
//         </DialogActions>
//       </Dialog>

//     </Form>
//   );
// };

// export default PartnerDetails;


//1st
// 'use client';

// //with members edit as like revival festival
// import { useEffect, useMemo, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { v4 as uuidv4 } from 'uuid';
// import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
// import { toast } from 'src/components/snackbar';
// import {
//   Box,
//   Button,
//   Card,
//   CardHeader,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   Grid2,
//   InputLabel,
//   MenuItem,
//   Select,
//   Switch,
//   TextField,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Pagination,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
// } from '@mui/material';

// import { getDistricts, getStates } from 'src/utils/helpers';
// import { Field, Form } from 'src/components/hook-form';
// import { Iconify } from 'src/components/iconify';
// import { DataGrid } from '@mui/x-data-grid';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { genderOptions, occupationOptions, titleOptions, typeOptions } from 'src/constants/selectoptions';
// import { config } from 'src/constants/helpers';

// interface PartnerFormProps {
//   countries: { value: string; label: string }[];
//   states: { value: string; label: string }[];
//   districts: { value: string; label: string }[];
// }

// interface PartnerFormData {
//   mobileNumber: string;
//   title: string;
//   searchTerm: string;
//   type: string;
//   fullName: string;
//   // occupation: string;
//   churchName: string;
//   city: string;
//   country: string;
//   state: string;
//   district: string;
//   addressLine1: string;
//   addressLine2: string;
//   paymentMode: string;
//   upiRefNumber: string;
//   extraMale: string;
//   extraFemale: string;
//   extraChild: string;
//   discount: number;
//   memberList: Member[];
// }

// interface Member {
//   id: string;
//   name: string;
//   gender: string;
//   status: boolean;
//   age: string;
// }

// enum Gender {
//   Male = 'male',
//   Female = 'female',
// }

// const PartnerDetails: React.FC<PartnerFormProps> = ({ countries, states, districts }) => {

//   const [loading, setLoading] = useState(false);
//   const [hasPartnerDetails, setHasPartnerDetails] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [gender, setGender] = useState<Gender | ''>('');
//   const [profileId, setProfileId] = useState<string | null>(null);
//   const [textReminderChecked, setTextReminderChecked] = useState(false);

//   const [memberName, setMemberName] = useState('');
//   const [age, setAge] = useState('');
//   const [statesList, setStatesList] = useState(states);
//   const [districtsList, setDistrictsList] = useState(districts);
//   const [districtVisible, setDistrictVisible] = useState(false);
//   const [members, setMembers] = useState<Member[]>([]);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [entries, setEntries] = useState<any[]>([]);
//   const [showResultsDialog, setShowResultsDialog] = useState(false);
//   const [isAttended, setIsAttended] = useState('');
//   // const [userRole, setUserRole] = useState('');

//   const [userRole, setUserRole] = useState('');
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     setUserRole(user?.role || '');
//     setUserName(user?.name || '');
//   }, []);

//   const canEdit = isAttended !== 'yes' || userRole === 'Admin';

//   const ROWS_PER_PAGE = 10

//   const defaultValues = {
//     mobileNumber: '',
//     title: '',
//     fullName: '',
//     // occupation: 'others',
//     country: 'India',
//     state: 'Andhra Pradesh',
//     district: '',
//     city: '',
//     addressLine1: '',
//     addressLine2: '',
//     paymentMode: 'Cash',
//     upiRefNumber: '',
//     discount: 0,
//     memberList: [] as Member[],
//     extraMale: '0',
//     churchName: '',
//     extraFemale: '0',
//     extraChild: '0',
//     searchTerm: '',
//     idGenerate: '',
//     type: 'Stayer',
//   };

//   const methods = useForm({
//     mode: 'all',
//     defaultValues
//   });

//   const { handleSubmit, setValue, getValues, formState: { isSubmitting } } = methods;

//   const handleReset = () => {
//     methods.reset(defaultValues);
//     setMembers([]);
//     setErrorMsg('');
//     setDistrictVisible(false);
//     setStatesList(states);
//     setDistrictsList(districts);
//     setHasPartnerDetails(false);
//     setSearchResults([]);
//     setProfileId(null);
//   };
//   const onSubmit = async (data: PartnerFormData) => {
//     setLoading(true);
//     const created_by = userName || 'Unknown';

//     const payload = {
//       id: null,
//       profileId: profileId,
//       full_name: data.fullName,
//       title: data.title,
//       // occupation: data.occupation,
//       churchName: data.churchName,
//       country: data.country,
//       state: data.state,
//       district: data.district,
//       city: data.city,
//       extraMale: data.extraMale,
//       extraFemale: data.extraFemale,
//       extraChild: data.extraChild,
//       mobileNumber: data.mobileNumber,
//       type: data.type,
//       created_by,
//       isAttended: 'yes',
//       isOnline: 'yes',
//       textReminderConsent: 'n',
//     };

//     try {
//       const response = await fetch(`${config.BASE_URL}/addDetails`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const contentType = response.headers.get('content-type') || '';
//       const isJson = contentType.includes('application/json');

//       if (response.status === 200 || response.status === 201) {
//         const message = isJson ? (await response.json()).message : await response.text();
//         toast.success(message || 'Submitted successfully', {
//           position: 'top-center',
//           richColors: true,
//           icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
//         });
//         handleReset();
//       } else {
//         const message = isJson ? (await response.json()).message : await response.text();
//         toast.error(message || 'Bad request or server error', {
//           position: 'top-center',
//           richColors: true,
//           icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//         });
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       toast.error('An error occurred during submission', {
//         position: 'top-center',
//         richColors: true,
//         icon: <Iconify icon="solar:danger-triangle-bold" width={24} height={24} />,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformFamilyMembers = (members: any[]): Member[] => {
//     if (!members) return [];
//     return members.map((member) => ({
//       id: member.profile_id || uuidv4(),
//       name: member.member_name || "Unknown",
//       gender: member.member_gender || "N/A",
//       status: true,
//       age: member.member_age?.toString() || "0",
//     }));
//   };

//   const fetchPartnerDetails = async () => {
//     const input = getValues('searchTerm')?.trim() || '';

//     if (!input) {
//       toast.error('Please enter a mobile number, name, or ID');
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${config.BASE_URL}/visitors?input=${encodeURIComponent(input)}`);

//       if (response.status === 200) {
//         const data = await response.json();
//         const partner = data.data?.[0];

//         console.log(data.data, 'data.data');

//         if (partner) {
//           fillFormWithPartnerData(partner);
//           setProfileId(partner.id);
//           toast.success('Partner details loaded successfully', {
//             position: "top-center",
//             richColors: true,
//             icon: <Iconify icon="solar:check-bold" width={24} height={24} />,

//           });
//         } else {
//           toast.info('No matching partner found', {
//             position: "top-center",
//             richColors: true,
//             icon: <Iconify icon="solar:check-bold" width={24} height={24} />,

//           });
//         }
//       } else if (response.status === 404) {
//         toast.error('Partner not found', {
//           position: "top-center",
//           richColors: true,
//           icon: <Iconify icon="solar:check-bold" width={24} height={24} />,

//         });
//       } else {
//         toast.error('Error fetching partner details', {
//           position: "top-center",
//           richColors: true,
//           icon: <Iconify icon="solar:check-bold" width={24} height={24} />,

//         });
//       }
//     } catch (error) {
//       toast.error('Failed to connect to partner service', {
//         position: "top-center",
//         richColors: true,
//         icon: <Iconify icon="solar:check-bold" width={24} height={24} />,

//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fillFormWithPartnerData = (data: any) => {
//     setValue('fullName', data.fullName || '');
//     setValue('title', data.title || '');
//     // setValue('churchName', data.churchName || '');
//     setValue('type', data.type || 'Stayer');
//     setValue('country', data.country || 'India');
//     setValue('state', data.state || 'Andhra Pradesh');
//     setValue('district', data.district || '');
//     setValue('city', data.city || '');
//     setValue('extraMale', data.extraMale || 0);
//     setValue('extraFemale', data.extraFemale || 0);
//     setValue('extraChild', data.extraChild || 0);
//     setValue('mobileNumber', data.mobileNumber || '');


//     if (data.country !== 'India') {
//       getStates(data.country).then(statesData => {
//         setStatesList(statesData);
//         setDistrictVisible(true);
//       });
//     } else {
//       getDistricts(data.country, data.state).then(districtsData => {
//         setDistrictsList(districtsData);
//         setValue('district', data.district || '');
//       });
//     }

//     const transformedMembers = transformFamilyMembers(data.familyMembers || []);
//     setMembers(transformedMembers);
//     setValue('memberList', transformedMembers);
//     setHasPartnerDetails(true);
//   };

//   const handleSelectPartner = (partner: any) => {
//     fillFormWithPartnerData(partner);
//     setShowResultsDialog(false);
//   };

//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredResults = useMemo(() => {
//     return searchResults.filter(partner =>
//       partner.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       partner.mobileNumber?.includes(searchQuery) ||
//       partner.idGenerate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       partner.type?.toLowerCase().includes(searchQuery.toLowerCase())
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

//   return (
//     <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Card sx={{ mt: 1 }}>
//         <CardHeader title="Search Partner" />
//         <Divider />
//         <Grid2 container spacing={2} sx={{ px: 3, mt: 2, mb: 2 }}>
//           <Grid2 size={{ xs: 12, md: 4 }}>
//             <TextField
//               label="Search (Mobile / Name / ID)"
//               variant="outlined"
//               fullWidth
//               size="small"
//               {...methods.register('searchTerm')}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   e.preventDefault();
//                   fetchPartnerDetails();
//                 }
//               }}
//             />

//             {errorMsg && <Typography color="error">{errorMsg}</Typography>}
//           </Grid2>
//           <Grid2 size={{ xs: 12, md: 2, lg: 1 }}>
//             <LoadingButton
//               startIcon={<Iconify icon="mingcute:search-3-line" />}
//               variant="contained"
//               onClick={fetchPartnerDetails}
//               loading={loading}
//               sx={{ py: 1.5, mt: 0.5 }}
//               size="small"
//             />
//           </Grid2>
//           <Grid2 size={{ xs: 12, md: 2, lg: 1 }}>
//             <Button
//               variant="outlined"
//               fullWidth
//               onClick={handleReset}
//               color="error"
//               size="small"
//               startIcon={<Iconify icon="material-symbols:cancel-outline" />}
//               sx={{ py: 1.5, mt: 0.5 }}
//             />
//           </Grid2>
//         </Grid2>

//         {hasPartnerDetails && (
//           <Card sx={{ mt: 1 }}>
//             <CardHeader title="Partner Details" />
//             <Divider />
//             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, p: 3 }}>
//               <Field.Select name="title" label="Title" size="small" required>
//                 {titleOptions.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>
//               <Field.Text name="fullName" label="Full Name" size="small" required />
//               <Field.Text name="churchName" label="Church Name" size="small" required />
//               <Field.Text name="mobileNumber" label="Mobile Number" size="small" required />
//               <Field.Select name="type" label="Type" size="small" required>
//                 {typeOptions.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>

//               <Field.Select name="country" label="Country" size="small" required onChange={handleCountryChange}>
//                 {countries.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>
//               <Field.Select name="state" label="State" size="small" required onChange={handleStateChange}>
//                 {statesList.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>
//               <Field.Select
//                 name="district"
//                 label="District"
//                 size="small"
//                 style={{ display: districtVisible ? 'none' : 'block' }}
//               >
//                 {districtsList.map((option) => (
//                   <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
//                 ))}
//               </Field.Select>
//               <Field.Text name="city" label="City" size="small" />
//               <Field.Text name="extraMale" label="Extra Male" size="small" type="number" />
//               <Field.Text name="extraFemale" label="Extra Female" size="small" type="number" />
//               <Field.Text name="extraChild" label="Extra Child" size="small" type="number" />
//             </Box>

//             <Divider />


//             <Box sx={{ px: 3, py: 2, display: 'flex', gap: 3, justifyContent: 'center' }}>
//               <Button variant="outlined" color="error" onClick={handleReset}>
//                 Cancel
//               </Button>

//               {canEdit && (
//                 <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
//                   Check in
//                 </LoadingButton>
//               )}

//             </Box>
//           </Card>
//         )}

//         <Dialog open={showResultsDialog} onClose={() => setShowResultsDialog(false)} maxWidth="md" fullWidth>
//           <DialogTitle>Select Partner</DialogTitle>
//           <DialogContent>

//             <TextField
//               label="Search partners..."
//               fullWidth
//               margin="dense"
//               size="small"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />


//             <Table sx={{ mt: 2 }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><strong>ID</strong></TableCell>
//                   <TableCell><strong>Name</strong></TableCell>
//                   <TableCell><strong>Mobile</strong></TableCell>
//                   <TableCell><strong>Location</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedResults.map((partner, index) => (
//                   <TableRow
//                     key={partner.id}
//                     hover
//                     onClick={() => handleSelectPartner(partner)}
//                     sx={{ cursor: 'pointer' }}
//                   >
//                     <TableCell>
//                       {(partner.idGenerate)}
//                     </TableCell>
//                     <TableCell>{partner.full_name || 'Unknown'}</TableCell>
//                     <TableCell>{partner.mobileNumber ? `+91 ${partner.mobileNumber}` : 'Unknown number'}</TableCell>
//                     <TableCell>{`${partner.district || 'Unknown district'}, ${partner.state || 'Unknown state'}`}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>


//             <Box display="flex" justifyContent="center" mt={2}>
//               <Pagination
//                 count={Math.ceil(filteredResults.length / ROWS_PER_PAGE)}
//                 page={currentPage}
//                 onChange={(event, page) => setCurrentPage(page)}
//                 color="primary"
//               />
//             </Box>
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={() => setShowResultsDialog(false)}>Cancel</Button>
//           </DialogActions>
//         </Dialog>
//       </Card>
//     </Form >
//   );
// };

// export default PartnerDetails;