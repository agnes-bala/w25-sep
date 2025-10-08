import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import MyEntries from 'src/sections/revival-camp/reports/MyEntries';

export const metadata: Metadata = { title: `My Entries - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <MyEntries />
    </DashboardContent>
  );
}
