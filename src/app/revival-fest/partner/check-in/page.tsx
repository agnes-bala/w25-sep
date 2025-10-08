import type { Metadata } from 'next';

import { getCountries, getDistricts, getStates } from 'src/utils/helpers';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import CheckIn from 'src/sections/revival-camp/partner/CheckIn';
import PartnerDetails from 'src/sections/revival-camp/partner/PartnerDetails';

export const metadata: Metadata = { title: `Check In - ${CONFIG.appName}` };

export default async function page() {
  const [countries, states, districts] = await Promise.all([
    getCountries(),
    getStates('India'),
    getDistricts('India', 'Andhra Pradesh'),
  ]);
  return (
    <DashboardContent>

      <PartnerDetails countries={countries} states={states} districts={districts} />
    </DashboardContent>
  );
}