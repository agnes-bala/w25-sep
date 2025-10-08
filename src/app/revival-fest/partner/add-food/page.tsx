import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import AddFoodEntry from 'src/sections/revival-camp/partner/AddFoodEntry';

export const metadata: Metadata = { title: `Add Food Entry - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <AddFoodEntry />
    </DashboardContent>
  );
}
