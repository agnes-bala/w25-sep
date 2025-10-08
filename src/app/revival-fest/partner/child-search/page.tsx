import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
// import AttendanceSearchPage from 'src/sections/revival-camp/partner/AttendanceSearchPage';
import QRAttendance from 'src/sections/revival-camp/partner/QRAttendance';
import QREntry from 'src/sections/revival-camp/partner/QREntry';

export const metadata: Metadata = { title: `Child Check - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      {/* <QREntry /> */}
      {/* <AttendanceSearchPage /> */}
    </DashboardContent>
  );
}
