import React from 'react';
import { useStoreStore } from '../stores/storeStore';
import { ModuleCard } from './ModuleCard';

export function StoreDashboard() {
  const modules = useStoreStore(state => state.modules);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tienda de Módulos
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
          />
        ))}
      </div>
    </div>
  );
}