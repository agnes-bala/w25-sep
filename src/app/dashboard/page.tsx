// 'use client';

// import axios from 'axios';
// import { useEffect, useState } from 'react';

// import { Grid2 } from '@mui/material';

// import { config } from 'src/constants/helpers';

// import DashboardStats from 'src/sections/blank/summary';
// import { BlankView } from 'src/sections/blank/view';
// import MyFoodEntries from 'src/sections/revival-camp/dashboard/MyFoodEntries';
// import Recents from 'src/sections/revival-camp/partner/Recents';

// import { useAuthContext } from 'src/auth/hooks';

// type DashboardData = {
//   totalAmountByToday: number;
//   totalSettlementMeToday: number;
//   TotalLunchCount: number;
//   TodayFoodEntriesTotal: number;
//   Stayer: number;
//   totalUpiByMeToday: number;
//   TodayDinnerCount: number;
//   maleCount: number;
//   totalCash: number;
//   totalUpiByToday: number;
//   childMale: number;
//   TotalDinnerCount: number;
//   totalSettlementByMe: number;
//   totalDiscountByToday: number;
//   TotalFemale: number;
//   totalUpi: number;
//   Outsider: number;
//   OutsiderChildren: number;
//   TomorrowFoodEntriesTotal: number;
//   TotalFoodCount: number;
//   TodayDinnerByMe: number;
//   totalCashByMeToday: number;
//   totalCashByMe: number;
//   totalDiscountByMeToday: number;
//   StayerChildren: number;
//   totalSettlementByToday: number;
//   totalUpiByMe: number;
//   totalDiscountByMe: number;
//   totalAmount: number;
//   totalAmountByMeToday: number;
//   totalCashByToday: number;
//   TodayLunchByMe: number;
//   childFemale: number;
//   totalSettlement: number;
//   totalAmountByMe: number;
//   totalDiscount: number;
//   TomorrowDinnerCount: number;
//   TomorrowLunchCount: number;
//   TodayFoodEntriesByMe: number;
//   TodayLunchCount: number;
//   totalCount: number;
//   childCount: number;
//   totalInfant: number;
//   totalFemale: number;
//   totalMale: number;
// };

// export default function Page() {
//   const [data, setData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuthContext();
//   const createdBy = user?.name;
//   // const createdBy = user?.name;
//   const userName = user?.name; //

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await axios.get<DashboardData>(
//           `${config.BASE_URL}/count?createdBy=${createdBy}`
//         );
//         setData(response.data);
//       } catch (error) {
//         console.error('Failed to fetch dashboard data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [createdBy]);

//   if (loading) return <BlankView title="Loading..." />;
//   if (!data) return <BlankView title="No Data Found" />;

//   const visibleStats = [

//     { label: "Total Male", value: data.maleCount },
//     { label: "Total Female", value: data.TotalFemale },
//     { label: "Total Child", value: data.childCount },
//     { label: "Total", value: data.totalCount },
//     { label: "Total Amount Today", value: `₹${data.totalAmountByToday}` },
//     { label: "Total Cash Today", value: `₹${data.totalCashByToday}` },
//     { label: "Total UPI Today", value: `₹${data.totalUpiByToday}` },

//   ];

//   return (
//     <>
//       <DashboardStats data={visibleStats} />
//       <Grid2 container>
//         <Grid2 size={{ xs: 12, md: 12 }} sx={{ px: 3 }}>
//           <Recents />
//         </Grid2>
//         {/* <Grid2 size={{ xs: 12, md: 12 }} sx={{ px: 3, mt: 3 }}> */}
//         {/* <MyFoodEntries /> */}
//         {/* </Grid2> */}
//       </Grid2>
//     </>
//   )
// }
'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import { Grid2 } from '@mui/material';

import { config } from 'src/constants/helpers';

import DashboardStats from 'src/sections/blank/summary';
import { BlankView } from 'src/sections/blank/view';
import Recents from 'src/sections/revival-camp/partner/Recents';

import { useAuthContext } from 'src/auth/hooks';
import { CONFIG } from 'src/global-config';

type DashboardData = {
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

 

export default function Page() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const createdBy = user?.name;
  const userName = user?.name;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get<DashboardData>(
          `${config.BASE_URL}/count?createdBy=${createdBy}`
        );
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [createdBy]);

  if (loading) return <BlankView title="Loading..." />;
  if (!data) return <BlankView title="No Data Found" />;

  // Prepare data for the new DashboardStats component
  const dashboardData = {
    totalEntries: data.totalEntries,
    maleCount: data.maleCount,
    femaleCount: data.femaleCount,
    maleChild: data.maleChild,
    femaleChild: data.femaleChild,
    under7: data.under7,
    overallUpi: data.overallUpi,
    overallCash: data.overallCash,
    totalAmount: data.totalAmount,
    todayUpi: data.todayUpi,
    todayCash: data.todayCash,
    todayTotal: data.todayTotal
  };

  return (
    <>
      {/* Pass the raw data object to DashboardStats */}
      <DashboardStats data={dashboardData} />
      
      <Grid2 container>
        <Grid2 size={{ xs: 12, md: 12 }} sx={{ px: 3 }}>
          <Recents />
        </Grid2>
        {/* <Grid2 size={{ xs: 12, md: 12 }} sx={{ px: 3, mt: 3 }}> */}
        {/* <MyFoodEntries /> */}
        {/* </Grid2> */}
      </Grid2>
    </>
  );
}