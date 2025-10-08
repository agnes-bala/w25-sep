import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import KidsReport from 'src/sections/revival-camp/reports/KidsReport';

export const metadata: Metadata = { title: `Kids Report - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <KidsReport />
    </DashboardContent>
  );
}
