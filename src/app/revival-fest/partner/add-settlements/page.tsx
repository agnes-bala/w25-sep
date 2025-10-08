import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import AddSettlements from 'src/sections/revival-camp/partner/AddSettlements';

export const metadata: Metadata = { title: `Add Settlements- ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <AddSettlements />
    </DashboardContent>
  );
}
