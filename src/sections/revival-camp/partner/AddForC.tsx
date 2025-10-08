'use client';

import type { GridColDef } from '@mui/x-data-grid';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import {
    Box,
    Button,
    Card,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    InputAdornment,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';

import { getDistricts, getStates } from 'src/utils/helpers';

import { config } from 'src/constants/helpers';
import { checkInPartnerSchema } from 'src/constants/schema';
import {
    titleOptions,
} from 'src/constants/selectoptions';

import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import initialList from './initData.json';
import axios from 'axios';

type MemberOption = {
    id: number;
    name: string;
    gender: string;
    status: boolean;
    age: string;
};



const AddForC = () => {

    const [total, setTotal] = useState(0);
    const [members, setMembers] = useState<MemberOption[]>([]);
    const [collectedAmount, setCollectedAmount] = useState<number | ''>('');
    const [states, setStates] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState<string | ''>('');


    const amountToReturn = collectedAmount !== '' ? collectedAmount - total : 0;

    const defaultValues = {
        title: '',
        fullName: '',
        churchName: '',
        dateOfBirth: '',
        type: 'Stayer',
        occupation: 'others',
        mobileNumber: '',
        country: 'India',
        state: 'Andhra Pradesh',
        district: '',
        extraMale: 0,
        extraFemale: 0,
        infant: 0,
        extraChild: 0,
        city: '',
        pinCode: '',
        paymentMode: '',
        upiRefNumber: '',
        memberList: members,
        isAttended: 'yes',
        discount: 0,
        discountBy: '',
        amount: 0,
        discountPassword: '',
        textReminderConsent: true,
    };

    type MemberList = {
        id: number;
        name: string;
        gender: string;
        status: boolean;
        age: string;
    };

    type FormData = {
        dateOfBirth: string;
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
        extraMale: number;
        extraFemale: number;
        extraChild: number;
        infant: number;
        paymentMode: string;
        upiRefNumber: string;
        memberList: MemberList[];
        isAttended: string;
        textReminderConsent: boolean;
        discount: number;
        discountBy: string;
        amount: number;
        churchName: string;
        discountPassword: string;
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

    const values = watch();
    const selectedCountry = watch('country');


    useEffect(() => {
        const initializeData = async () => {

            // 2. Fetch states when country changes
            if (selectedCountry) {
                try {
                    const statesResponse = await axios.get(
                        // `${config.BASE_URL1}/lookup/states?country=${selectedCountry}`
                        `https://partnerservice-stage.jesusredeems.com/jrms/v1/lookup/states?country=${selectedCountry}`
                    );
                    setStates(statesResponse.data.stateList || []);
                } catch (error) {
                    console.error('Error fetching states:', error);
                }
            }
        };


        // Execute initialization
        initializeData();

        // Fetch options only on mount


    }, [selectedCountry]);


    const handleStateChange = async (newState: string | '') => {
        setSelectedState(newState);
        setValue('state', newState || '', { shouldValidate: true });
        setValue('district', '', { shouldValidate: true });

    };

    const watchTextReminder = watch('textReminderConsent');
    console.log("Current checkbox value:", watchTextReminder);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const created_by = user?.name || 'Unknown';

    const onSubmit = handleSubmit(async (data) => {
        const transformedData = {
            full_name: data.fullName || "",
            title: data.title || "",
            churchName: data.churchName || "",
            mobileNumber: data.mobileNumber || "",
            country: data.country || "",
            city: data.city || "",
            state: data.state || "",
            district: data.district || "",
            extraMale: Number(data.extraMale) || 0,
            extraFemale: Number(data.extraFemale) || 0,
            extraChild: Number(data.extraChild) || 0,
            infant: Number(data.infant) || 0,
            created_by,
            isAttended: 'yes',
            textReminderConsent: data.textReminderConsent ? 'y' : 'n', // Convert boolean to 'y'/'n'
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
                setValue('state', 'Andhra Pradesh');

                const districtsData = await getDistricts('India', 'Andhra Pradesh');
                // setDistrictsList(districtsData);
                setValue('district', '');

                const statesData = await getStates('India');
                // setStatesList(statesData);
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
                <CardHeader title="C - Form Details" />
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


                    <Field.Text name="fullName" label="Full Name" required size='small' />

                    <Field.Select name="title" label="Gender" required size='small'  >
                        {titleOptions.map((option) => (
                            <MenuItem value={option.value} key={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    {/* <Field.DatePicker name="dateOfBirth" label="Date of birth" /> */}

                    <Field.CountrySelect
                        name="country"
                        label="Country"
                        placeholder="Choose a country"
                        size='small'
                    />

                    <Field.Autocomplete
                        name="state"
                        label="State"
                        options={states}
                        value={selectedState}
                        onChange={(_, newValue) => handleStateChange(newValue)}
                        disableClearable
                        size='small'
                    />

                    <Field.Text
                        label="Mobile Number"
                        name="mobileNumber"
                        size='small'
                        required
                    />

                    {/* Text Me Reminders Checkbox with Disclaimer */}
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
                                            <Typography variant="body2">  By checking this box, I agree to receive messages.</Typography>

                                        </Box>
                                    }
                                />
                            )}
                        />
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
                            setValue('state', 'Andhra Pradesh');

                            const districtsData = await getDistricts('India', 'Andhra Pradesh');
                            //   setDistrictsList(districtsData);
                            setValue('district', '');

                            const statesData = await getStates('India');
                            //   setStatesList(statesData);
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
                        Add
                    </LoadingButton>
                </Box>
            </Card>
        </Form>
    );
};

export default AddForC;