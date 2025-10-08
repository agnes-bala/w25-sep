import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import LocationBasedReport from 'src/sections/revival-camp/reports/LocationBased';

export const metadata: Metadata = { title: `Location Based Report - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <LocationBasedReport />
    </DashboardContent>
  );
}
