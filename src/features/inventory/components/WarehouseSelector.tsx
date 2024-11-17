import React from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { Building2 } from 'lucide-react';

export function WarehouseSelector() {
  const { warehouses, selectedWarehouse, setSelectedWarehouse } = useInventoryStore();

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Almacenes</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse) => (
          <button
            key={warehouse.id}
            onClick={() => setSelectedWarehouse(warehouse.id)}
            className={`p-4 rounded-lg border ${
              selectedWarehouse === warehouse.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-medium text-gray-900">{warehouse.name}</div>
            <div className="text-sm text-gray-500">{warehouse.location}</div>
            {warehouse.isDefault && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Principal
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}