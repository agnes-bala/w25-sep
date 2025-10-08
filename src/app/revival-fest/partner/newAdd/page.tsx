import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import AddNewPage from 'src/sections/revival-camp/partner/NewAddPage';
import { getCountries, getDistricts, getStates } from 'src/utils/helpers';


export const metadata: Metadata = { title: `Add Page - ${CONFIG.appName}` };

export default async function page() {

  const [countries, states, districts] = await Promise.all([
    getCountries(),
    getStates('India'),
    getDistricts('India', 'Tamil Nadu'),
  ]);

  return (
    <DashboardContent>
      <AddNewPage countries={countries} states={states} districts={districts} />
    </DashboardContent>
  );
}
