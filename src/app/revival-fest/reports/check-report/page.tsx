import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import CheckReport from 'src/sections/revival-camp/reports/CheckReport';

export const metadata: Metadata = { title: `Check Report - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <CheckReport />
    </DashboardContent>
  );
}
