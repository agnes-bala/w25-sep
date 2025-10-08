import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import OverallReports from 'src/sections/revival-camp/reports/OveralReports';

export const metadata: Metadata = { title: `Overall Report - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <OverallReports />
    </DashboardContent>
  );
}
