
import type { NavSectionProps } from 'src/components/nav-section';
import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  reports: icon('ic-documents'),
  settings: icon('ic-settings'),
};

// ----------------------------------------------------------------------

const getCheckInItems = (role?: string) => {
  const baseItems = [
    { title: 'Add New', path: paths.revivalFest.partner.addWomen },
    // { title: 'Search', path: paths.revivalFest.partner.checkIn },
    { title: 'Add Settlements', path: paths.revivalFest.partner.addSettlements },
    // { title: 'Child Search', path: paths.revivalFest.partner.childSearch },



    // { title: "C-Add", path: paths.dashboard.mayCamp.addC },
  ];

  const adminItems = [
    { title: 'Admin Edit', path: paths.revivalFest.partner.admin },

  ];

  switch (role) {
    case 'Admin':
      return [...baseItems, ...adminItems];
    case 'Staff':
      return [...baseItems,
        // { title: 'Check-in', path: paths.dashboard.mayCamp.root },
        // { title: 'Add New Pastor', path: paths.dashboard.mayCamp.new },
      ];
    case 'Volunteer':
      return [...baseItems];
    default:
      return baseItems;
  }
};

const getReportItems = (role?: string) => {
  const baseItems = [
    // { title: 'My Entries Report', path: paths.dashboard.reports.root },

    { title: 'Check Report', path: paths.revivalFest.reports.check },
    { title: 'All Report', path: paths.revivalFest.reports.overall },

    { title: 'Amount Report', path: paths.revivalFest.reports.amount },
  ];

  const adminItems = [
    // { title: 'All Report', path: paths.dashboard.reports.overall },
    { title: 'Location Based Report', path: paths.revivalFest.reports.location },
    { title: 'Custom Report', path: paths.revivalFest.reports.custom },
    { title: 'Settlements', path: paths.revivalFest.reports.settlements },
  ];

  switch (role) {
    case 'Admin':
      return [...baseItems, ...adminItems];
    case 'Staff':
      return [...baseItems];
    default:
      return baseItems;
  }
};

export const getNavData = (role?: string): NavSectionProps['data'] => {
  const isAdmin = role === 'Admin';

  return [
    {
      subheader: 'Overview',
      items: [
        {
          title: 'Dashboard',
          path: paths.dashboard.root,
          icon: ICONS.dashboard,
        },
      ],
    },
    {
      subheader: 'Check in',
      items: [
        {
          title: 'Partners',
          path: paths.revivalFest.partner.root,
          icon: ICONS.user,
          children: getCheckInItems(role),
        },
      ],
    },
    {
      subheader: 'Reports',
      items: [
        {
          title: 'Reports',
          path: paths.revivalFest.reports.root,
          icon: ICONS.reports,
          children: getReportItems(role),
        },
      ],
    },
    ...(isAdmin
      ? [
        {
          subheader: 'Manage',
          items: [
            {
              title: 'Manage',
              path: paths.revivalFest.manage.root,
              icon: ICONS.settings,
              children: [
                { title: 'Staff', path: paths.revivalFest.manage.staff },
                { title: 'SMS Users', path: paths.revivalFest.manage.smsUsers },
                { title: 'Send SMS', path: paths.revivalFest.manage.send },
              ],
            },
          ],
        },
      ]
      : []),
  ];
};

export const roleOptions = [
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Staff', label: 'Staff' },
  { value: 'Admin', label: 'Admin' },
];

