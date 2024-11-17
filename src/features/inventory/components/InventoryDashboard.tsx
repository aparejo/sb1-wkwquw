import React from 'react';
import { Package, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { useInventoryStore } from '../stores/inventoryStore';
import { ProductList } from './ProductList';
import { CategoryManager } from './CategoryManager';
import { WarehouseManager } from './WarehouseManager';
import { InventoryActions } from './InventoryActions';

export function InventoryDashboard() {
  const { products, warehouses, selectedWarehouse } = useInventoryStore();

  const lowStockProducts = products.filter(product => {
    const warehouseStock = product.stock[selectedWarehouse || 'default'];
    if (!warehouseStock) return false;
    const baseUnitStock = warehouseStock[product.baseUnit.id] || 0;
    return baseUnitStock <= product.minStock;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Inventario</h1>
        <InventoryActions />
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Productos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {products.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowLeftRight className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Almacenes Activos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {warehouses.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Productos Bajo Stock
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {lowStockProducts.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductList />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <CategoryManager />
          <WarehouseManager />
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Alertas de Stock Bajo
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {lowStockProducts.map((product) => (
                <li key={product.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {product.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Stock: {product.stock[selectedWarehouse || 'default']?.[product.baseUnit.id] || 0}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        Mínimo: {product.minStock}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}