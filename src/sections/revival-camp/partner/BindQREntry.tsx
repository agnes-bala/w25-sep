'use client';

import { Button, Card, CardHeader, Divider, Grid2, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Field, Form } from 'src/components/hook-form';
import initialList from './initData.json';

export default function BindQREntry() {
  const [members, setMembers] = useState(initialList.members);
  const defaultValues = {
    title: '',
  };
  const methods = useForm({
    mode: 'all',
    // resolver: zodResolver(),
    defaultValues,
  });
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    console.info(data);
  });
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ mt: 1 }}>
        <CardHeader title="QR Details" />
        <Divider />
        <Grid2 container spacing={1} sx={{ p: 3 }}>
          {members.map((member, index) => (
            <Grid2 size={{ xs: 12, md: 3 }} key={index}>
              <Typography variant="h6">{member.name}</Typography>
              <Field.Text name={`members[${index}].title`} label="QR Code" size="small" required />
            </Grid2>
          ))}
        </Grid2>
        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mx: 3, mb: 3 }}>
          Submit
        </Button>
      </Card>
    </Form>
  );
}