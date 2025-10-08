'use client';

import { Box, Card, Stack, Typography } from '@mui/material';

type StatCard = {
  label: string;
  value: string | number;
};

type Props = {
  data: {
    totalEntries: number;
    maleCount: number;
    femaleCount: number;
    maleChild: number;
    femaleChild: number;
    under7: number;
    overallUpi: number;
    overallCash: number;
    totalAmount: number;
    todayUpi: number;
    todayCash: number;
    todayTotal: number;
  };
};

// Function to format numbers in Indian rupees format
const formatRupees = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function DashboardStats({ data }: Props) {
  // Define the three sections
  const sections = [
    {
      title: 'Count Summary',
      cards: [
        { label: 'Female', value: data.femaleCount },
        { label: 'Child Male', value: data.maleChild },
        { label: 'Child Female', value: data.femaleChild },
        { label: 'Total', value: data.femaleCount + data.maleChild + data.femaleChild },
      ],
      color: '#cdc6ff'
    },
    {
      title: 'Amount Summary',
      cards: [
        { label: 'Overall Total', value: formatRupees(data.totalAmount) },
        { label: 'UPI', value: formatRupees(data.overallUpi) },
        { label: 'Cash', value: formatRupees(data.overallCash) },
      ],
      color: '#cdc6ff'
    },
    {
      title: "Today's Summary",
      cards: [
        { label: "Today's Total", value: formatRupees(data.todayTotal) },
        { label: "Today's UPI", value: formatRupees(data.todayUpi) },
        { label: "Today's Cash", value: formatRupees(data.todayCash) },
      ],
      color: '#cdc6ff'
    }
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 3,
        p: 3,
        borderRadius: 2,
      }}
    >
      {sections.map((section, sectionIndex) => (
        <Card
          key={sectionIndex}
          elevation={1}
          sx={{
            p: 2,
          }}
        >
          {/* Section Header */}
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              mb: 2, 
              textAlign: 'center',
              fontWeight: 600,
              color: 'text.primary',
              pb: 1
            }}
          >
            {section.title}
          </Typography>

          {/* Section Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
            }}
          >
            {section.cards.map((item, itemIndex) => (
              <Card
                key={itemIndex}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: 80,
                  bgcolor: section.color,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Stack spacing={1} alignItems="center">
                  <Typography 
                    variant="body2" 
                    color="black" 
                    fontWeight={600}
                    textAlign="center"
                  >
                    {item.label}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="black" 
                    fontWeight={700}
                    textAlign="center"
                  >
                    {item.value}
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Box>
        </Card>
      ))}
    </Box>
  );
}

// 'use client';

// import { Box, Card, Stack, Typography, Paper } from '@mui/material';

// type StatCard = {
//   label: string;
//   value: string | number;
// };

// type Props = {
//   data: {
//     totalEntries: number;
//     maleCount: number;
//     femaleCount: number;
//     maleChild: number;
//     femaleChild: number;
//     under7: number;
//     overallUpi: number;
//     overallCash: number;
//     totalAmount: number;
//     todayUpi: number;
//     todayCash: number;
//     todayTotal: number;
//   };
// };

// export default function DashboardStats({ data }: Props) {
//   // Define the three sections
//   const sections = [
//     {
//       title: 'Count Summary',
//       cards: [
//         { label: 'Female', value: data.femaleCount },
//         { label: 'Child Male', value: data.maleChild },
//         { label: 'Child Female', value: data.femaleChild },
//         { label: 'Total', value: data.femaleCount + data.maleChild + data.femaleChild },
//       ],
//       color: '#cdc6ff'
//     },
//     {
//       title: 'Amount Summary',
//       cards: [
//         { label: 'Overall Total', value: `₹${data.totalAmount.toFixed(2)}` },
//         { label: 'UPI', value: `₹${data.overallUpi.toFixed(2)}` },
//         { label: 'Cash', value: `₹${data.overallCash.toFixed(2)}` },
//       ],
//       color: '#cdc6ff'
//     },
//     {
//       title: "Today's Summary",
//       cards: [
//         { label: "Today's Total", value: `₹${data.todayTotal.toFixed(2)}` },
//         { label: "Today's UPI", value: `₹${data.todayUpi.toFixed(2)}` },
//         { label: "Today's Cash", value: `₹${data.todayCash.toFixed(2)}` },
//       ],
//       color: '#cdc6ff'
//     }
//   ];

//   return (
//     <Box
//       sx={{
//         display: 'grid',
//         gridTemplateColumns: {
//           xs: 'repeat(1, 1fr)',
//           sm: 'repeat(2, 1fr)',
//           md: 'repeat(3, 1fr)',
//         },
//         gap: 3,
//         p: 3,
//         // bgcolor: 'background.paper',
//         borderRadius: 2,
//       }}
//     >
//       {sections.map((section, sectionIndex) => (
//         <Card
//           key={sectionIndex}
//           elevation={1}
//           sx={{
//             p: 2,
//             // borderRadius: 3,
//             // border: (theme) => `2px solid ${theme.palette.divider}`,
//             // bgcolor: 'background.Card',
//           }}
//         >
//           {/* Section Header */}
//           <Typography 
//             variant="h6" 
//             component="h3" 
//             sx={{ 
//               mb: 2, 
//               textAlign: 'center',
//               fontWeight: 600,
//               color: 'text.primary',
//               // borderBottom: (theme) => `2px solid ${section.color}`,
//               pb: 1
//             }}
//           >
//             {section.title}
//           </Typography>

//           {/* Section Cards */}
//           <Box
//             sx={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(2, 1fr)',
//               gap: 2,
//             }}
//           >
//             {section.cards.map((item, itemIndex) => (
//               <Card
//                 key={itemIndex}
//                 sx={{
//                   p: 2,
//                   // boxShadow: 2,
//                   borderRadius: 2,
//                   display: 'flex',
//                   flexDirection: 'column',
//                   justifyContent: 'center',
//                   minHeight: 80,
//                   bgcolor: section.color,
//                   transition: 'transform 0.2s',
//                   '&:hover': {
//                     transform: 'translateY(-2px)',
//                     boxShadow: 4,
//                   },
//                 }}
//               >
//                 <Stack spacing={1} alignItems="center">
//                   <Typography 
//                     variant="body2" 
//                     color="black" 
//                     fontWeight={600}
//                     textAlign="center"
//                   >
//                     {item.label}
//                   </Typography>
//                   <Typography 
//                     variant="h6" 
//                     color="black" 
//                     fontWeight={700}
//                     textAlign="center"
//                   >
//                     {item.value}
//                   </Typography>
//                 </Stack>
//               </Card>
//             ))}
//           </Box>
//         </Card>
//       ))}
//     </Box>
//   );
// }