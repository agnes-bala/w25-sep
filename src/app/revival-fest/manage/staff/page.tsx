import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import ManageStaff from 'src/sections/revival-camp/manage/ManageStaff';

export const metadata: Metadata = { title: `Staff Management - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <ManageStaff />
    </DashboardContent>
  );
}
