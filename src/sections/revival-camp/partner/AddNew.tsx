'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';

import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Typography,
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

import initialList from './initData.json';
import MemberTable from './components/MemberTable';
import { useBoolean } from 'minimal-shared/hooks';

type MemberOption = {
  id: number;
  name: string;
  gender: string;
  status: boolean;
  age: string;
};

type FoodItem = {
  id: string;
  date: string;
  food: number;
};

interface PartnerFormProps {
  countries: { value: string; label: string }[];
  states: { value: string; label: string }[];
  districts: { value: string; label: string }[];
}

const AddNew: React.FC<PartnerFormProps> = ({ countries, states, districts }) => {
  const [foods, setFoods] = useState<FoodItem[]>(initialList.foodDetails || []);
  const [total, setTotal] = useState(200); // Base amount for main registrant
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [statesList, setStatesList] = useState(states);
  const [districtsList, setDistrictsList] = useState(districts);
  const [districtVisible, setDistrictVisible] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState<number | ''>('');
  const [showDiscountFields, setShowDiscountFields] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const showPassword = useBoolean();
  // Discount configuration
  const MAX_DISCOUNT_PERCENTAGE = 100;
  const DISCOUNT_PASSWORD = 'admin123';

  // New state for age-based member tracking
  const [memberCounts, setMemberCounts] = useState<{
    under7: number;
    maleChild: number;
    femaleChild: number;
    extraFemale: number;
  }>({
    under7: 0,
    maleChild: 0,
    femaleChild: 0,
    extraFemale: 0
  });

  const amountToReturn = collectedAmount !== '' ? collectedAmount - total : 0;

  // Calculate discount amount ensuring it doesn't exceed total amount
  const calculateDiscount = (discountValue: number, discountType: string, totalAmount: number) => {
    if (discountType === 'percentage') {
      const percentageDiscount = (totalAmount * discountValue) / 100;
      return Math.min(percentageDiscount, totalAmount);
    }
    return Math.min(discountValue, totalAmount);
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

  // Handle discount field changes with validation
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);

    if (watchDiscountType === 'percentage' && value > MAX_DISCOUNT_PERCENTAGE) {
      setDiscountError(`Discount cannot exceed ${MAX_DISCOUNT_PERCENTAGE}%`);
      setValue('discount', MAX_DISCOUNT_PERCENTAGE);
    } else {
      setDiscountError('');
      setValue('discount', value);
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

  // Calculate amount based on age-based fee structure
  const calculateAmount = (counts: {
    under7: number;
    maleChild: number;
    femaleChild: number;
    extraFemale: number;
  }) => {
    // Base amount for the main registrant (sister)
    const baseAmount = 200;

    // Age-based fees
    const under7Fee = counts.under7 * 0; // No fee for under 7
    const maleChildFee = counts.maleChild * 100; // Rs. 100 for male children 7-14
    const femaleChildFee = counts.femaleChild * 100; // Rs. 100 for female children 7-14
    const extraFemaleFee = counts.extraFemale * 200; // Rs. 200 for females 14+

    return baseAmount + under7Fee + maleChildFee + femaleChildFee + extraFemaleFee;
  };

  const defaultValues = {
    title: 'Sis',
    fullName: '',
    churchName: '',
    type: 'Stayer',
    occupation: 'others',
    mobileNumber: '',
    country: 'India',
    state: 'Tamil Nadu',
    district: '',
    // New age-based fields
    under7: 0,
    maleChild: 0,
    femaleChild: 0,
    extraFemale: 0,
    city: '',
    pinCode: '',
    paymentMode: 'cash',
    upiRefNumber: '',
    memberList: members,
    isAttended: 'yes',
    foodDetails: foods,
    discount: 0,
    discountType: 'fixed',
    discountBy: '',
    amount: 200,
    discountPassword: '',
    textReminderConsent: true,
    addr1: '',
    addr2: '',
    remarks: '',
  };

  type MemberList = {
    id: number;
    name: string;
    gender: string;
    status: boolean;
    age: string;
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
    pinCode: string;
    // New age-based fields
    under7: number;
    maleChild: number;
    femaleChild: number;
    extraFemale: number;
    paymentMode: string;
    upiRefNumber: string;
    memberList: MemberList[];
    isAttended: string;
    textReminderConsent: boolean;
    foodDetails: FoodItem[];
    discount: number;
    discountType: string;
    discountBy: string;
    amount: number;
    churchName: string;
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

  // Watch age-based fields
  const watchUnder7 = watch('under7') || 0;
  const watchMaleChild = watch('maleChild') || 0;
  const watchFemaleChild = watch('femaleChild') || 0;
  const watchExtraFemale = watch('extraFemale') || 0;
  const watchDiscount = watch('discount') || 0;
  const watchDiscountType = watch('discountType') || 'fixed';
  const watchPaymentMode = watch('paymentMode');

  const handleCountryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const country = e.target.value;
    setValue('country', country);
    const statesData = await getStates(country);
    setValue('state', statesData[0].value);
    setStatesList(statesData);
    setValue('district', '');
  };

  // Calculate total amount whenever age-based members or discount changes
  useEffect(() => {
    const calculatedAmount = calculateAmount(memberCounts);
    let finalAmount = calculatedAmount;

    // Apply discount if any
    if (watchDiscount > 0) {
      const discountAmount = calculateDiscount(watchDiscount, watchDiscountType, calculatedAmount);
      finalAmount = Math.max(0, calculatedAmount - discountAmount);
    }

    setTotal(finalAmount);
    setValue('amount', finalAmount);
  }, [memberCounts, watchDiscount, watchDiscountType, setValue]);

  // Update member counts when form fields change
  useEffect(() => {
    setMemberCounts({
      under7: watchUnder7,
      maleChild: watchMaleChild,
      femaleChild: watchFemaleChild,
      extraFemale: watchExtraFemale
    });
  }, [watchUnder7, watchMaleChild, watchFemaleChild, watchExtraFemale]);

  useEffect(() => {
    const resetFoods = initialList.foodDetails.map((f) => ({
      ...f,
      food: 0,
    }));

    reset({
      ...defaultValues,
      foodDetails: resetFoods,
      discount: 0,
      discountBy: '',
      paymentMode: 'cash',
      upiRefNumber: '',
      amount: 200,
      discountPassword: '',
      textReminderConsent: true,
    });

    setFoods(resetFoods);
    setCollectedAmount('');
    setTotal(200);
    setMemberCounts({ under7: 0, maleChild: 0, femaleChild: 0, extraFemale: 0 });
    setShowDiscountFields(false);
    setDiscountError('');
  }, [reset]);

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


  const watchTextReminder = watch('textReminderConsent');
  console.log("Current checkbox value:", watchTextReminder);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const created_by = user?.name || 'Unknown';

  const onSubmit = handleSubmit(async (data) => {
    // Validate discount password if discount is applied
    if (data.discount > 0) {
      if (!validateDiscountPassword()) {
        toast.error('Invalid discount password. Please check and try again.');
        return;
      }
    }

    // Validate UPI reference number if payment mode is UPI
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
      pincode: data.pinCode || "",
      mobileNumber: data.mobileNumber || "",
      // Age-based member counts
      extraMale: String(data.maleChild || 0),
      extraFemale: String(data.extraFemale || 0),
      maleChild: String(data.maleChild || 0),
      femaleChild: String(data.femaleChild || 0),
      under7: String(data.under7 || 0),
      isAttended: 'yes',
      paymentMode: data.paymentMode || 'cash',
      amount: String(data.amount || 0),
      discount: String(data.discount || 0),
      discountType: data.discountType || 'fixed',
      discountBy: data.discountBy || '',
      upiRefNumber: data.upiRefNumber || '',
      textReminderConsent: data.textReminderConsent ? 'y' : 'n',
      createdBy: created_by,
      created_by,
    };

    console.log("Form data before submit:", data);
    console.log("Checkbox value:", data.textReminderConsent);
    console.log("Transformed Data:", transformedData);


    console.log("Checkbox value before transform:", data.textReminderConsent);
    console.log("Transformed checkbox value:", transformedData.textReminderConsent);

    try {
      const response = await fetch(`${config.BASE_URL}/addDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      const textResponse = await response.text();
      console.log("Server Response:", textResponse);

      if (response.ok) {
        toast.success(textResponse, {
          position: "top-center",
          icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
        });

        reset();
        setValue('country', 'India');
        setValue('state', 'Tamil Nadu');

        const districtsData = await getDistricts('India', 'Tamil Nadu');
        setDistrictsList(districtsData);
        setValue('district', '');

        const statesData = await getStates('India');
        setStatesList(statesData);
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
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ mt: 1 }}>
        <CardHeader title="Pastor Details" />
        <Divider />
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
            gap: 2,
            p: 3,
          }}
        >
          {/* <Field.Select name="title" label="Title" size="small" required>
            {titleOptions.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select> */}

          <Field.Text name="fullName" label="Full Name" size="small" required />


          <Field.Text name="churchName" label="Church Name" size="small" required />

          <Field.Text
            label="Mobile Number"
            name="mobileNumber"
            size="small"
            required
          />

          <Field.Select
            name="country"
            label="Country"
            size="small"
            required
            onChange={handleCountryChange}
          >
            {countries.map((option: { value: string; label: string }) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>

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

          <Field.Text name="pinCode" label="Pincode" size="small" inputProps={{ maxLength: 6 }} />

          <Field.Text name="addr1" label="Address Line 1" size="small" />

          <Field.Text name="addr2" label="Address Line 2" size="small" />

          {/* Enhanced Member Count Tables */}
          {/* <MemberTable
            setValue={setValue}
            getValues={getValues}
            // under7={watchUnder7}
            maleChild={watchMaleChild}
            femaleChild={watchFemaleChild}
            extraFemale={watchExtraFemale}
            disabled={false}
            showQuickAdd={true}
            mode="form"
          /> */}

          {/* Payment Mode Field */}
          <Field.Select
            name="paymentMode"
            label="Payment Mode"
            size="small"
            required
          >
            {paymentOptions.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>

          {/* UPI Reference Number Field - Conditionally Rendered */}
          {watchPaymentMode === 'upi' && (
            <Field.Text
              name="upiRefNumber"
              label="UPI Reference Number"
              size="small"
              required={watchPaymentMode === 'upi'}
              sx={{ gridColumn: 'span 2' }}
            />
          )}

          {/* Discount Toggle Button */}
          <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Iconify icon={showDiscountFields ? "mingcute:up-line" : "mingcute:down-line"} />}
              onClick={toggleDiscountFields}
              sx={{ mb: 1 }}
            >
              {showDiscountFields ? 'Hide Discount Options' : 'Apply Discount'}
            </Button>
          </Box>

          {/* Discount Fields */}
          {showDiscountFields && (
            <>
              <Field.Select
                name="discountType"
                label="Discount Type"
                size="small"
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
                  max: watchDiscountType === 'percentage' ? MAX_DISCOUNT_PERCENTAGE : undefined
                }}
                onChange={handleDiscountChange}
                error={!!discountError}
                helperText={discountError}
              />

              <Field.Text
                name="discountPassword"
                label="Discount Password"
                size="small"
                // type="password"
                type={showPassword.value ? 'text' : 'password'}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={showPassword.onToggle} edge="end">
                          <Iconify
                            icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                required={watchDiscount > 0}
              />

              <Field.Text
                name="discountBy"
                label="Approved By"
                size="small"
                required={watchDiscount > 0}
              />

              {discountError && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {discountError}
                  </Alert>
                </Box>
              )}
            </>
          )}

          <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
            <Controller
              name="textReminderConsent"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">By checking this box, I agree to receive messages.</Typography>
                    </Box>
                  }
                />
              )}
            />
          </Box>

          {/* Amount Display */}
          <Box sx={{ gridColumn: '1 / -1', mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
              Total Amount: ₹{total}
            </Typography>
            {watchDiscount > 0 && (
              <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                Discount Applied: {watchDiscount}{watchDiscountType === 'percentage' ? '%' : '₹'}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            px: 3,
            py: 2,
            gap: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<Iconify icon="mingcute:close-line" />}
            onClick={async () => {
              reset();
              setValue('country', 'India');
              setValue('state', 'Tamil Nadu');
              setShowDiscountFields(false);
              setDiscountError('');
              setTotal(200);
              setMemberCounts({ under7: 0, maleChild: 0, femaleChild: 0, extraFemale: 0 });

              const districtsData = await getDistricts('India', 'Tamil Nadu');
              setDistrictsList(districtsData);
              setValue('district', '');

              const statesData = await getStates('India');
              setStatesList(statesData);
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<Iconify icon="solar:login-2-outline" />}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Add Member
          </LoadingButton>
        </Box>
      </Card>
    </Form>
  );
};

export default AddNew;