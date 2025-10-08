'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

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

interface PartnerFormProps {
  countries: { value: string; label: string }[];
  states: { value: string; label: string }[];
  districts: { value: string; label: string }[];
}

const AddNew: React.FC<PartnerFormProps> = ({ countries, states, districts }) => {
  const [statesList, setStatesList] = useState(states);
  const [districtsList, setDistrictsList] = useState(districts);
  const [districtVisible, setDistrictVisible] = useState(false);

  const defaultValues = {
    title: '',
    fullName: '',
    churchName: '',
    type: 'Stayer',
    occupation: 'others',
    mobileNumber: '',
    country: 'India',
    state: 'Andhra Pradesh',
    district: '',
    extraMale: 0,
    extraFemale: 0,
    extraChild: 0,
    city: '',
    pinCode: '',
    isAttended: 'yes',
    textReminderConsent: false, // New field for checkbox
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
    extraMale: number;
    extraFemale: number;
    extraChild: number;
    isAttended: string;
    churchName: string;
    textReminderConsent: boolean; // New field type
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
    register,
    formState: { isSubmitting, errors },
  } = methods;

  const handleCountryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const country = e.target.value;
    setValue('country', country);
    const statesData = await getStates(country);
    setValue('state', statesData[0].value);
    setStatesList(statesData);
    setValue('district', '');
  };

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
      created_by,
      isAttended: 'yes',
      textReminderConsent: data.textReminderConsent ? 'y' : 'n', // Convert boolean to 'y'/'n'
    };

    console.log("Transformed Data:", transformedData);

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
          <Field.Select name="title" label="Title" size="small" required>
            {titleOptions.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>

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

          <Field.Text name="extraMale" label="Extra Male" size="small" type="number" />

          <Field.Text name="extraFemale" label="Extra Female" size="small" type="number" />

          <Field.Text name="extraChild" label="Child Count" size="small" type="number" />

          {/* Text Me Reminders Checkbox with Disclaimer */}
          <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...register('textReminderConsent')}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2">Text Me Reminders</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    By checking this box, I agree to receive appointment reminder texts.
                    Message frequency varies by appointment. Message + data rates may apply.
                    Reply STOP to unsubscribe or HELP for help.
                  </Typography>
                </Box>
              }
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
            Add Pastor
          </LoadingButton>
        </Box>
      </Card>
    </Form>
  );
};

export default AddNew;