'use client';

import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';

import { config } from 'src/constants/helpers';

interface CountryData {
  country: string;
  count: number;
}

interface StateData {
  state: string;
  count: number;
}

interface DistrictData {
  district: string;
  count: number;
}

const LocationBasedReport = () => {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [districtData, setDistrictData] = useState<DistrictData[]>([]);

  const [countryPage, setCountryPage] = useState(0);
  const [statePage, setStatePage] = useState(0);
  const [districtPage, setDistrictPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const exportToCSV = (data: any[], headers: string[], filename: string) => {
    const csvRows = [headers.join(',')];

    data.forEach((row) => {
      const values = headers.map((header) => JSON.stringify(row[header.toLowerCase()]));
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPDF = (data: any[], headers: string[], title: string) => {
    const popup = window.open('', '_blank');
    if (!popup) return;

    const tableRows = data.map(row =>
      `<tr>${headers
        .map(header => `<td style="border:1px solid #ddd;padding:8px">${row[header.toLowerCase()]}</td>`)
        .join('')}</tr>`
    );

    const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
          h2 { text-align: center; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <table>
          <thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead>
          <tbody>${tableRows.join('')}</tbody>
        </table>
      </body>
    </html>
  `;

    popup.document.write(html);
    popup.document.close();
    popup.focus();
    popup.print();
  };


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/countByCountry`);
        const data = await response.json();
        setCountryData(data.data);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    const fetchStates = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/countByState`);
        const data = await response.json();
        setStateData(data.data);
      } catch (error) {
        console.error('Error fetching state data:', error);
      }
    };

    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/countByDistrict`);
        const data = await response.json();
        setDistrictData(data.data);
      } catch (error) {
        console.error('Error fetching district data:', error);
      }
    };

    fetchCountries();
    fetchStates();
    fetchDistricts();
  }, []);

  const handleChangePage = (setter: React.Dispatch<React.SetStateAction<number>>) => (
    event: unknown,
    newPage: number
  ) => {
    setter(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCountryPage(0);
    setStatePage(0);
    setDistrictPage(0);
  };

  return (
    <Grid2 container spacing={1} sx={{ p: 3 }}>
      {/* Country Card */}
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Card>
          <CardHeader title="Country Based Report" />
          <Divider />
          {/* <br></br> */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2, ml: 2, mb: 2 }}>
            <Button size="small" variant="outlined" onClick={() => exportToCSV(countryData, ['Country', 'Count'], 'Country_Report')}>
              CSV
            </Button>
            <Button size="small" variant="outlined" onClick={() => printPDF(countryData, ['Country', 'Count'], 'Country Based Report')}>
              PDF
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  <TableCell align="right">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {countryData
                  .slice(countryPage * rowsPerPage, countryPage * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.country}>
                      <TableCell>{item.country}</TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={countryData.length}
              page={countryPage}
              onPageChange={handleChangePage(setCountryPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        </Card>
      </Grid2>

      {/* State Card */}

      <Grid2 size={{ xs: 12, md: 4 }}>
        <Card>
          <CardHeader title="State Based Report" />
          <Divider />
          <Box sx={{ display: 'flex', gap: 1, mt: 2, ml: 2 }}>
            <Button size="small" variant="outlined" onClick={() => exportToCSV(stateData, ['State', 'Count'], 'State_Report')}>
              CSV
            </Button>
            <Button size="small" variant="outlined" onClick={() => printPDF(stateData, ['State', 'Count'], 'State Based Report')}>
              PDF
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>State</TableCell>
                  <TableCell align="right">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateData
                  .slice(statePage * rowsPerPage, statePage * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.state}>
                      <TableCell>{item.state}</TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={stateData.length}
              page={statePage}
              onPageChange={handleChangePage(setStatePage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        </Card>
      </Grid2>

      {/* District Card */}
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Card>
          <CardHeader title="District Based Report" />
          <Divider />
          <Box sx={{ display: 'flex', gap: 1, mt: 2, ml: 2 }}>
            <Button size="small" variant="outlined" onClick={() => exportToCSV(districtData, ['District', 'Count'], 'District_Report')}>
              CSV
            </Button>
            <Button size="small" variant="outlined" onClick={() => printPDF(districtData, ['District', 'Count'], 'District Based Report')}>
              PDF
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>District</TableCell>
                  <TableCell align="right">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {districtData
                  .slice(districtPage * rowsPerPage, districtPage * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.district}>
                      <TableCell>{item.district}</TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={districtData.length}
              page={districtPage}
              onPageChange={handleChangePage(setDistrictPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        </Card>
      </Grid2>
    </Grid2>
  );
};

export default LocationBasedReport;