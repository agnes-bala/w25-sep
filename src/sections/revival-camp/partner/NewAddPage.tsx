'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControlLabel,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Alert,
  InputAdornment,
  Grid2,
  TextField,
} from '@mui/material';

import { getDistricts, getStates } from 'src/utils/helpers';
import { config } from 'src/constants/helpers';
import { checkInPartnerSchema } from 'src/constants/schema';
import {
  titleOptions,
  paymentOptions,
} from 'src/constants/selectoptions';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import MemberTable from './components/MemberTable';
import { ostring } from 'zod';

interface PartnerFormProps {
  countries: { value: string; label: string }[];
  states: { value: string; label: string }[];
  districts: { value: string; label: string }[];
}

type SearchResult = {
  id: number;
  title: string;
  fullName: string;
  addr1: string | null;
  addr2: string | null;
  city: string;
  country: string;
  state: string;
  district: string;
  pincode: string | null;
  mobileNumber: string;
  extraFemale: string;
  maleChild: string;
  femaleChild: string;
  under: string;
  idGenerate: string | null;
  isAttended: string;
  paymentMode: string | null;
  amount: string | null;
  discount: string | null;
  createdBy: string;
  createdAt: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
  remarks: string | null;
  upiRefNumber: string | null;
  
};

const AddNewPage: React.FC<PartnerFormProps> = ({ countries, states, districts }) => {
  const [total, setTotal] = useState(200);
  const [statesList, setStatesList] = useState(states);
  const [districtsList, setDistrictsList] = useState(districts);
  const [districtVisible, setDistrictVisible] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDiscountFields, setShowDiscountFields] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [returnAmount, setReturnAmount] = useState<number>(0);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [isAttendedYes, setIsAttendedYes] = useState(false);
  const [showUpiRefField, setShowUpiRefField] = useState(false);
  const [alreadyCheckedInDialog, setAlreadyCheckedInDialog] = useState(false);
  const [isExistingMember, setIsExistingMember] = useState(false);
  const [existingMemberId, setExistingMemberId] = useState<number | null>(null);

  const [memberCounts, setMemberCounts] = useState<{
    under: number;
    maleChild: number;
    femaleChild: number;
    extraFemale: number
  }>({
    under: 0,
    maleChild: 0,
    femaleChild: 0,
    extraFemale: 0
  });

  const { user } = useAuthContext();

  useEffect(() => {
    setReturnAmount(paidAmount - total);
  }, [paidAmount, total]);

  const MAX_DISCOUNT_PERCENTAGE = 100;
  const DISCOUNT_PASSWORD = 'admin123';

  const calculateAmount = (counts: {
    under: number;
    maleChild: number;
    femaleChild: number;
    extraFemale: number
  }) => {
    const baseAmount = 200;
    const underFee = counts.under * 0;
    const maleChildFee = counts.maleChild * 100;
    const femaleChildFee = counts.femaleChild * 100;
    const extraFemaleFee = counts.extraFemale * 200;

    return baseAmount + underFee + maleChildFee + femaleChildFee + extraFemaleFee;
  };

  const calculateDiscount = (discountValue: number, discountType: string, totalAmount: number) => {
    if (discountType === 'percentage') {
      const percentageDiscount = (totalAmount * discountValue) / 100;
      return Math.min(percentageDiscount, totalAmount);
    }
    return Math.min(discountValue, totalAmount);
  };

  const defaultValues = {
    title: 'Sis',
    fullName: '',
    type: 'Stayer',
    occupation: 'others',
    mobileNumber: '',
    country: 'India',
    state: 'Tamil Nadu',
    district: '',
    under: 0,
    maleChild: 0,
    femaleChild: 0,
    extraFemale: 0,
    city: '',
    pincode: '',
    paymentMode: 'cash',
    upiRefNumber: '',
    memberList: [],
    isAttended: 'yes',
    discount: 0,
    discountType: 'fixed',
    discountBy: '',
    amount: 200,
    discountPassword: '',
    textReminderConsent: true,
    paidAmount: 0,
    addr1: '',
    addr2: '',
    remarks: '',
  };

  type FormData = {
    fullName: string;
    title: string;
    type: string;
    occupation: string;
    mobileNumber: string;
    country: string;
    state: string;
    district: string;
    city: string;
    pincode: string;
    extraChild: number;
    under: number;
    maleChild: number;
    femaleChild: number;
    extraFemale: number;
    paymentMode: string;
    upiRefNumber: string;
    memberList: any[];
    isAttended: string;
    textReminderConsent: boolean;
    discount: number;
    discountType: string;
    discountBy: string;
    amount: number;
    discountPassword: string;
    addr1: string;
    addr2: string;
    remarks: string;
  };

  const methods = useForm<FormData>({
    mode: 'all',
    resolver: zodResolver(checkInPartnerSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const watchPaymentMode = watch('paymentMode');
  const watchUnder = watch('under') || 0;
  const watchMaleChild = watch('maleChild') || 0;
  const watchFemaleChild = watch('femaleChild') || 0;
  const watchExtraFemale = watch('extraFemale') || 0;
  const watchDiscount = watch('discount') || 0;
  const watchDiscountType = watch('discountType') || 'fixed';

  useEffect(() => {
    setShowUpiRefField(watchPaymentMode === 'upi');
    if (watchPaymentMode !== 'upi') {
      setValue('upiRefNumber', '');
    }
  }, [watchPaymentMode, setValue]);

  const resetForm = async () => {
    reset({
      ...defaultValues,
      discount: 0,
      discountType: 'fixed',
      discountBy: '',
      paymentMode: 'cash',
      upiRefNumber: '',
      amount: 200,
      discountPassword: '',
      textReminderConsent: true,
      addr1: '',
      addr2: '',
    });

    const baseAmount = calculateAmount({ under: 0, maleChild: 0, femaleChild: 0, extraFemale: 0 });
    setTotal(baseAmount);
    setValue('amount', baseAmount);
    setShowDiscountFields(false);
    setDiscountError('');
    setPaidAmount(0);
    setReturnAmount(0);
    setSelectedResult(null);
    setIsAttendedYes(false);
    setShowUpiRefField(false);
    setAlreadyCheckedInDialog(false);
    setIsExistingMember(false);
    setExistingMemberId(null);

    setMemberCounts({ under: 0, maleChild: 0, femaleChild: 0, extraFemale: 0 });

    const districtsData = await getDistricts('India', 'Tamil Nadu');
    setDistrictsList(districtsData);
    setValue('district', '');

    const statesData = await getStates('India');
    setStatesList(statesData);
  };

  useEffect(() => {
    resetForm();
  }, [reset]);

  useEffect(() => {
    const initialAmount = calculateAmount({ under: 0, maleChild: 0, femaleChild: 0, extraFemale: 0 });
    setTotal(initialAmount);
    setValue('amount', initialAmount);
  }, [setValue]);

  const handleStateChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> = async (e) => {
    const state = e.target.value;
    setValue('state', state);
    setValue('district', '');
    const country = getValues('country');
    if (country === 'India') {
      const districtsData = await getDistricts(country, state);
      setValue('district', districtsData[0].value);
      setDistrictsList(districtsData);
    } else {
      setDistrictsList([]);
      setValue('district', '');
      setDistrictVisible(true);
    }
  };

  useEffect(() => {
    const calculatedAmount = calculateAmount(memberCounts);

    let finalDiscount = 0;
    if (watchDiscount > 0) {
      finalDiscount = calculateDiscount(watchDiscount, watchDiscountType, calculatedAmount);

      if (watchDiscountType === 'percentage' && watchDiscount > MAX_DISCOUNT_PERCENTAGE) {
        setDiscountError(`Discount cannot exceed ${MAX_DISCOUNT_PERCENTAGE}%`);
        finalDiscount = calculateDiscount(MAX_DISCOUNT_PERCENTAGE, 'percentage', calculatedAmount);
      } else {
        setDiscountError('');
      }
    }

    const finalAmount = Math.max(0, calculatedAmount - finalDiscount);
    setTotal(finalAmount);
    setValue('amount', finalAmount);

  }, [memberCounts, watchDiscount, watchDiscountType, setValue]);

  useEffect(() => {
    setMemberCounts({
      under: watchUnder,
      maleChild: watchMaleChild,
      femaleChild: watchFemaleChild,
      extraFemale: watchExtraFemale
    });
  }, [watchUnder, watchMaleChild, watchFemaleChild, watchExtraFemale]);

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    const calculatedAmount = calculateAmount(memberCounts);

    if (watchDiscountType === 'percentage') {
      if (value > MAX_DISCOUNT_PERCENTAGE) {
        setDiscountError(`Discount cannot exceed ${MAX_DISCOUNT_PERCENTAGE}%`);
        setValue('discount', MAX_DISCOUNT_PERCENTAGE);
      } else {
        setDiscountError('');
        setValue('discount', value);
      }
    } else {
      if (value > calculatedAmount) {
        setDiscountError(`Discount cannot exceed total amount ₹${calculatedAmount}`);
        setValue('discount', calculatedAmount);
      } else {
        setDiscountError('');
        setValue('discount', value);
      }
    }
  };

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

  const validateDiscountPassword = () => {
    const password = getValues('discountPassword');
    if (password !== DISCOUNT_PASSWORD) {
      setDiscountError('Invalid discount password');
      return false;
    }
    setDiscountError('');
    return true;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a name or mobile number to search');
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}/search?input=${encodeURIComponent(searchQuery)}`);

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results: SearchResult[] = await response.json();
      setSearchResults(results);

      if (results.length === 0) {
        toast.info('No matching partner found. You can add a new entry.');
        setSearchDialogOpen(false);
      } else {
        setSearchDialogOpen(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setSelectedResult(result);

    if (result.isAttended === 'yes') {
      setIsAttendedYes(true);
      setAlreadyCheckedInDialog(true);
      setSearchDialogOpen(false);
      setSearchQuery('');
      return;
    }

    // If isAttended is "no", this is an existing member that needs attendance update
    setIsAttendedYes(false);
    setIsExistingMember(true);
    setExistingMemberId(result.id);

    const maleChild = parseInt(result.maleChild) || 0;
    const extraFemale = parseInt(result.extraFemale) || 0;
    const femaleChild = parseInt(result.femaleChild) || 0;
    const under = parseInt(result.under) || 0;

    setValue('maleChild', maleChild);
    setValue('extraFemale', extraFemale);
    setValue('femaleChild', femaleChild);
    setValue('under', under);

    const calculatedAmount = calculateAmount({
      under: 0,
      maleChild: maleChild,
      femaleChild: femaleChild,
      extraFemale: extraFemale
    });

    const discount = parseInt(result.discount || '0') || 0;
    const finalAmount = Math.max(0, calculatedAmount - discount);

    setValue('title', result.title);
    setValue('fullName', result.fullName);
    setValue('mobileNumber', result.mobileNumber);
    setValue('country', result.country);
    setValue('state', result.state);
    setValue('district', result.district);
    setValue('city', result.city);
    setValue('pincode', result.pincode || '');
    setValue('discount', discount);
    setValue('amount', finalAmount);
    setValue('addr1', result.addr1 || '');
    setValue('addr2', result.addr2 || '');
    setValue('paymentMode', result.paymentMode || 'cash');
    setValue('remarks', result.remarks || '');
    setValue('upiRefNumber', result.upiRefNumber || '');

    const updateLocationData = async () => {
      const statesData = await getStates(result.country);
      setStatesList(statesData);

      if (result.country === 'India') {
        const districtsData = await getDistricts(result.country, result.state);
        setDistrictsList(districtsData);
        setDistrictVisible(false);
      } else {
        setDistrictVisible(true);
      }
    };

    updateLocationData();

    setSearchDialogOpen(false);
    setSearchQuery('');
    toast.success('Form filled with existing member data. This will update their attendance.');
  };

  const created_by = user?.name || 'Unknown';

  const onSubmit = handleSubmit(async (data) => {
    if (isAttendedYes) {
      toast.error('Cannot submit form for already attended member');
      return;
    }

    if (data.discount > 0) {
      if (!validateDiscountPassword()) {
        toast.error('Invalid discount password. Please check and try again.');
        return;
      }
    }

    if (data.paymentMode === 'upi' && !data.upiRefNumber?.trim()) {
      toast.error('UPI Reference Number is mandatory for UPI payments');
      return;
    }

    const transformedData = {
      fullName: data.fullName || "",
      title: data.title || "",
      addr1: data.addr1 || "",
      addr2: data.addr2 || "",
      city: data.city || "",
      country: data.country || "",
      state: data.state || "",
      district: data.district || "",
      pincode: data.pincode || "",
      mobileNumber: data.mobileNumber || "",
      extraFemale: String(data.extraFemale || 0),
      maleChild: String(data.maleChild || 0),
      femaleChild: String(data.femaleChild || 0),
      under: String(data.under || 0),
      isAttended: 'yes',
      paymentMode: data.paymentMode || 'cash',
      amount: String(total || 0),
      discount: String(data.discount || 0),
      remarks: data.remarks || '',
      discountType: data.discountType || 'fixed',
      discountBy: data.discountBy || '',
      upiRefNumber: data.upiRefNumber || '',
      textReminderConsent: data.textReminderConsent ? 'y' : 'n',
      createdBy: user?.name || 'Unknown',
      created_by,
    };

    try {
      let response;
      let url;
      let method;

      if (isExistingMember && existingMemberId) {
        // Update attendance for existing member
        url = `${config.BASE_URL}/update-attendance/${existingMemberId}`;
        method = "PUT";
        
        // For update, we only need to send the attendance status and updated member counts
        const updateData = {
          isAttended: 'yes',
          extraFemale: String(data.extraFemale || 0),
          maleChild: String(data.maleChild || 0),
          femaleChild: String(data.femaleChild || 0),
          under: String(data.under || 0),
          paymentMode: data.paymentMode || 'cash',
          amount: String(total || 0),
          discount: String(data.discount || 0),
          discountType: data.discountType || 'fixed',
          discountBy: data.discountBy || '',
          upiRefNumber: data.upiRefNumber || '',
          createdBy: user?.name || 'Unknown',
        };

        response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });
      } else {
        // Add new member
        url = `${config.BASE_URL}/addData`;
        method = "POST";
        response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transformedData),
        });
      }

      const textResponse = await response.text();
      console.log(textResponse," Response Text");

      if (response.ok) {
        // const successMessage = isExistingMember 
        //   ? textResponse
        //   : `Successfully added ${data.fullName} and marked as attended.`;

        const successMessage = isExistingMember? textResponse : textResponse;

        toast.success(successMessage, {
          position: "top-center",
          icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
        });

        await resetForm();
      } else {
        toast.error(textResponse, {
          position: "top-center",
          icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit. Please try again.");
    }
  });

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card sx={{ mt: 0.5 }}>
          {/* Search Section */}
          <Box
            sx={{
              px: 2,
              py: 1,
              gap: 1.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              '@media (max-width: 600px)': {
                flexDirection: 'column',
                gap: 1
              }
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Enter Mobile / Name to Search
            </Typography>
            <Field.Text
              label="Search Name or Mobile"
              name="search"
              size="small"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              required
              sx={{
                width: '300px',
                '@media (max-width: 600px)': {
                  width: '100%'
                }
              }}
              disabled={isAttendedYes}
            />

            <LoadingButton
              variant="outlined"
              color="inherit"
              type="button"
              onClick={handleSearch}
              startIcon={<Iconify icon="mingcute:search-3-line" />}
              loading={searchLoading}
              disabled={searchLoading || isAttendedYes}
            >
              Search
            </LoadingButton>

            <Button
              variant="outlined"
              color="secondary"
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              startIcon={<Iconify icon="mingcute:close-line" />}
              disabled={isAttendedYes}
            >
              Cancel
            </Button>

          </Box>

          {isAttendedYes && selectedResult && (
            <Box sx={{ px: 2, py: 0.5 }}>
              <Alert severity="info" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  This member has already attended. Form is disabled. Created by: {selectedResult.createdBy}
                </Typography>
              </Alert>
            </Box>
          )}

          {isExistingMember && selectedResult && (
            <Box sx={{ px: 2, py: 0.5 }}>
              <Alert severity="warning" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  Updating existing member: {selectedResult.fullName}
                </Typography>
              </Alert>
            </Box>
          )}

          <CardHeader title="Visitor Details" />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              '@media (max-width: 900px)': {
                gridTemplateColumns: 'repeat(2, 1fr)',
              },
              '@media (max-width: 600px)': {
                gridTemplateColumns: 'repeat(1, 1fr)',
              },
              gap: 1.5,
              p: 2,
              opacity: isAttendedYes ? 0.6 : 1,
              pointerEvents: isAttendedYes ? 'none' : 'auto',
            }}
          >
            <Field.Text name="fullName" label="Full Name" size="small" required disabled={isAttendedYes} />

            <Field.Text
              label="Mobile Number"
              name="mobileNumber"
              size="small"
              required
              disabled={isAttendedYes}
            />

            <Field.Select
              name="state"
              label="State"
              size="small"
              required
              onChange={handleStateChange}
              disabled={isAttendedYes}
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
              disabled={districtVisible || isAttendedYes}
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
            
            {/* 
            <Field.Text
              label="Pincode"
              name="pincode"
              size="small"
              disabled={isAttendedYes}
              inputProps={{ maxLength: 6 }}
            /> */}

            <Field.Text label="Addr1" name="addr1" size="small" disabled={isAttendedYes} />
            <Field.Text label="Addr2" name="addr2" size="small" disabled={isAttendedYes} />

            <Field.Text label="Place" name="city" size="small" disabled={isAttendedYes} />
            <Field.Text label="Pincode" name="pincode" size="small" disabled={isAttendedYes} />

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
                disabled={isAttendedYes}
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
                disabled={isAttendedYes}
                sx={{ maxWidth: '200px' }}
              >
                {paymentOptions.map((option) => (
                  <MenuItem value={option.value} key={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              {showUpiRefField && (
                <Field.Text
                  name="upiRefNumber"
                  label="UPI Reference Number"
                  size="small"
                  required={watchPaymentMode === 'upi'}
                  disabled={isAttendedYes}
                  sx={{ maxWidth: '200px' }}
                />
              )}
              <Field.Text label="Remarks [Stay] " name="remarks" size="small" disabled={isAttendedYes} sx={{ maxWidth: '200px' }} />

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Iconify icon={showDiscountFields ? "mingcute:up-line" : "mingcute:down-line"} />}
                onClick={toggleDiscountFields}
                disabled={isAttendedYes}
                sx={{ alignSelf: 'flex-start', mt: 1, maxWidth: '200px' }}
              >
                {showDiscountFields ? 'Hide Discount Options' : 'Apply Discount'}
              </Button>

              {showDiscountFields && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.5 }}>
                  <Field.Select
                    name="discountType"
                    label="Discount Type"
                    size="small"
                    disabled={isAttendedYes}
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
                    inputProps={{
                      min: 0,
                      max: watchDiscountType === 'percentage' ? MAX_DISCOUNT_PERCENTAGE : calculateAmount(memberCounts)
                    }}
                    onChange={handleDiscountChange}
                    error={!!discountError}
                    helperText={discountError}
                    disabled={isAttendedYes}
                    sx={{ maxWidth: '200px' }}
                  />

                  <Field.Text
                    name="discountPassword"
                    label="Discount Password"
                    size="small"
                    type="password"
                    required={watchDiscount > 0}
                    disabled={isAttendedYes}
                    sx={{ maxWidth: '200px' }}
                  />

                  <Field.Text
                    name="discountBy"
                    label="Approved By"
                    size="small"
                    required={watchDiscount > 0}
                    disabled={isAttendedYes}
                    sx={{ maxWidth: '200px' }}
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

          {/* Payment Details Section */}
          <Box sx={{ p: 1.5, bgcolor: 'primary.inherit', color: 'inherit', opacity: isAttendedYes ? 0.6 : 1 }}>
            <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
              <Grid2 container spacing={2} alignItems="center" justifyContent="flex-end" display={"grid"}>
                <Grid2 size={{ xs: 12, sm: 12 }}>
                  <TextField
                    fullWidth
                    label="Paid Amount"
                    type="number"
                    value={paidAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaidAmount(Number(e.target.value))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    variant="outlined"
                    size="small"
                    disabled={isAttendedYes}
                  />
                </Grid2>

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

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
              <Box>
                {watchDiscount > 0 && (
                  <Typography variant="body2" color="error">
                    Discount Applied: {watchDiscount}{watchDiscountType === 'percentage' ? '%' : '₹'}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Payment Mode: {watchPaymentMode === 'upi' ? 'UPI' : 'Cash'}
                </Typography>
                {isExistingMember && (
                  <Typography variant="body2" color="warning.main">
                    Updating existing member attendance
                  </Typography>
                )}
              </Box>
              <Typography variant="h5" fontWeight="bold">
                Total Amount: ₹{total}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              px: 2,
              py: 1.5,
              gap: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderTop: '1px solid',
              borderColor: 'divider',
              mt: 1,
              '@media (max-width: 600px)': {
                flexDirection: 'column',
                gap: 1
              }
            }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="mingcute:close-line" />}
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            {!isAttendedYes && (
              <LoadingButton
                variant="contained"
                color="inherit"
                type="submit"
                startIcon={<Iconify icon="solar:login-2-outline" />}
                loading={isSubmitting}
                disabled={isSubmitting || !!discountError}
              >
                {isExistingMember ? 'Update Attendance' : 'Add Member'}
              </LoadingButton>
            )}
          </Box>
        </Card>
      </Form>

      {/* Search Results Dialog */}
      <Dialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Search Results</DialogTitle>
        <TextField
          label="Search visitors..."
          fullWidth
          margin="dense"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2, maxWidth: '400px', mx: 2 }}
        />
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Found {searchResults.length} result(s) for "{searchQuery}"
          </Typography>

          {searchResults.length > 0 ? (
            <Paper variant="outlined">
              <List>
                {searchResults.map((result, index) => (
                  <ListItem key={result.id} divider={index < searchResults.length - 1}>
                    <ListItemButton onClick={() => handleSelectResult(result)}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {result.title} {result.fullName}
                            </Typography>
                            {result.isAttended === 'yes' ? (
                              <Typography variant="body2" color="error" sx={{ ml: 2 }}>
                                Already Attended
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="success.main" sx={{ ml: 2 }}>
                                Update Attendance
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              Mobile: {result.mobileNumber}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              Location: {result.city}, {result.district}, {result.state}
                            </Typography>
                            <br />
                            {result.pincode && (
                              <>
                                <Typography variant="body2" component="span">
                                  Pincode: {result.pincode}
                                </Typography>
                                <br />
                              </>
                            )}
                            {result.addr1 && (
                              <>
                                <Typography variant="body2" component="span">
                                  Addr1: {result.addr1}
                                </Typography>
                                <br />
                              </>
                            )}
                            {result.addr2 && (
                              <>
                                <Typography variant="body2" component="span">
                                  Addr2: {result.addr2}
                                </Typography>
                                <br />
                              </>
                            )}
                            <Typography variant="body2" component="span">
                              Extra Members: Male({result.maleChild}), Female({result.femaleChild}), Child({result.under})
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span" fontWeight="bold">
                              Total Amount: ₹{calculateAmount({
                                under: 0,
                                maleChild: parseInt(result.maleChild) || 0,
                                femaleChild: parseInt(result.femaleChild) || 0,
                                extraFemale: parseInt(result.extraFemale) || 0
                              })}
                            </Typography>
                            {result.isAttended === 'yes' && (
                              <>
                                <br />
                                <Typography variant="body2" component="span" color="primary">
                                  Created by: {result.createdBy}
                                </Typography>
                              </>
                            )}
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              No results found
            </Typography>
          )}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setSearchDialogOpen(false);
              toast.info('You can add a new entry');
            }}
          >
            Add New Entry
          </Button>
        </DialogActions> */}
      </Dialog>

      {/* Already Checked In Dialog */}
      <Dialog
        open={alreadyCheckedInDialog}
        onClose={() => {
          setAlreadyCheckedInDialog(false);
          setSelectedResult(null);
          setIsAttendedYes(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:info-circle-bold" color="warning.main" width={24} height={24} />
          Already Checked In
        </DialogTitle>
        <DialogContent>
          {selectedResult && (
            <Box sx={{ py: 1 }}>
              <Typography variant="h6" gutterBottom>
                {selectedResult.title} {selectedResult.fullName}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                This person has already been checked in to the revival camp.
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Originally checked in by:</strong> {selectedResult.createdBy}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Mobile:</strong> {selectedResult.mobileNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Location:</strong> {selectedResult.city}, {selectedResult.district}, {selectedResult.state}
                </Typography>
                {selectedResult.createdAt && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Check-in Date:</strong> {new Date(selectedResult.createdAt).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAlreadyCheckedInDialog(false);
              setSelectedResult(null);
              setIsAttendedYes(false);
            }}
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddNewPage;