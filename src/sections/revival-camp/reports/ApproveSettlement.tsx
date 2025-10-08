'use client';

import {
  Button,
  Card,
  CardHeader,
  Divider,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Grid2,
  TableRow,
} from '@mui/material';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Field, Form } from 'src/components/hook-form';
import { config } from 'src/constants/helpers';
// import { useSnackbar } from 'notistack';
import { toast } from 'src/components/snackbar';

interface SettlementData {
  Settlement_Id: string;
  Staff_Name: string;
  Settled_At: string;
  [key: string]: any;
}

const ApproveSettlement = () => {
  const [data, setData] = useState<SettlementData[]>([]);
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<string[]>([]);

  const defaultValues = {
    campDates: 'All',
    staffList: 'All',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [stName, setStaffName] = useState('Unknown');
  const [staffRole, setStaffRole] = useState('Unknown');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.name) {
      setStaffName(user.name);
      setStaffRole(user.role);
    }
  }, []);

  const role = staffRole;
  const username = stName;
  // const uuser = 

  useEffect(() => {
    axios
      .get(`${config.BASE_URL}/staffNames`)
      .then((res) => {
        setStaffList(res.data);

        // if(role !== 'Admin'){
        //   setStaffList([user?.name] || ['Unknown']);
        // }
      })
      .catch((err) => {
        console.error('Failed to fetch staff names', err);
      });
  }, []);

  const fetchData = async (staffName: string, campDate: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.BASE_URL}/cash-details`, {
        params: {
          staffName,
          campDate,
        },
      });

      // Sort data by Settled_At in descending order and group by Staff_Name
      const processedData = processAndSortData(response.data || []);
      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Process data to filter by Staff_Name and sort by Settled_At descending
  const processAndSortData = (rawData: SettlementData[]) => {
    // First, sort all data by Settled_At in descending order
    const sortedData = rawData.sort((a, b) => {
      const dateA = new Date(a.Settled_At || 0).getTime();
      const dateB = new Date(b.Settled_At || 0).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

    return sortedData;
  };

  const handleCancel = () => {
    methods.reset();
    setData([]);
  };

  const onSubmit = handleSubmit((formData) => {
    fetchData(formData.staffList, formData.campDates);
  });

  useEffect(() => {
    fetchData('All', 'All');
  }, []);

  const handleApprove = async (settlementId: string) => {
    try {
      const response = await axios.put(
        `${config.BASE_URL}/approve-cash-entry`,
        {},
        {
          params: {
            id: settlementId,
            approvedBy: username,
          },
        }
      );

      if (response.data?.message) {
        toast(response.data.message);
      } else {
        toast.success('Approved successfully.');
      }

      fetchData(methods.getValues('staffList'), methods.getValues('campDates'));
    } catch (error: any) {
      console.error('Approval failed:', error);
      toast.error(error.response?.data?.message || 'Failed to approve');
    }
  };

  const indianRupees = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
      }),
    []
  );

  const handleDownloadCSV = () => {
    if (data.length === 0) {
      toast.error('No data to download.');
      return;
    }

    const headers = [
      'Staff Name',
      ...currencyColumns,
      'UPI',
      'Cash',
      'System Amount',
      'Settle Amount',
      'Balance Amount',
      'Settled At',
      'Approve At',
      'Approve By',
    ];

    const rows = data.map((row) => {
      const values = [
        row['Staff_Name'] || '-',
        ...currencyColumns.map((col) => row[col] ?? 0),
        row['UPI'] ?? '-',
        row['Cash'] ?? '-',
        row['System_Amount'] ?? '-',
        row['Total'] ?? '-',
        row['Balance'] ?? '-',
        row['Settled_At']
          ? new Date(row['Settled_At']).toLocaleString('en-IN')
          : '-',
        row['Approve_At']
          ? new Date(row['Approve_At']).toLocaleString('en-IN')
          : '-',
        row['Approve_By'] ?? '-',
      ];

      return values.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'settlement_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (data.length === 0) {
      toast.error('No data to download.');
      return;
    }

    const printWindow = window.open('', '', 'width=800,height=600');

    const styles = `
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 4px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
        }
        .staff-group {
          background-color: #f8f8f8;
          font-weight: bold;
        }
      </style>
    `;

    // Group data by Staff_Name for better organization in PDF
    const groupedData: { [key: string]: SettlementData[] } = {};
    data.forEach(row => {
      const staffName = row['Staff_Name'] || 'Unknown';
      if (!groupedData[staffName]) {
        groupedData[staffName] = [];
      }
      groupedData[staffName].push(row);
    });

    let tableRows = '';
    Object.keys(groupedData).forEach(staffName => {
      // Add staff name as header row
      tableRows += `
        <tr class="staff-group">
          <td colspan="${currencyColumns.length + 10}">Staff: ${staffName}</td>
        </tr>
      `;

      // Add data rows for this staff member
      groupedData[staffName].forEach(row => {
        tableRows += `
          <tr>
            <td>${row['Staff_Name'] || '-'}</td>
            ${currencyColumns.map(col => `<td>${row[col] ?? 0}</td>`).join('')}
            <td>${row['UPI'] ?? '-'}</td>
            <td>${row['Cash'] ?? '-'}</td>
            <td>${row['System_Amount'] ?? '-'}</td>
            <td>${row['Total'] ?? '-'}</td>
            <td>${row['Balance'] ?? '-'}</td>
            <td>${row['Settled_At'] ? new Date(row['Settled_At']).toLocaleString('en-IN') : '-'}</td>
            <td>${row['Approve_At'] ? new Date(row['Approve_At']).toLocaleString('en-IN') : '-'}</td>
            <td>${row['Approve_By'] ?? '-'}</td>
          </tr>
        `;
      });
    });

    const tableHeaders = `
      <tr>
        <th>Staff Name</th>
        ${currencyColumns.map(col => `<th>${col}</th>`).join('')}
        <th>UPI</th>
        <th>Cash</th>
        <th>System Amount</th>
        <th>Settle Amount</th>
        <th>Balance Amount</th>
        <th>Settled At</th>
        <th>Approve At</th>
        <th>Approve By</th>
      </tr>
    `;

    const html = `
      <html>
        <head><title>Settlement Report</title>${styles}</head>
        <body>
          <h2>Settlement Report</h2>
          <p><strong>Sorted by:</strong> Staff Name and Settled Time (Descending)</p>
          <table>
            <thead>${tableHeaders}</thead>
            <tbody>${tableRows}</tbody>
          </table>
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow?.document.write(html);
    printWindow?.document.close();
  };

  const currencyColumns = [
    '₹1',
    '₹2',
    '₹5',
    '₹10',
    '₹20',
    '₹50',
    '₹100',
    '₹200',
    '₹500',
    // '₹2000',
  ];

  // Get unique staff names from current data for display
  const uniqueStaffNames = useMemo(() => {
    return [...new Set(data.map(item => item.Staff_Name))].filter(Boolean);
  }, [data]);

  return (
    <Card>
      <CardHeader
        title="Settlement Report"
        subheader={`Showing data for ${uniqueStaffNames.length} staff member(s), sorted by latest settlement first`}
      />
      <Divider />

      <Form methods={methods} onSubmit={onSubmit}>
        <Grid2 container spacing={3} sx={{ p: 3 }}>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Field.Select name="staffList" label="Staff List" size="small" required>
              <MenuItem value="All">All</MenuItem>

              {staffList.map((name) => (
                <MenuItem key={name} value={name}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </MenuItem>
              ))}
            </Field.Select>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 2 }}>
            <Field.Select name="campDates" label="Camp Dates" size="small" required>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="09-10-2025">09-10-2025</MenuItem>
              <MenuItem value="10-10-2025">10-10-2025</MenuItem>
              <MenuItem value="11-10-2025">11-10-2025</MenuItem>
            </Field.Select>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="inherit"
              disabled={isSubmitting || loading}
            >
              {loading ? 'Loading...' : 'Show Entries'}
            </Button>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 2 }}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              color="error"
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 2 }}>
            <Button
              variant="outlined"
              color="info"
              onClick={handleDownloadCSV}
              sx={{ ml: 2 }}
              disabled={data.length === 0}
            >
              Download CSV
            </Button>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDownloadPDF}
              disabled={data.length === 0}
            >
              Download PDF
            </Button>
          </Grid2>
        </Grid2>
      </Form>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={150}>Staff Name</TableCell>
                {currencyColumns.map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
                <TableCell>UPI</TableCell>
                <TableCell>System</TableCell>
                <TableCell>Cash</TableCell>

                <TableCell>Settled</TableCell>
                <TableCell>Balance Amount</TableCell>
                <TableCell>Settled At</TableCell>
                <TableCell>Approve At</TableCell>
                <TableCell>Approve By</TableCell>
                {role === 'Admin' && <TableCell>Options</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={18} align="center">
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 1 === 0 ? 'background.default' : 'action.hover'
                    }}
                  >
                    <TableCell>
                      <strong>{row['Staff_Name'] || '-'}</strong>
                    </TableCell>
                    {currencyColumns.map((col) => (
                      <TableCell key={col}>{row[col] ?? 0}</TableCell>
                    ))}
                    <TableCell>
                      {/* { row['UPI'] ?? '-'} */}
                      {indianRupees.format(Number(row['UPI']))}

                    </TableCell>
                    <TableCell>{indianRupees.format(Number(row['System_Amount']))}</TableCell>
                    <TableCell>
                      {indianRupees.format(Number(row['Cash']))}
                    </TableCell>

                    <TableCell>
                      {indianRupees.format(Number(row['Total']))}
                    </TableCell>
                    <TableCell>{indianRupees.format(Number(row['Balance_Amount']))}</TableCell>
                    <TableCell>
                      {row['Settled_At']
                        ? new Date(row['Settled_At']).toLocaleString('en-IN', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {row['Approve_At']
                        ? new Date(row['Approve_At']).toLocaleString('en-IN', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        : '-'}
                    </TableCell>
                    <TableCell>{row['Approve_By'] ?? '-' }</TableCell>
                    {role === 'Admin' && row['status'] !== 'APPROVED' && (
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleApprove(row['Settlement_Id'])}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Card>
  );
};

export default ApproveSettlement;