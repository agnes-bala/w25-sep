import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import SendSms from 'src/sections/revival-camp/manage/SendSms';

export const metadata: Metadata = { title: `Send SMS - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <SendSms />
    </DashboardContent>
  );
}
