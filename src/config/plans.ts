export const PLANS = {
  free: {
    id: 'free',
    name: 'Plan Gratuito',
    price: 0,
    billingCycle: 'monthly',
    features: {
      users: 1,
      stores: 1,
      warehouses: 1,
      products: 100,
      modules: ['inventory', 'pos']
    },
    limits: {
      dailyTransactions: 50,
      monthlyTransactions: 1000,
      storage: '100MB'
    }
  },
  business: {
    id: 'business',
    name: 'Plan Comercial',
    price: 25,
    billingCycle: 'monthly',
    features: {
      users: 10,
      stores: 3,
      warehouses: 'unlimited',
      products: 5000,
      modules: ['inventory', 'pos', 'accounting', 'marketing']
    },
    limits: {
      dailyTransactions: 500,
      monthlyTransactions: 10000,
      storage: '1GB'
    }
  },
  professional: {
    id: 'professional',
    name: 'Plan Profesional',
    price: 49,
    billingCycle: 'monthly',
    features: {
      users: 25,
      stores: 10,
      warehouses: 'unlimited',
      products: 20000,
      modules: [
        'inventory',
        'pos',
        'accounting',
        'marketing',
        'hr',
        'logistics',
        'tasks'
      ]
    },
    limits: {
      dailyTransactions: 2000,
      monthlyTransactions: 50000,
      storage: '5GB'
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Plan Empresarial',
    price: 99,
    billingCycle: 'monthly',
    features: {
      users: 'unlimited',
      stores: 'unlimited',
      warehouses: 'unlimited',
      products: 'unlimited',
      modules: 'all'
    },
    limits: {
      dailyTransactions: 'unlimited',
      monthlyTransactions: 'unlimited',
      storage: '20GB'
    }
  }
};