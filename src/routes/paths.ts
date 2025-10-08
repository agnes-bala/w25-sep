
// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  // REVIVAL_FEST: '/revival-fest', // Added root for revival-fest routes
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',

  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,

    // Revival Fest - Partner Management
    // revivalFest: {
    //   partner: {
    //     root: `/revival-fest/partner`, // Added root for partner routes
    //     // root: `${ROOTS.REVIVAL_FEST}/partner/check-in`,
    //     checkIn: `/revival-fest/partner/check-in`,
    //     new: `/revival-fest/partner/new-partner`,
    //     bind: `/revival-fest/partner/bind-qr`,
    //     search: `/revival-fest/partner/search`,
    //     addFood: `/revival-fest/partner/add-food`,
    //     addSettlements: `/revival-fest/partner/add-settlements`,
    //     checkQR: `/revival-fest/partner/check-qr`,
    //     checkAttendance: `/revival-fest/partner/check-attendance`,
    //     singleEntry: `/revival-fest/partner/single-entry`,
    //     admin: `/revival-fest/partner/admin`,
    //     foodEdit: `/revival-fest/partner/food-edit`, // Changed to kebab-case
    //     addC: `/revival-fest/partner/add-c`,
    //     addWomen: `/revival-fest/partner/newAdd`, // Added new route for
    //   },
    //   // reports: {
    //   //   root: `/revival-fest/reports`, // Added root for reports routes
    //   //   // root: `revival-fest/reports/my-entries`,
    //   //   myEntries: `/revival-fest/reports/my-entries`,
    //   //   overall: `/revival-fest/reports/overall-reports`,
    //   //   amount: `/revival-fest/reports/amount-report`,
    //   //   settlements: `/revival-fest/reports/settlements-report`,
    //   //   location: `/revival-fest/reports/location-based-report`,
    //   //   log: `/revival-fest/reports/log-viewer`,
    //   //   kids: `/revival-fest/reports/kids-report`,
    //   //   custom: `/revival-fest/reports/custom-report`,
    //   //   check: `/revival-fest/reports/check-report`,
    //   // },
    //   // manage: {
    //   //   root: `/revival-fest/manage`,
    //   //   staff: `/revival-fest/manage/staff`,
    //   //   smsUsers: `/revival-fest/manage/sms-users`,
    //   //   send: `/revival-fest/manage/send-sms`,
    //   // },
    // },
  },

  revivalFest: {
    root: `/revival-fest`,
    partner: {
      root: `/revival-fest/partner`, // Added root for partner routes
      // root: `${ROOTS.REVIVAL_FEST}/partner/check-in`,
      addWomen: `/revival-fest/partner/newAdd`,
      checkIn: `/revival-fest/partner/check-in`,
      new: `/revival-fest/partner/new-partner`,
      bind: `/revival-fest/partner/bind-qr`,
      search: `/revival-fest/partner/search`,
      addFood: `/revival-fest/partner/add-food`,
      addSettlements: `/revival-fest/partner/add-settlements`,
      checkQR: `/revival-fest/partner/check-qr`,
      checkAttendance: `/revival-fest/partner/check-attendance`,
      singleEntry: `/revival-fest/partner/single-entry`,
      admin: `/revival-fest/partner/admin`,
      foodEdit: `/revival-fest/partner/food-edit`, // Changed to kebab-case
      addC: `/revival-fest/partner/add-c`,
      childSearch: `/revival-fest/partner/child-search`,
      // Added new route for
    },
    reports: {
      root: `/revival-fest/reports`, // Added root for reports routes
      // root: `revival-fest/reports/my-entries`,
      myEntries: `/revival-fest/reports/my-entries`,
      overall: `/revival-fest/reports/overall-reports`,
      amount: `/revival-fest/reports/amount-report`,
      settlements: `/revival-fest/reports/settlements-report`,
      location: `/revival-fest/reports/location-based-report`,
      log: `/revival-fest/reports/log-viewer`,
      kids: `/revival-fest/reports/kids-report`,
      custom: `/revival-fest/reports/custom-report`,
      check: `/revival-fest/reports/check-report`,
    },
    manage: {
      root: `/revival-fest/manage`,
      staff: `/revival-fest/manage/staff`,
      smsUsers: `/revival-fest/manage/sms-users`,
      send: `/revival-fest/manage/send-sms`,
    },
  },

};

