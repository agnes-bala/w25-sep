import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import Custom from 'src/sections/revival-camp/reports/CustomReport';

export const metadata: Metadata = { title: `Custom Report - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <Custom />
    </DashboardContent>
  );
}
