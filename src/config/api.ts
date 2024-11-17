export const API_CONFIG = {
  baseUrl: process.env.API_URL || 'https://api.axiloop.com',
  version: 'v1',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      verify: '/auth/verify',
      reset: '/auth/reset-password'
    },
    admin: {
      tenants: '/admin/tenants',
      subscriptions: '/admin/subscriptions',
      payments: '/admin/payments',
      stats: '/admin/stats'
    },
    tenant: {
      profile: '/tenant/profile',
      users: '/tenant/users',
      modules: '/tenant/modules',
      billing: '/tenant/billing'
    }
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};