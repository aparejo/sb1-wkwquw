import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, Settings, DollarSign, Megaphone, Store } from 'lucide-react';
import { useStoreStore } from '../../features/store/stores/storeStore';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const getModuleStatus = useStoreStore(state => state.getModuleStatus);

  const navigation = [
    { name: 'Inicio', href: '/app', icon: Home },
    { name: 'Tienda', href: '/app/store', icon: Store },
    { name: 'Inventario', href: '/app/inventory', icon: Package },
    { name: 'Punto de Venta', href: '/app/pos', icon: ShoppingCart },
    { name: 'Contabilidad', href: '/app/accounting', icon: DollarSign },
    { name: 'Marketing', href: '/app/marketing', icon: Megaphone },
    { name: 'Configuración', href: '/app/settings', icon: Settings }
  ].filter(item => {
    // Always show Home, Store, Inventory, POS and Settings
    if (['/app', '/app/store', '/app/inventory', '/app/pos', '/app/settings'].includes(item.href)) {
      return true;
    }
    // Show other modules only if they are active
    const moduleId = item.href.replace('/app/', ''); // Remove leading /app/
    return getModuleStatus(moduleId) !== 'inactive';
  });

  return (
    <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 pt-5 pb-4 overflow-y-auto">
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon
                className={`mr-3 h-6 w-6 ${
                  isActive ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}