'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { config } from 'src/constants/helpers';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import initialList from './initData.json';

const paymentOptions = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
];

type FoodItem = {
  id: string;
  date: string;
  food: number;
};

interface CountryData {
  country: string;
  count: number;
}

type FormValues = {
  foodDetails: FoodItem[];
  discount: number;
  discountBy: string;
  cashAmount: number;
  upiAmount: number;
  paymentMode: string;
  upiReferenceNumber: string;
  amount: number;
  discountPassword: string;
  mobile_number: string;
};


type Entry = {
  Mobile_number: string;
  Day1: number;
  Day2: number;
  CashAmount: number;
  UPIAmount: number;
  Discount: number;
  TotalAmount: number;
  UPIRefNumber: number | string;
  Settle_Date: any;
  PaymentMode: string;
};


const parseFoodDate = (ddmmyyyy: string): Date => {
  const [dd, mm, yyyy] = ddmmyyyy.split('-').map(Number);
  return new Date(yyyy, mm - 1, dd);
};

const AddFoodEntry = () => {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>(initialList.foodDetails || []);
  const [total, setTotal] = useState(0);
  const [upiAmount, setUpiAmount] = useState(0);
  const [collectedAmount, setCollectedAmount] = useState<number | ''>('');
  const [previousSettlements, setPreviousSettlements] = useState<any[]>([]);

  const amountToReturn = collectedAmount !== '' ? collectedAmount - total : 0;
  const defaultValues: FormValues = {
    foodDetails: foods,
    discount: 0,
    discountBy: '',
    paymentMode: '',
    cashAmount: 0,
    upiAmount: 0,
    upiReferenceNumber: '',
    amount: 0,
    discountPassword: '',
    mobile_number: '',
  };

  const isAllCountsZero = useMemo(
    () => foods.every((f) => f.food === 0),
    [foods]
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);

  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

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

    const subtotal = foods.reduce((acc, f) => acc + f.food * 20, 0);
    const validDiscount = watchedDiscount > subtotal ? 0 : watchedDiscount;
    if (validDiscount !== watchedDiscount) {
      setValue('discount', 0);
    }

    const finalAmount = Math.max(subtotal - validDiscount, 0);
    setTotal(finalAmount);
    setValue('amount', finalAmount);
  }, [foods, watchedDiscount, setValue]);

  useEffect(() => {
    const resetFoods = initialList.foodDetails.map((f) => ({
      ...f,
      food: 0,
    }));

    reset({
      foodDetails: resetFoods,
      discount: 0,
      discountBy: '',
      paymentMode: '',
      upiReferenceNumber: '',
      amount: 0,
      discountPassword: '',
      cashAmount: 0,
      upiAmount: 0,
    });

    setFoods(resetFoods);
    setCollectedAmount('');
    setTotal(0);
  }, [reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (data.discount > 0 && data.discountPassword !== 'Revi25') {
      toast.error("You can't provide a discount without the correct password.");
      return;
    }

    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [staffName, setStaffName] = useState('Unknown');

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.name) {
        setStaffName(user.name);
      }
    }, []);
    const createdBy = staffName || 'Unknown';

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

    const payload: any = {
      // discount: data.discount.toString(),
      discount: data.discount,
      discountBy: data.discountBy,
      paymentMode: data.paymentMode,
      upiRefNumber: data.upiReferenceNumber,
      day1: foodDetails[0].food,
      day2: foodDetails[1].food,
      createdByName: createdBy,
      cashAmount: data.cashAmount,
      upiAmount: data.upiAmount,
      totalAmount: data.amount,
      mobile_number: data.mobile_number,
    };

    if (data.paymentMode === 'upi') {
      payload.upiAmount = data.amount;
    } else if (data.paymentMode === 'cash') {
      payload.cashAmount = data.amount;
    }

    try {
      const res = await fetch(`${config.BASE_URL}/addFood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(res)
      const text = await res.text();
      if (res.ok) {
        toast.success('Successfully added!');
        const resetFoods = foods.map((f) => ({
          ...f,
          food: 0,
        }));

        reset({
          discount: 0,
          discountBy: '',
          paymentMode: '',
          upiReferenceNumber: '',
          amount: 0,
          discountPassword: '',
          cashAmount: 0,
          upiAmount: 0,
          foodDetails: resetFoods,
          mobile_number: '',
        });

        setFoods(resetFoods);
        setCollectedAmount('');
        // fetchEntries();
        setTotal(0);

      } else if (res.status === 400) {
        toast.error('Invalid data. Please check your input.');
        toast.error(text);
      } else if (res.status === 401) {
        // toast.error('Unauthorized access. Please log in again.');
        toast.error(text);
      } else if (res.status === 500) {
        // toast.error('Server error. Please try again later.');
        toast.error(text);
      } else {
        toast.error(`Error: ${text}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    }
  });

  const handleReset = () => {
    const resetFoods = initialList.foodDetails.map((f) => ({
      ...f,
      food: 0,
    }));
    reset({
      foodDetails: resetFoods,
      discount: 0,
      discountBy: '',
      paymentMode: '',
      upiReferenceNumber: '',
      amount: 0,
      discountPassword: '',
      mobile_number: '',
    });
    setFoods(resetFoods);
    setCollectedAmount('');
    setTotal(0);
  };

  return (
    <Grid container spacing={2}>

      <Grid item xs={12} md={12}>
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader title="Food Details" />
            <Divider />
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
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
                  const isDisabled = is30thMay && isToday30thMay && currentHour >= 21;

                  return (
                    <Grid container spacing={1} key={idx} alignItems="center" justifyContent="center">
                      <Grid item xs={5} md={8}>
                        <Typography variant="body1">
                          {food.id} - {food.date}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} md={3}>
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
                              toast.error('Count cannot be negative');
                              return;
                            }
                            food.food = v;
                            setFoods([...foods]);
                            setValue('foodDetails', [...foods]);
                          }}
                        />
                      </Grid>
                    </Grid>
                  );
                })}
              </Stack>

              {!isAllCountsZero && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Discount Password"
                          type="password"
                          size="small"
                          fullWidth
                          {...register('discountPassword')}
                        />
                      </Grid>
                      {isDiscountAllowed && (
                        <Grid item xs={12} md={4}>
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
                        <Grid item xs={12} md={4}>
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
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          select
                          label="Payment Mode"
                          size="small"
                          fullWidth
                          {...register('paymentMode')}
                          required
                        >
                          <MenuItem value="cash">Cash</MenuItem>
                          <MenuItem value="upi">UPI</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="UPI Reference Number"
                          size="small"
                          fullWidth
                          {...register('upiReferenceNumber', {
                            validate: (v) =>
                              watchedPaymentMode === 'upi' && !v
                                ? 'UPI Reference Number is required for UPI payments'
                                : true,
                          })}
                          error={Boolean(errors.upiReferenceNumber)}
                          helperText={errors.upiReferenceNumber?.message}
                        />
                      </Grid>
                    </Grid>


                    <Box sx={{ textAlign: 'right', mt: 2 }}>
                      <Typography variant="h6" component="div">
                        Total Amount: {formatCurrency(total)}
                      </Typography>

                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                        <TextField
                          label="Amount Collected"
                          type="number"
                          size="small"
                          disabled={isAllCountsZero}
                          value={collectedAmount}
                          onChange={(e) =>
                            setCollectedAmount(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          sx={{ maxWidth: 250 }}
                        />

                        <TextField
                          label="Amount to Return"
                          size="small"
                          disabled={isAllCountsZero}
                          value={formatCurrency(amountToReturn)}
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{ maxWidth: 250 }}
                        />
                      </Box>
                    </Box>


                  </Stack>
                </>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Iconify icon="mingcute:close-line" />}
                  onClick={handleReset}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting || isAllCountsZero}
                >
                  Add Food Entry
                </Button>
              </Box>
            </Box>
          </Card>
        </form>

      </Grid>


    </Grid>
  );
};

export default AddFoodEntry;