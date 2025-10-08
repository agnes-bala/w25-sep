import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import AmountReport from 'src/sections/revival-camp/reports/AmountReport';

export const metadata: Metadata = { title: `Amount Report - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <AmountReport />
    </DashboardContent>
  );
}
