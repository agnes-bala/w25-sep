'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  Grid2,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/system';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { config } from 'src/constants/helpers';

const SIDEBAR_WIDTH = 160;

const Sidebar = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  overflowX: 'auto',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: {
    width: SIDEBAR_WIDTH,
    height: '80vh',
    borderRight: `1px solid ${theme.palette.divider}`,
    borderBottom: 'none',
  },
}));

const SidebarItem = styled('div')<{ selected: boolean }>(({ theme, selected }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  fontWeight: selected ? 'bold' : 'normal',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

type Log = {
  childName: string;
  childAge: number;
  childGender: string;
  parentName: string;
  mobile: string;
  id: string;
  checkInTime: string | null;
  checkOutTime: string | null;
};

type CountResponse = {
  overAllCheckInCount: number;
  currentInCount: number;
  currentCheckOutCount: number;
};

const dayToEventDate: Record<number, string> = {
  4: '2025-05-05',
  5: '2025-05-06',
  6: '2025-05-07',
  7: '2025-05-08',
  8: '2025-05-09',
  9: '2025-05-10',
};

const formatTime = (time: string | null) => {
  if (!time) return '-';
  const date = new Date(time);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function LogView() {
  const theme = useTheme();
  const [selectedLog, setSelectedLog] = useState(4);
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [counts, setCounts] = useState<CountResponse>({
    overAllCheckInCount: 0,
    currentInCount: 0,
    currentCheckOutCount: 0,
  });

  const fetchLogs = async (day: number) => {
    const eventDate = dayToEventDate[day];
    if (!eventDate) {
      setLogs([]);
      return;
    }

    try {
      const [logRes, countRes] = await Promise.all([
        axios.get<Log[]>(`${config.BASE_URL}/log?eventDate=${eventDate}`),
        axios.get<CountResponse>(`${config.BASE_URL}/counts?date=${eventDate}`),
      ]);
      setLogs(logRes.data);
      setCounts(countRes.data);
    } catch (error) {
      console.error('Error fetching logs or counts:', error);
      setLogs([]);
      setCounts({ overAllCheckInCount: 0, currentInCount: 0, currentCheckOutCount: 0 });
    }
  };

  useEffect(() => {
    fetchLogs(selectedLog);
  }, [selectedLog]);

  const handleLogSelection = (id: number) => {
    setSelectedLog(id);
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredLogs = logs.filter((log) =>
    `${log.childName}${log.childAge}${log.parentName}${log.id}${log.mobile}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const availableDays = Object.keys(dayToEventDate).map(Number);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: '100%',
      }}
    >
      <Sidebar>
        {availableDays.map((day) => (
          <SidebarItem
            key={day}
            onClick={() => handleLogSelection(day)}
            selected={selectedLog === day}
          >
            Day {day} Log
          </SidebarItem>
        ))}
      </Sidebar>

      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          overflow: 'auto',
        }}
      >
        {/* Search Box */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              width: { xs: '100%', sm: 300 },
              backgroundColor: 'white',
            }}
          >
            <Iconify icon="mingcute:search-3-line" color="gray" width={20} height={20} />
            <InputBase
              placeholder="Search by name, ID..."
              value={search}
              onChange={handleSearchChange}
              sx={{ ml: 1, flex: 1 }}
            />
          </Box>
        </Box>

        {/* Log Table */}
        <Card sx={{ width: '100%' }}>
          {/* <CardHeader title={`Viewing: Day ${selectedLog} Log`} /> */}

          <Grid2 container spacing={2} mt={2} ml={5}>
            <Grid2 size={{ xs: 12, md: 3, sm: 6 }}>
              <Typography fontWeight={600}>Total In Kids: {counts.overAllCheckInCount}</Typography>
              {/* <Typography>{counts.overAllCheckInCount}</Typography> */}
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3, sm: 6 }}>
              <Typography fontWeight={600}>Current In Kids: {counts.currentInCount}</Typography>
              <Typography />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3, sm: 6 }}>
              <Typography fontWeight={600}>Current Out Kids: {counts.currentCheckOutCount}</Typography>
              {/* <Typography>{counts.currentCheckOutCount}</Typography> */}
            </Grid2>
            {/* <Grid2 size={{ xs: 12, md: 3, sm: 6 }}>
              <Button variant="outlined" color="secondary" onClick={checkout}>
                CHECK OUT ALL
              </Button>
            </Grid2> */}
          </Grid2>
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Parent</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Child</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Check-In</TableCell>
                    <TableCell>Check-Out</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLogs.map((log, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 0 ? theme.palette.action.hover : 'inherit',
                      }}
                    >
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.parentName}</TableCell>
                      <TableCell>{log.mobile}</TableCell>
                      <TableCell>{log.childName}</TableCell>
                      <TableCell>{log.childAge}</TableCell>
                      <TableCell>{log.childGender}</TableCell>
                      <TableCell>
                        <Label color={log.checkInTime ? 'success' : 'default'} variant="soft">
                          {formatTime(log.checkInTime)}
                        </Label>
                      </TableCell>
                      <TableCell>
                        <Label color={log.checkOutTime ? 'error' : 'default'} variant="soft">
                          {formatTime(log.checkOutTime)}
                        </Label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredLogs.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
