'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Grid2,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableFooter,
  TablePagination,
  TextField,
  InputAdornment,
} from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
import { config } from 'src/constants/helpers';
import { Field, Form } from 'src/components/hook-form';

interface ReportData {
  name: string;
  count: number;
}

interface StatsResponse {
  district?: ReportData[];
  state?: ReportData[];
  country?: ReportData[];
  totalCount?: number;
}

const CustomReport = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [districtData, setDistrictData] = useState<ReportData[]>([]);
  const [stateData, setStateData] = useState<ReportData[]>([]);
  const [countryData, setCountryData] = useState<ReportData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  // Separate pagination states for each table
  const [countryPage, setCountryPage] = useState(0);
  const [countryRowsPerPage, setCountryRowsPerPage] = useState(5);
  const [statePage, setStatePage] = useState(0);
  const [stateRowsPerPage, setStateRowsPerPage] = useState(5);
  const [districtPage, setDistrictPage] = useState(0);
  const [districtRowsPerPage, setDistrictRowsPerPage] = useState(5);

  // Search terms for each table
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');

  const defaultValues = {
    country: '',
    state: '',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = methods;

  const countryWatch = watch('country');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${config.BASE_URL}/countries`);
        setCountries(response.data);
      } catch (error) {
        console.error('Failed to fetch countries', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (countryWatch) {
      const fetchStates = async () => {
        try {
          const response = await axios.get(`${config.BASE_URL}/states/${countryWatch}`);
          setStates(response.data);
          setValue('state', ''); // Reset state selection when country changes
        } catch (error) {
          console.error('Failed to fetch states', error);
          setStates([]);
        }
      };

      fetchStates();
    } else {
      setStates([]);
      setValue('state', '');
    }
  }, [countryWatch, setValue]);

  const fetchStats = async (country: string, state: string) => {
    setLoading(true);
    try {
      let url = '';
      if (state) {
        url = `${config.BASE_URL}/stats?state=${encodeURIComponent(state)}`;
      } else if (country) {
        url = `${config.BASE_URL}/stats?country=${encodeURIComponent(country)}`;
      } else {
        return;
      }

      const response = await axios.get<StatsResponse>(url);
      const data = response.data;

      setCountryData(data.country || []);
      setStateData(data.state || []);
      // Only set district data if country is India
      setDistrictData(country.toLowerCase() === 'india' ? (data.district || []) : []);
      setTotalCount(data.totalCount || 0);

      // Reset all paginations and search terms when new data is fetched
      setCountryPage(0);
      setStatePage(0);
      setDistrictPage(0);
      setCountrySearch('');
      setStateSearch('');
      setDistrictSearch('');
    } catch (error) {
      console.error('Error fetching stats data:', error);
      setCountryData([]);
      setStateData([]);
      setDistrictData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setSelectedCountry(data.country);
    await fetchStats(data.country, data.state);
  });

  const handleReset = () => {
    reset();
    setSelectedCountry('');
    setCountryData([]);
    setStateData([]);
    setDistrictData([]);
    setTotalCount(0);
    // Reset all paginations and search terms
    setCountryPage(0);
    setStatePage(0);
    setDistrictPage(0);
    setCountrySearch('');
    setStateSearch('');
    setDistrictSearch('');
  };

  // Filter data based on search term
  const filterData = (data: ReportData[], searchTerm: string) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Country table handlers
  const handleCountryPageChange = (event: unknown, newPage: number) => {
    setCountryPage(newPage);
  };

  const handleCountryRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountryRowsPerPage(parseInt(event.target.value, 10));
    setCountryPage(0);
  };

  const handleCountrySearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountrySearch(event.target.value);
    setCountryPage(0);
  };

  // State table handlers
  const handleStatePageChange = (event: unknown, newPage: number) => {
    setStatePage(newPage);
  };

  const handleStateRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateRowsPerPage(parseInt(event.target.value, 10));
    setStatePage(0);
  };

  const handleStateSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateSearch(event.target.value);
    setStatePage(0);
  };

  // District table handlers
  const handleDistrictPageChange = (event: unknown, newPage: number) => {
    setDistrictPage(newPage);
  };

  const handleDistrictRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDistrictRowsPerPage(parseInt(event.target.value, 10));
    setDistrictPage(0);
  };

  const handleDistrictSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDistrictSearch(event.target.value);
    setDistrictPage(0);
  };

  const renderReportTable = (
    title: string,
    data: ReportData[],
    type: string,
    page: number,
    rowsPerPage: number,
    onPageChange: (event: unknown, newPage: number) => void,
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    searchTerm: string,
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const filteredData = filterData(data, searchTerm);
    if (filteredData.length === 0 && !searchTerm) return null;

    // Pagination calculation
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
    const currentData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <Box sx={{ mb: 4, bgcolor: 'background.paper', borderRadius: '8px', maxWidth: 600, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} width="100%">
          <Typography variant="h6">{title}</Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder={`Search ${type}`}
            value={searchTerm}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* <SearchIcon /> */}
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
        {filteredData.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
            No matching {type.toLowerCase()} found
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{type}</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentData.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={2} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      count={filteredData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={onPageChange}
                      onRowsPerPageChange={onRowsPerPageChange}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader title="Country Based Report" />
      <Divider />
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid2 container spacing={2} sx={{ p: 3 }}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Field.Select
              name="country"
              label="Country"
              size="small"
              fullWidth
              sx={{ maxWidth: '300px' }}
            >
              <MenuItem value="">Select Country</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid2>

          {selectedCountry.toLowerCase() === 'india' && (
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Field.Select
                name="state"
                label="State"
                size="small"
                fullWidth
                disabled={!countryWatch}
                sx={{ maxWidth: '300px' }}
              >
                <MenuItem value="">{states.length ? 'Select State' : 'No states available'}</MenuItem>
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid2>
          )}

          <Grid2 size={{ xs: 12, md: 4 }} display="flex" alignItems="center" gap={1}>
            <Button type="submit" variant="contained" disabled={isSubmitting || loading}>
              {loading ? <CircularProgress size={24} /> : 'Get Report'}
            </Button>
            <Button onClick={handleReset} variant="outlined" color="secondary">
              Reset
            </Button>
          </Grid2>
        </Grid2>
      </Form>
      <Divider />
      <Box
        p={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'space-around',
        }}
      >
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && selectedCountry && (
          <>
            {renderReportTable(
              "Country Details",
              countryData,
              "Country",
              countryPage,
              countryRowsPerPage,
              handleCountryPageChange,
              handleCountryRowsPerPageChange,
              countrySearch,
              handleCountrySearchChange
            )}

            <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
              <Box flex={1}>
                {renderReportTable(
                  "State Details",
                  stateData,
                  "State",
                  statePage,
                  stateRowsPerPage,
                  handleStatePageChange,
                  handleStateRowsPerPageChange,
                  stateSearch,
                  handleStateSearchChange
                )}
              </Box>
              {selectedCountry.toLowerCase() === 'india' && (
                <Box flex={1}>
                  {renderReportTable(
                    "District Details",
                    districtData,
                    "District",
                    districtPage,
                    districtRowsPerPage,
                    handleDistrictPageChange,
                    handleDistrictRowsPerPageChange,
                    districtSearch,
                    handleDistrictSearchChange
                  )}
                </Box>
              )}
            </Box>
          </>
        )}

        {!loading && !selectedCountry && (
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ textAlign: 'center', py: 4 }}
          >
            Please select a country to view reports
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default CustomReport;