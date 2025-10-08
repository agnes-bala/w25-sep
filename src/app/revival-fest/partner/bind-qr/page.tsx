import type { Metadata } from 'next';
import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import BindQR from 'src/sections/revival-camp/partner/BindQR';
import BindQREntry from 'src/sections/revival-camp/partner/BindQREntry';

export const metadata: Metadata = { title: `Bind QR - ${CONFIG.appName}` };

export default async function page() {
  return (
    <DashboardContent>
      <BindQR />
      {/* <BindQREntry /> */}
    </DashboardContent>
  );
}

// w.document.close();
// w.onafterprint = () => {
//   w.close();
//   setTimeout(() => resolve(), 500);
// };
// }, 100);