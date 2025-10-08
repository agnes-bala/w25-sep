import type { Metadata } from 'next';

import { getCountries, getDistricts, getStates } from 'src/utils/helpers';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import AddNew from 'src/sections/revival-camp/partner/AddNew';

export const metadata: Metadata = { title: `Add New Visitor - ${CONFIG.appName}` };

export default async function page() {
  const [countries, states, districts] = await Promise.all([
    getCountries(),
    getStates('India'),
    getDistricts('India', 'Tamil Nadu'),
  ]);
  return (
    <DashboardContent>
      <AddNew countries={countries} states={states} districts={districts} />
    </DashboardContent>
  );
}