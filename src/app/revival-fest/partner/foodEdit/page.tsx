import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import FoodDetails from 'src/sections/revival-camp/partner/FoodEdit';


export const metadata: Metadata = { title: `Edit Food - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <FoodDetails />
    </DashboardContent>
  );
}
