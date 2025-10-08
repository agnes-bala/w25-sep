'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import { Card, CardHeader, Divider, Grid2, Typography, List, ListItem, ListItemButton } from '@mui/material';
import { searchPartnerSchema } from 'src/constants/schema';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { config } from 'src/constants/helpers';

interface Partner {
  id: string;
  full_name: string;
  mobile: string;
  state: string;
  district: string;
}

export default function CheckIn() {
  const [searchResults, setSearchResults] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const defaultValues = {
    searchTerm: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(searchPartnerSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.get(`${config.BASE_URL}/${data.searchTerm}`);
      console.log(response.data);

      // Extract data properly
      const extractedResults = response.data ? [response.data] : [];

      setSearchResults(extractedResults);
    } catch (error) {
      console.error('Error fetching partners:', error);
      setSearchResults([]);
    }
  });


  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setValue("searchTerm", partner.mobile);
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader title="Search Partner" />
        <Divider />
        <Grid2 container spacing={2} sx={{ p: 3 }}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Field.Text
                  name="searchTerm"
                  label="Mobile Number"
                  placeholder="Enter full mobile number to search"
                  autoFocus
                  required
                  type="search"
                  size="small"
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <LoadingButton
                  startIcon={<Iconify icon="mingcute:search-3-line" />}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Load Partner
                </LoadingButton>
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>

            <List>
              {searchResults.map((partner) => (
                <ListItem key={partner.id} disablePadding>
                  <ListItemButton onClick={() => handleSelectPartner(partner)}>
                    <Typography variant="subtitle1">{partner.full_name} ({partner.id})</Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {selectedPartner && (
              <Grid2 container spacing={2} sx={{ mt: 2 }}>
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="subtitle1">{selectedPartner.full_name} ({selectedPartner.id})</Typography>
                  <Typography color="grey" variant="body2">Mobile: {selectedPartner.mobile}</Typography>
                  <Typography color="grey" variant="body2">State: {selectedPartner.state}</Typography>
                  <Typography color="grey" variant="body2">District: {selectedPartner.district}</Typography>
                </Grid2>
              </Grid2>
            )}
          </Grid2>
        </Grid2>
      </Card>
    </Form>
  );
}