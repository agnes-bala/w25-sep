import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import ApproveSettlement from 'src/sections/revival-camp/reports/ApproveSettlement';

export const metadata: Metadata = { title: `Approve Settlement - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <ApproveSettlement />
    </DashboardContent>
  );
}
