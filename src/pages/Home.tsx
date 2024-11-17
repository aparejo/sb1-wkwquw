import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreStore } from '../features/store/stores/storeStore';
import { Store, Package, ShoppingCart, DollarSign, Megaphone } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const getModuleStatus = useStoreStore(state => state.getModuleStatus);

  const modules = [
    {
      id: 'store',
      name: 'Tienda',
      description: 'Activar módulos adicionales',
      icon: Store,
      route: '/app/store'
    },
    {
      id: 'inventory',
      name: 'Inventario y POS',
      description: 'Gestión de inventario y punto de venta',
      icon: Package,
      route: '/app/inventory'
    },
    {
      id: 'pos',
      name: 'Punto de Venta',
      description: 'Sistema de ventas y facturación',
      icon: ShoppingCart,
      route: '/app/pos'
    },
    {
      id: 'accounting',
      name: 'Contabilidad',
      description: 'Sistema contable completo',
      icon: DollarSign,
      route: '/app/accounting'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Gestión de promociones y campañas',
      icon: Megaphone,
      route: '/app/marketing'
    }
  ];

  // Filter only active modules and store
  const activeModules = modules.filter(module => 
    module.id === 'store' || getModuleStatus(module.id) !== 'inactive'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Panel de Control
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeModules.map((module) => {
          const Icon = module.icon;
          const isStore = module.id === 'store';
          
          return (
            <div
              key={module.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => navigate(module.route)}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    isStore 
                      ? 'bg-purple-100 dark:bg-purple-900' 
                      : 'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    <Icon className={`h-8 w-8 ${
                      isStore 
                        ? 'text-purple-600 dark:text-purple-300'
                        : 'text-blue-600 dark:text-blue-300'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {module.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {module.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}