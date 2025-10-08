import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import QRAttendance from 'src/sections/revival-camp/partner/QRAttendance';
import QREntry from 'src/sections/revival-camp/partner/QREntry';

export const metadata: Metadata = { title: `Check QR - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      {/* check attendance */}
      <QRAttendance />
    </DashboardContent>
  );
}
