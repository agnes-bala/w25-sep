import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import ManageSMSUser from 'src/sections/revival-camp/manage/ManageSMSUser';

export const metadata: Metadata = { title: `SMS Users Management - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <ManageSMSUser />
    </DashboardContent>
  );
}
