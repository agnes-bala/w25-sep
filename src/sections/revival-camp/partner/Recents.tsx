'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { config } from 'src/constants/helpers';
import { useAuthContext } from 'src/auth/hooks';

interface VisitorData {
  idGenerate: string;
  fullName: string;
  mobileNumber: string;
  country: string;
  state: string;
  district: string;
  extraMale: string;
  extraFemale: string;
  femaleChild: string;
  maleChild: string;
  created_at: string;
  paymentMode: string;
  amount: string;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];
const DEFAULT_ROWS_PER_PAGE = 5;

export default function Recents() {
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  const created = user?.name;

  useEffect(() => {
    const fetchVisitorData = async () => {
      if (!created) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${config.BASE_URL}/recentEntries?staffName=${created}`
        );

        console.log(response, "recent entries response");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: VisitorData[] = await response.json();
        setVisitorData(data);
      } catch (err) {
        console.error('Error fetching visitor data:', err);
        setError('Failed to load recent entries');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, [user?.name]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - visitorData.length)
    : 0;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (visitorData.length === 0) return <div>No recent entries found</div>;

  return (
    <Card>
      <CardHeader title="Recent Entries" />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              {/* <TableCell>Country</TableCell> */}
              {/* <TableCell>State</TableCell> */}
              <TableCell>District</TableCell>
              {/* <TableCell>Extra Male</TableCell> */}
              <TableCell>Extra Female</TableCell>
              <TableCell>Child Male</TableCell>
              <TableCell>Child Female</TableCell>
              <TableCell> Mode</TableCell>
              <TableCell>Amount</TableCell>

              {/* <TableCell>Created At</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {visitorData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow
                  key={`${item.idGenerate}-${item.created_at}`}
                  hover
                >
                  <TableCell>{item.idGenerate}</TableCell>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>{item.mobileNumber}</TableCell>
                 
                  <TableCell>{item.district}</TableCell>
                  
                  <TableCell>{item.extraFemale}</TableCell>
                  <TableCell>{item.maleChild}</TableCell>
                  <TableCell>{item.femaleChild}</TableCell>
                  <TableCell>{item.paymentMode}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  {/* <TableCell>
                    {new Date(item.created_at).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell> */}
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={10} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={visitorData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Card>
  );
}