'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
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

  Grid,
  InputLabel,
  MenuItem,

  TextField,
  Typography,

  Pagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { DataGrid } from '@mui/x-data-grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { genderOptions, paymentOptions, titleOptions } from 'src/constants/selectoptions';
import { config } from 'src/constants/helpers';

import initialList from './initData.json';


type FoodItem = {
  id: string;
  date: string;
  food: number;
};

interface PartnerFormData {
  mobileNumber: string;

  paymentMode: string;
  upiRefNumber: string;

  discount: number;
  discountBy: string;

  amount: number;

}

interface Member {
  id: string;
  name: string;
  gender: string;
  status: boolean;
  age: string;
}

enum Gender {
  Male = 'male',
  Female = 'female',
}

const FoodDetails: React.FC = ({ }) => {
  const [loading, setLoading] = useState(false);
  const [hasPartnerDetails, setHasPartnerDetails] = useState(false);

  const [members, setMembers] = useState<Member[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [isAttended, setIsAttended] = useState('');
  const [refreshRecents, setRefreshRecents] = useState(false);
  const [foods, setFoods] = useState<FoodItem[]>(initialList.foodDetails || []);
  const [total, setTotal] = useState(0);
  const [collectedAmount, setCollectedAmount] = useState<number | ''>('');


  const ROWS_PER_PAGE = 10;

  const defaultValues = {
    mobileNumber: '',

    paymentMode: 'Cash',
    upiRefNumber: '',
    discount: 0,
    foodDetails: foods,

    searchTerm: '',
    amount: 0,
    isAttended: 'yes',
    discountPassword: '',
    discountBy: '',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    register,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const amountToReturn = useMemo(() => {
    if (collectedAmount === '') return 0;
    return Number(collectedAmount) - total;
  }, [collectedAmount, total]);

  const handleReset = () => {
    methods.reset(defaultValues);
    setMembers([]);
    setErrorMsg('');

    setHasPartnerDetails(false);
    setSearchResults([]);
  };

  const watchedDiscount = Number(watch('discount') || 0);
  const watchedPaymentMode = watch('paymentMode');
  const watchedDiscountPassword = watch('discountPassword');
  const isDiscountAllowed = watchedDiscountPassword === 'Revi25';

  useEffect(() => {
    if (!foods.length || foods.every(f => f.food === 0)) {
      setValue('amount', 0);
      setTotal(0);
      return;
    }

    const subtotal = foods.reduce(
      (acc, f) => acc + f.food * 20,
      0
    );

    const validDiscount = watchedDiscount > subtotal ? 0 : watchedDiscount;
    if (validDiscount !== watchedDiscount) {
      setValue('discount', 0);
    }

    const finalAmount = Math.max(subtotal - validDiscount, 0);
    setTotal(finalAmount);
    setValue('amount', finalAmount);
  }, [foods, watchedDiscount, setValue]);

  const onSubmit = async (data: PartnerFormData) => {
    setLoading(true);
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [staffName, setStaffName] = useState('Unknown');

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.name) {
        setStaffName(user.name);
      }
    }, []);

    const updated_by = staffName || 'Unknown Staff';


    const day1Date = "30-05-2025";
    const day2Date = "31-05-2025";

    const foodDetails = [
      {
        id: "FRI",
        date: day1Date,
        status: true,
        food: foods[0].food,
      },
      {
        id: "SAT",
        date: day2Date,
        status: true,
        food: foods[1].food,
      },
    ];

    const isCash = data.paymentMode === "Cash";
    const isUPI = data.paymentMode === "UPI";

    try {
      const payload = {

        mobile_number: data.mobileNumber,
        day1: foodDetails[0].food,
        day2: foodDetails[1].food,
        updated_by: updated_by,
        payment_mode: data.paymentMode,
        upiRefNumber: data.upiRefNumber,
        discount: data.discount,
        discountBy: data.discountBy,
        totalAmount: total,
        cashAmount: isCash ? total : '',
        upiAmount: isUPI ? total : '',

      };

      const response = await fetch(`${config.BASE_URL}/editFood`, {
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
        triggerRecentsRefresh();
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


  const fetchPartnerDetails = async () => {
    const input = getValues('searchTerm')?.trim() || '';

    if (!input) {
      toast.error('Please enter a mobile number, name, or ID', {
        position: 'top-center',
        richColors: true,
        icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
      });
      return;
    }

    setLoading(true);

    try {
      const queryString = `input=${encodeURIComponent(input)}`;
      // http://localhost:8080/Revival/getFood?input=1234567890
      const url = `${config.BASE_URL}/getFood?${queryString}`;
      console.log('Request URL:', url);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to fetch partner details');
      }

      if (!data || data.length === 0) {
        throw new Error('No records found with the provided details');
      }

      const exactMatch = data.find(
        (entry: any) =>
          entry.idGenerate?.toLowerCase() === input.toLowerCase() ||
          entry.full_name?.toLowerCase() === input.toLowerCase() ||
          entry.mobile_number?.replace(/\s+/g, '') === input.replace(/\s+/g, '')
      );

      if (exactMatch) {
        fillFormWithPartnerData(exactMatch);
        setIsAttended(data.isAttended);
      } else {
        setSearchResults(data);
        setEntries(data);
        setIsAttended(data.isAttended);
        setShowResultsDialog(true);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to fetch partner details', {
        position: 'top-center',
        richColors: true,
        icon: <Iconify icon="solar:check-bold" width={24} height={24} />,
      });
      setHasPartnerDetails(false);
    } finally {
      setLoading(false);
    }
  };

  const isAllCountsZero = useMemo(() => foods.every((f) => f.food === 0), [foods]);

  const fillFormWithPartnerData = async (data: any) => {

    setValue('mobileNumber', data.mobile_number || '');
    setValue('paymentMode', data.payment_mode || 'Cash');
    setValue('upiRefNumber', data.upiRefNumber || '');
    setValue('discount', Number(data.discount) || 0);
    setValue('discountBy', data.discountBy || '');
    setTotal(Number(data.totalAmount) || 0);


    // Set food values based on day1 and day2
    const foodUpdate = foods.map((food) => {
      if (food.date === '30-05-2025') {
        return { ...food, food: Number(data.day1 || 0) };
      }
      if (food.date === '31-05-2025') {
        return { ...food, food: Number(data.day2 || 0) };
      }
      return food;
    });

    setFoods(foodUpdate);
    setValue('foodDetails', foodUpdate);
    setHasPartnerDetails(true);
  };

  const indianRupees = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
      }),
    []
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);

  const handleSelectPartner = (partner: any) => {
    fillFormWithPartnerData(partner);
    setShowResultsDialog(false);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredResults = useMemo(() => {
    return searchResults.filter(
      (partner) =>
        partner.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.mobile_number?.includes(searchQuery) ||
        partner.idGenerate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchResults, searchQuery]);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredResults.slice(start, start + ROWS_PER_PAGE);
  }, [filteredResults, currentPage]);


  const triggerRecentsRefresh = () => {
    setRefreshRecents((prev) => !prev);
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>

      <Card sx={{ mt: 3 }}>
        <CardHeader title="Search Visitor" />
        <Divider />
        <Grid container spacing={2} sx={{ px: 3, mt: 2, mb: 2 }}>
          <Grid item xs={12} md={4}>
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
            {errorMsg && <Typography color="error">{errorMsg}</Typography>}
          </Grid>
          <Grid item xs={12} md={2} lg={1}>
            <LoadingButton
              startIcon={<Iconify icon="mingcute:search-3-line" />}
              variant="contained"
              onClick={fetchPartnerDetails}
              loading={loading}
              sx={{ py: 1.5, mt: 0.5 }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={2} lg={1}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleReset}
              color="error"
              size="small"
              startIcon={<Iconify icon="material-symbols:cancel-outline" />}
              sx={{ py: 1.5, mt: 0.5 }}
            />
          </Grid>
        </Grid>

        {hasPartnerDetails && (
          <Card sx={{ mt: 1 }}>
            <CardHeader title="Food Details" />
            <Divider />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2,
                p: 3,
              }}
            >
              <Field.Text name="mobileNumber" label="Mobile Number" size="small" required />


            </Box>

            <Grid container spacing={1} sx={{ px: 3, pb: 3, alignContent: 'center', justifyContent: 'center' }}>
              <Typography variant="subtitle1">Food Details</Typography>
              {foods.map((food, idx) => {
                const is30thMay = food.date === '30-05-2025';
                const now = new Date();
                const currentDate = now.getDate();
                const currentMonth = now.getMonth() + 1;
                const currentYear = now.getFullYear();
                const currentHour = now.getHours();
                const isToday30thMay = currentDate === 30 && currentMonth === 5 && currentYear === 2025;

                if (is30thMay && isToday30thMay && currentHour >= 23) {
                  return null;
                }

                const isDisabled = is30thMay && isToday30thMay && currentHour >= 19;

                return (
                  <Grid container spacing={1} key={idx} sx={{ my: 1, justifyContent: 'center' }}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle1">
                        {food.id} - {food.date}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={1.5}>
                      <TextField
                        label="Food"
                        type="number"
                        size="small"
                        fullWidth
                        value={food.food}
                        disabled={isDisabled}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v < 0) {
                            toast.error('Food count cannot be negative');
                            return;
                          }
                          const updatedFoods = [...foods];
                          updatedFoods[idx].food = v;
                          setFoods(updatedFoods);
                          setValue('foodDetails', updatedFoods);
                        }}
                      />
                    </Grid>
                  </Grid>
                );
              })}
              <Divider sx={{ my: 3, width: '100%' }} />

              {isAllCountsZero === false && (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Discount Password"
                        type="password"
                        size="small"
                        fullWidth
                        {...register('discountPassword')}
                      />
                    </Grid>
                    {isDiscountAllowed && (
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Discount"
                          type="number"
                          size="small"
                          fullWidth
                          {...register('discount')}
                          error={Boolean(errors.discount)}
                          helperText={errors.discount?.message}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v < 0) {
                              toast.error('Discount cannot be negative');
                              return;
                            }
                            setValue('discount', v);
                          }}
                          defaultValue={0}
                        />
                      </Grid>
                    )}
                    {isDiscountAllowed && watchedDiscount > 0 && (
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Discount By"
                          size="small"
                          fullWidth
                          {...register('discountBy', {
                            required: 'Discount By is required when discount is applied',
                          })}
                          error={Boolean(errors.discountBy)}
                          helperText={errors.discountBy?.message}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={2}>
                      <Controller
                        name="paymentMode"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            select
                            label="Payment Mode"
                            size="small"
                            fullWidth
                            required
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const value = e.target.value;
                              if (value !== 'UPI') {
                                setValue('upiRefNumber', '');
                              }
                            }}
                            error={Boolean(errors.paymentMode)}
                            helperText={errors.paymentMode?.message}
                          >
                            {paymentOptions.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.value}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>


                    <Grid item xs={12} md={2}>
                      <TextField
                        label="UPI Reference Number"
                        size="small"
                        fullWidth
                        {...register('upiRefNumber', {
                          validate: (v) =>
                            watchedPaymentMode === 'UPI' && !v
                              ? 'UPI Reference Number is required for UPI payments'
                              : true,
                        })}

                        error={Boolean(errors.upiRefNumber)}
                        helperText={errors.upiRefNumber?.message}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Divider sx={{ my: 3, width: '100%' }} />

              {isAllCountsZero === false && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1,
                    width: '100%',
                  }}
                >
                  <Typography variant="body1">Amount:</Typography>
                  <Typography variant="h3" >{indianRupees.format(total)}</Typography>
                </Box>
              )}

              {isAllCountsZero === false && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'self-end',
                    justifyContent: 'flex-end',
                    width: '100%',
                  }}
                >
                  <Grid container spacing={2}></Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Amount Collected"
                      type="number"
                      size="small"
                      disabled={isAllCountsZero}
                      value={collectedAmount}
                      onChange={(e) =>
                        setCollectedAmount(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Amount to Return"
                      size="small"
                      disabled={isAllCountsZero}
                      value={formatCurrency(amountToReturn)}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                </Box>
              )}
            </Grid>

            <Box sx={{ px: 3, py: 2, display: 'flex', gap: 3, justifyContent: 'center' }}>
              <Button variant="outlined" color="error" onClick={handleReset}>
                Cancel
              </Button>
              <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
                Update Visitor
              </LoadingButton>
            </Box>
          </Card>
        )}

        <Dialog
          open={showResultsDialog}
          onClose={() => setShowResultsDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Select Visitor</DialogTitle>
          <DialogContent>
            <TextField
              label="Search visitors..."
              fullWidth
              margin="dense"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Mobile</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Location</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedResults.map((partner, index) => (
                  <TableRow
                    key={partner.id}
                    hover
                    onClick={() => handleSelectPartner(partner)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{partner.idGenerate}</TableCell>
                    <TableCell>{partner.full_name || 'Unknown'}</TableCell>
                    <TableCell>
                      {partner.mobile_number ? `+91 ${partner.mobile_number}` : 'Unknown number'}
                    </TableCell>
                    <TableCell>
                      {`${partner.district || 'Unknown district'}, ${partner.state || 'Unknown state'}`}
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
      </Card>


    </Form>
  );
};

export default FoodDetails;