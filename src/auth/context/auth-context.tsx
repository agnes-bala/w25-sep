// 'use client';

// import { createContext } from 'react';

// import type { AuthContextValue } from '../types';

// // ----------------------------------------------------------------------

// export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

'use client';

import { createContext } from 'react';

import type { AuthContextValue } from '../types';

// ----------------------------------------------------------------------

// export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  authenticated: false,
  unauthenticated: true,
  checkUserSession: async () => { },
  setState: () => { }, // ✅ Provide a default no-op function
});
