'use client';

import { useEffect, useState } from 'react';

import { Card, CardHeader, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

import { config } from 'src/constants/helpers';

type Entry = {
    Mobile_number: string;
    day1: number;
    day2: number;
    CashAmount: number;
    UPIAmount: number;
    discount: number;
    totalAmount: number;
    upiRefNumber: number | string;
    Settle_Date: any;
    paymentMode: string;
    createdAt: any;
};

export default function MyFoodEntries() {
    // const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [staffName, setStaffName] = useState('Unknown');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user?.name) {
            setStaffName(user.name);
        }
    }, []);

    const createdBy = staffName;
    const [entries, setEntries] = useState<Entry[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await fetch(`${config.BASE_URL}/foodEntries?createdByName=${encodeURIComponent(createdBy)}`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data: Entry[] = await response.json();
                if (Array.isArray(data)) {
                    setEntries(data);
                } else {
                    setEntries([]);
                }
            } catch (error) {
                console.error('Error fetching entries:', error);
                setEntries([]);
            }
        };
        fetchEntries();
    }, [createdBy]);

    return (
        <Card>
            <CardHeader title="My Food Entries" />
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>Mobile</TableCell> */}
                            <TableCell>Day1</TableCell>
                            <TableCell align="right">Day2</TableCell>
                            <TableCell>Mode</TableCell>

                            <TableCell>discount</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Ref</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No records found
                                </TableCell>
                            </TableRow>
                        ) : (
                            entries
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => {
                                    const isCash = item.paymentMode === 'cash';
                                    return (
                                        <TableRow key={index}>
                                            {/* <TableCell>{item.Mobile_number}</TableCell> */}
                                            <TableCell>{item.day1}</TableCell>
                                            <TableCell align="right">{item.day2}</TableCell>

                                            <TableCell>
                                                {isCash ? (
                                                    <Chip
                                                        label={`${item.paymentMode}`}
                                                        color="primary"
                                                        size="medium"
                                                        variant="outlined"
                                                    />
                                                ) : (
                                                    <Chip
                                                        label={`${item.paymentMode}`}
                                                        color="secondary"
                                                        size="medium"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </TableCell>

                                            <TableCell>{item.discount}</TableCell>
                                            <TableCell>{item.totalAmount}</TableCell>
                                            <TableCell>{item.upiRefNumber !== '' ? item.upiRefNumber : '-'}</TableCell>
                                            <TableCell>
                                                {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',

                                                })}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        )}
                    </TableBody>

                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={entries.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Card>
    )
}
