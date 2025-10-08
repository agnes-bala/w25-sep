import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import AddSettlements from 'src/sections/revival-camp/partner/AddSettlements';
import AdminDetails from 'src/sections/revival-camp/partner/AdminEdit';
import { getCountries, getDistricts, getStates } from 'src/utils/helpers';

export const metadata: Metadata = { title: `Admin Edit - ${CONFIG.appName}` };

export default async function page() {
  const [countries, states, districts] = await Promise.all([
    getCountries(),
    getStates('India'),
    getDistricts('India', 'Tamil Nadu'),
  ]);
  return (
    <DashboardContent>
      <AdminDetails countries={countries} states={states} districts={districts} />
    </DashboardContent>
  );
}
