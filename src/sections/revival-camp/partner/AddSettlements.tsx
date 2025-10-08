'use client';

import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Card,
  Divider,
  Grid2,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { config } from 'src/constants/helpers';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

interface SummaryResponse {
  totalAmount: string;
  totalUpiAmount: string;
  totalCashAmount: string;
}

const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero Rupees';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };

  return convert(num) + ' Only';
};

const denominations = [
  { label: 'UPI', value: 'upi' },
  { label: '500 *', value: 500 },
  { label: '200 *', value: 200 },
  { label: '100 *', value: 100 },
  { label: '50 *', value: 50 },
  { label: '20 *', value: 20 },
  { label: '10 *', value: 10 },
  { label: '5 *', value: 5 },
  { label: '2 *', value: 2 },
  { label: '1 *', value: 1 },
];


const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);

const AddSettlements = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const createdBy = user?.name || 'Unknown';

  const [totalAmount, setTotalAmount] = useState(0);
  const [summaryUpiAmount, setSummaryUpiAmount] = useState(0);
  const [systemAmount, setSystemAmount] = useState(0);

  const [upiAmount, setUpiAmount] = useState(0);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  const [previousSettlements, setPreviousSettlements] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchSummary();
    fetchPreviousSettlements();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get<SummaryResponse>(
        `${config.BASE_URL}/finalAmount?createdBy=${createdBy}`
      );
      const { totalCashAmount, totalUpiAmount, totalAmount } = res.data;
      
      setTotalAmount(parseFloat(totalAmount));
      setSummaryUpiAmount(parseFloat(totalUpiAmount));
      setUpiAmount(parseFloat(totalUpiAmount));
      setSystemAmount(parseFloat(totalAmount));
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error('Failed to fetch summary');
    }
  };

  const fetchPreviousSettlements = async () => {
    try {
      const res = await fetch(`${config.BASE_URL}/previousSettlement?settledBy=${createdBy}`);

      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      setPreviousSettlements(data);

    } catch (error) {
      console.error('Error fetching previous settlements:', error);
      toast.error('Failed to fetch previous settlements');
    }
  };

  const handleCountChange = (value: number, key: string) => {
    if (value < 0) {
      toast.error('Count cannot be negative');
      return;
    }
    setCounts(prev => ({ ...prev, [key]: value }));
  };

  const totalCashInput = useMemo(
    () =>
      denominations
        .filter(d => d.value !== 'upi')
        .reduce((sum, d) => sum + (counts[String(d.value)] || 0) * Number(d.value), 0),
    [counts]
  );

  const initialDue = totalAmount;
  const toPay = initialDue - (totalCashInput + upiAmount);

  const paid = totalCashInput + upiAmount;

  const paginatedSettlements = previousSettlements.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSubmit = async () => {


    const requestBody: any = {
      cashAmount: totalCashInput,
      upiAmount,
      totalAmount: totalCashInput + upiAmount,
      balanceAmount: toPay,
      settledBy: createdBy,
      status: 'No',
      systemAmount: systemAmount
    };


    denominations.forEach(d => {
      if (d.value !== 'upi') {
        requestBody[`rs${d.value}`] = counts[String(d.value)] || 0;
      }
    });

    try {
      const resp = await fetch(`${config.BASE_URL}/addSettlement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (resp.ok) {
        toast.success('Settlement submitted successfully!');
        setCounts({});
        setUpiAmount(0);
        fetchPreviousSettlements();
        window.location.reload();

      } else {
        const errorData = await resp.json();
        toast.error(`Error: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting settlement:', error);
      toast.error('Error submitting settlement');
    }
  };

  return (
    <Card sx={{ mt: 2, p: 3 }}>
      <Grid2 container spacing={2}>
        {/* Denominations */}
        <Grid2 size={{xs:12,md:4}}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Denomination
          </Typography>
          <TableContainer sx={{ maxWidth: 400 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Count/Amount</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {denominations.map(d => (
                  <TableRow key={String(d.value)}>
                    <TableCell>{d.label}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        sx={{ width: 60 }}
                        value={d.value === 'upi' ? upiAmount : counts[String(d.value)] || 0}
                        disabled={d.value === 'upi'}
                        onChange={e =>
                          d.value === 'upi'
                            ? setUpiAmount(Number(e.target.value))
                            : handleCountChange(Number(e.target.value), String(d.value))
                        }
                      />

                    </TableCell>
                    <TableCell>
                      {d.value === 'upi'
                        ? formatCurrency(upiAmount)
                        : formatCurrency((counts[String(d.value)] || 0) * Number(d.value))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>

        {/* Summary & Previous Settlements */}
        <Grid2 size={{xs:12,md:8}}>
          <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
            <Typography variant="h5" align="center" sx={{ backgroundColor: '#f44336', color: '#fff', p: 1, borderRadius: 1, fontWeight: 600, mt: 1 }}>
              To Pay: {formatCurrency(toPay > 0 ? toPay : 0)}
            </Typography>
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: 600, mt: 1 }}
            >
              Paid: {formatCurrency(paid)}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 1 }}>
              {paid > 0 ? numberToWords(paid) : 'Rupees Only'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Cash:</Typography>
              <Typography>{formatCurrency(totalCashInput)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography>UPI:</Typography>
              <Typography>{formatCurrency(upiAmount)}</Typography>
            </Box>
          </Box>

          {/* Previous Settlements List */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Previous Settlements</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cash</TableCell>
                    <TableCell>UPI</TableCell>
                    <TableCell>System</TableCell>
                    <TableCell>Settled</TableCell>
                    <TableCell>Shortage</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSettlements.map((rec, i) => (
                    <TableRow key={i}>
                      <TableCell>{formatCurrency(rec.Cash_Amount)}</TableCell>
                      <TableCell>{formatCurrency(rec.UPI_Amount)}</TableCell>
                      <TableCell>{formatCurrency(rec.System_Amount)}</TableCell>
                      <TableCell>{formatCurrency(rec.Total_Amount)}</TableCell>
                      <TableCell>{formatCurrency(rec.Balance_Amount)}</TableCell>
                      <TableCell>
                        {new Date(rec.Settle_Date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',

                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {previousSettlements.length > rowsPerPage && (
              <Pagination
                count={Math.ceil(previousSettlements.length / rowsPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
              />
            )}
          </Box>
        </Grid2>
      </Grid2>


      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Iconify icon="mingcute:close-line" />}
          onClick={() => setCounts({})}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="inherit"
          // disabled={paid === 0}
          disabled={totalAmount === 0}
          onClick={handleSubmit}

        >
          Add Settlement
        </Button>
      </Box>

    </Card>
  );
};

export default AddSettlements;