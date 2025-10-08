import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import LogView from 'src/sections/revival-camp/reports/LogView';

export const metadata: Metadata = { title: `Log Viewer - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <LogView />
    </DashboardContent>
  );
}
