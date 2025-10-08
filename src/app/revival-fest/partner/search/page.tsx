import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
// import Search from 'src/sections/revival-camp/partner/Search';
import { getCountries, getDistricts, getStates } from 'src/utils/helpers';

export const metadata: Metadata = { title: `Search Partners - ${CONFIG.appName}` };

const [states, districts, countries] = await Promise.all([
  getCountries(),
  getStates('India'),
  getDistricts('India', 'Tamil Nadu'),
]);

export default async function page() {
  return (
    <DashboardContent>
      {/* <Search districts={districts} states={states} countries={countries} /> */}
    </DashboardContent>
  );
}
