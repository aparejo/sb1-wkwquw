import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Module, License, Payment } from '../types';

type ModuleStatus = 'free' | 'paid' | 'trial' | 'inactive';

interface StoreState {
  modules: Module[];
  licenses: License[];
  payments: Payment[];
  
  addLicense: (license: License) => void;
  updateLicense: (id: string, license: Partial<License>) => void;
  
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  
  getModuleStatus: (moduleId: string) => ModuleStatus;
  startTrial: (moduleId: string) => void;
}

const initialModules: Module[] = [
  {
    id: 'store',
    name: 'Tienda',
    description: 'Activar módulos adicionales',
    icon: 'Store',
    price: 0,
    status: 'free',
    features: ['Gestión de módulos', 'Activación de funcionalidades'],
    route: '/app/store'
  },
  {
    id: 'inventory',
    name: 'Inventario y POS',
    description: 'Gestión completa de inventario y punto de venta',
    icon: 'Package',
    price: 0,
    status: 'free',
    features: [
      'Control de inventario',
      'Punto de venta (POS)',
      'Gestión de productos',
      'Reportes básicos'
    ],
    route: '/app/inventory'
  },
  {
    id: 'accounting',
    name: 'Contabilidad',
    description: 'Sistema contable completo',
    icon: 'DollarSign',
    price: 35,
    status: 'inactive',
    features: ['Plan de cuentas', 'Libro diario', 'Estados financieros'],
    route: '/app/accounting'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Gestión de promociones y campañas',
    icon: 'Megaphone',
    price: 65,
    status: 'inactive',
    features: [
      'Gestión de promociones',
      'Campañas de email',
      'Reglas de precios',
      'Análisis de conversión'
    ],
    route: '/app/marketing'
  }
];

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      modules: initialModules,
      licenses: [],
      payments: [],

      addLicense: (license) =>
        set((state) => ({ licenses: [...state.licenses, license] })),

      updateLicense: (id, updates) =>
        set((state) => ({
          licenses: state.licenses.map(l =>
            l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
          )
        })),

      addPayment: (payment) =>
        set((state) => ({ payments: [...state.payments, payment] })),

      updatePayment: (id, updates) =>
        set((state) => ({
          payments: state.payments.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          )
        })),

      getModuleStatus: (moduleId) => {
        if (moduleId === 'store' || moduleId === 'inventory') return 'free';
        
        const { licenses } = get();
        const license = licenses.find(l => 
          l.moduleId === moduleId && 
          l.status === 'active' &&
          (!l.expirationDate || new Date(l.expirationDate) > new Date())
        );

        if (!license) return 'inactive';
        return license.paymentId === 'trial' ? 'trial' : 'paid';
      },

      startTrial: (moduleId) => {
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        const license: License = {
          id: crypto.randomUUID(),
          moduleId,
          userId: 'current-user-id',
          paymentId: 'trial',
          status: 'active',
          activationDate: new Date().toISOString(),
          expirationDate: expirationDate.toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        get().addLicense(license);
      }
    }),
    {
      name: 'store-storage'
    }
  )
);