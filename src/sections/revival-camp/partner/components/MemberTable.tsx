'use client';

import React from 'react';
import {
  Box,
  Button,
  Typography,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

interface MemberTableProps {
  // Form control props
  setValue: (name: any, value: any) => void;
  getValues: (name: any) => any;
  
  // New age-based member counts
  under: number;
  maleChild: number;    // 7-14 male
  femaleChild: number;  // 7-14 female
  extraFemale: number;  // 14+ female
  
  // Control props
  disabled?: boolean;
  showQuickAdd?: boolean;
  
  // Display mode - 'form' for editable fields, 'display' for read-only display
  mode?: 'form' | 'display';
  
  // For display mode - member data from search results (backward compatibility)
  extraMaleDisplay?: string | number;
  extraFemaleDisplay?: string | number;
  extraChildDisplay?: string | number;
}

const MemberTable: React.FC<MemberTableProps> = ({
  setValue,
  getValues,
  under,
  maleChild,
  femaleChild,
  extraFemale,
  disabled = false,
  showQuickAdd = true,
  mode = 'form',
  extraMaleDisplay,
  extraFemaleDisplay,
  extraChildDisplay,
}) => {
  // Handle child click to increment age-based categories
  const handleChildClick = (ageCategory: 'under' | 'maleChild' | 'femaleChild' | 'extraFemale') => {
    if (disabled || mode === 'display') return;
    
    const currentValue = getValues(ageCategory) || 0;
    const newValue = currentValue + 1;
    setValue(ageCategory, newValue);

    // Show feedback to user
    const categoryNames = {
      under: 'Under 7 (No fee)',
      maleChild: 'Male Child 7-14 (₹100)',
      femaleChild: 'Female Child 7-14 (₹100)',
      extraFemale: 'Female 14+ (₹200)'
    };

    toast.success(`Added 1 ${categoryNames[ageCategory]}. Total: ${newValue}`, {
      position: "top-center",
    });
  };

  // Handle child click to decrement age-based categories
  const handleChildRemove = (ageCategory: 'under' | 'maleChild' | 'femaleChild' | 'extraFemale') => {
    if (disabled || mode === 'display') return;
    
    const currentValue = getValues(ageCategory) || 0;
    if (currentValue > 0) {
      const newValue = currentValue - 1;
      setValue(ageCategory, newValue);

      // Show feedback to user
      const categoryNames = {
        under: 'Under 7 (No fee)',
        maleChild: 'Male Child 7-14 (₹100)',
        femaleChild: 'Female Child 7-14 (₹100)',
        extraFemale: 'Female 14+ (₹200)'
      };

      toast.info(`Removed 1 ${categoryNames[ageCategory]}. Total: ${newValue}`, {
        position: "top-center",
      });
    }
  };

  // Calculate total extra members count for display mode
  const getTotalExtraMembers = () => {
    if (mode === 'display') {
      const male = parseInt(extraMaleDisplay?.toString() || '0') || 0;
      const female = parseInt(extraFemaleDisplay?.toString() || '0') || 0;
      const child = parseInt(extraChildDisplay?.toString() || '0') || 0;
      return male + female + child;
    }
    return under + maleChild + femaleChild + extraFemale;
  };

  // Display mode - show member counts in unified table format
  if (mode === 'display') {
    const maleTotal = parseInt(extraMaleDisplay?.toString() || '0') || 0;
    const femaleTotal = parseInt(extraFemaleDisplay?.toString() || '0') || 0;
    const childTotal = parseInt(extraChildDisplay?.toString() || '0') || 0;
    
    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="body1" color="primary" sx={{ mb: 0.5, fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' }}>
          Extra Members Count
        </Typography>
        
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxWidth: '500px',
              // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Table sx={{ minWidth: 300 }} size="small">
              <TableHead>
                <TableRow sx={{  }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      py: 0.5
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: '0.8rem',
                      color: '#',
                      // borderRight: '1px solid #e0e0e0',
                      textAlign: 'center',
                      py: 0.5
                    }}
                  >
                    Male
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: '0.8rem',
                      // color: '#d32f2f',
                      textAlign: 'center',
                      py: 0.5
                    }}
                  >
                    Female
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{  }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      color: '#333',
                      textAlign: 'center',
                      py: 0.8,
                      // backgroundColor: '#f9f9f9'
                    }}
                  >
                    Extra Members
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      textAlign: 'center',
                      py: 0.8,
                    }}
                  >
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {maleTotal}
                    </Typography>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      textAlign: 'center',
                      py: 0.8,
                    }}
                  >
                    <Typography variant="body1" color="secondary" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {femaleTotal}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{  }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      color: '#333',
                      borderRight: '1px solid #e0e0e0',
                      textAlign: 'center',
                      py: 0.8,
                    }}
                  >
                    Extra Child
                  </TableCell>
                  <TableCell 
                    colSpan={2}
                    sx={{ 
                      textAlign: 'center',
                      py: 0.8,
                      // backgroundColor: '#fff3e0'
                    }}
                  >
                    <Typography variant="body1" color="warning.main" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {childTotal}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      color: '#333',
                      textAlign: 'center',
                      py: 0.5
                    }}
                  >
                    Total
                  </TableCell>
                  <TableCell 
                    colSpan={2}
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      color: '#2e7d32',
                      textAlign: 'center',
                      py: 0.5
                    }}
                  >
                    {getTotalExtraMembers()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  }

  // Helper function to render input field with +/- buttons
  const renderInputField = (fieldName: string, value: number, color: string) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
        {showQuickAdd && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleChildRemove(fieldName as any)}
            disabled={disabled || value === 0}
            color="secondary"
            sx={{ 
              minWidth: '34px',
              width: '34px',
              height: '34px',
              borderColor: 'black',
              color: 'black',
              '&:hover': { 
                backgroundColor: 'black',
                color: 'white',
                borderColor: 'black'
              },
              '&:disabled': { 
                borderColor: '#bbbbbb',
                color: '#bbbbbb'
              }
            }}
          >
            <Iconify icon="material-symbols:remove" sx={{ fontSize: '14px' }} />
          </Button>
        )}
        <Field.Text
          name={fieldName}
          size="small"
          type="number"
          inputProps={{ min: 0, style: { textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', width: '50px' } }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(0, parseInt(e.target.value) || 0);
            setValue(fieldName, value);
          }}
          disabled={disabled}
          sx={{ 
            width: '70px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& fieldset': { borderColor: color },
              '& input': { padding: '6px' }
            }
          }}
        />
        {showQuickAdd && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleChildClick(fieldName as any)}
            disabled={disabled}
            color="secondary"
            sx={{ 
              minWidth: '34px',
              width: '34px',
              height: '34px',
              borderColor: 'secondary.main',
              color: 'secondary.main',
              '&:hover': { 
                backgroundColor: 'secondary.main',
                color: 'white',
                borderColor: 'secondary.main'
              }
            }}
          >
            <Iconify icon="material-symbols:add" sx={{ fontSize: '18px' }} />
          </Button>
        )}
      </Box>
    );
  };

  // Form mode - show unified member table
  return (
    <Box sx={{ 
      gridColumn: '1 / -1', 
      display: "flex", 
      justifyContent: "center", 
      mt: 0
    }}>
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxWidth: '600px',
          borderRadius: 1,
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 200, textAlign: 'center' }} size="small">
          <TableHead>
            <TableRow sx={{ textAlign: 'center' }}>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: '0.9rem',
                  color: 'black',  
                  textAlign: 'center',
                  py: 0.3
                }}
              >
                Age Category
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: '0.9rem',
                  color: 'black',
                  textAlign: 'center',
                  py: 0.3
                }}
              >
                Count
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Under 7 Years Row */}
            <TableRow sx={{  }}>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  color: '#333',
                  // borderRight: '1px solid #e0e0e0',
                  // textAlign: 'center',
                  py: 0.5,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0, fontSize: '0.85rem' }}>
                    Under 7 Years 
                  </Typography>
                  <Typography variant="caption" color="default" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    FREE
                  </Typography>
                </Box>
              </TableCell>
              <TableCell 
                sx={{ 
                  textAlign: 'center',
                  py: 0.5,
                }}
              >
                {renderInputField('under', under, '#A3A5DC')}
              </TableCell>
            </TableRow>

            {/* Male Child 7-14 Years Row */}
            <TableRow sx={{  }}>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  color: '#333',
                  // borderRight: '1px solid #e0e0e0',
                  // textAlign: 'center',
                  py: 0.5,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0, fontSize: '0.85rem' }}>
                    Male Child (7-14 Years)
                  </Typography>
                  <Typography variant="caption" color="default" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    ₹100 
                  </Typography>
                </Box>
              </TableCell>
              <TableCell 
                sx={{ 
                  textAlign: 'center',
                  py: 0.5,
                }}
              >
                {renderInputField('maleChild', maleChild, '#A3A5DC')}
              </TableCell>
            </TableRow>

            {/* Female Child 7-14 Years Row */}
            <TableRow sx={{  }}>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  color: '#333',
                  // borderRight: '1px solid #e0e0e0',
                  // textAlign: 'center',
                  py: 0.5,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0, fontSize: '0.85rem' }}>
                    Female Child (7-14 Years)
                  </Typography>
                  <Typography variant="caption" color="default" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    ₹100 
                  </Typography>
                </Box>
              </TableCell>
              <TableCell 
                sx={{ 
                  // textAlign: 'center',
                  py: 0.5,
                }}
              >
                {renderInputField('femaleChild', femaleChild, '#A3A5DC')}
              </TableCell>
            </TableRow>

            {/* Female 14+ Years Row */}
            <TableRow sx={{  }}>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  color: '#333',
                  // borderRight: '1px solid #e0e0e0',
                  // textAlign: 'center',
                  py: 0.5,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0, fontSize: '0.85rem' }}>
                    Female (14+ Years)
                  </Typography>
                  <Typography variant="caption" color="default" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    ₹200 
                  </Typography>
                </Box>
              </TableCell>
              <TableCell 
                sx={{ 
                  // textAlign: 'center',
                  py: 0.5,
                }}
              >
                {renderInputField('extraFemale', extraFemale, '#A3A5DC')}
              </TableCell>
            </TableRow>

            {/* Total Row */}
            {/* <TableRow sx={{ borderTop: '1px solid #ddd' }}>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  color: '#333',
                  py: 0.3
                }}
              >
                Total
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  color: '#2e7d32',
                  py: 0.3
                }}
              >
                {under + maleChild + femaleChild + extraFemale}
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MemberTable;