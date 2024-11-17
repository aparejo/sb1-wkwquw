import React, { useState } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { getWarehouseHierarchy } from '../utils/warehouseUtils';
import { Building2, Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { Warehouse } from '../types';

interface WarehouseFormData {
  name: string;
  type: 'store' | 'warehouse';
  location: string;
  parentId?: string | null;
}

export function WarehouseManager() {
  const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse } = useInventoryStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: '',
    type: 'warehouse',
    location: '',
    parentId: null
  });

  const hierarchy = getWarehouseHierarchy(warehouses);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const warehouseData = {
      ...formData,
      id: editingWarehouse?.id || crypto.randomUUID(),
      isDefault: false,
      createdAt: editingWarehouse?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, warehouseData);
    } else {
      addWarehouse(warehouseData as Warehouse);
    }

    setIsFormOpen(false);
    setEditingWarehouse(null);
    setFormData({ name: '', type: 'warehouse', location: '', parentId: null });
  };

  const handleDelete = (warehouse: Warehouse) => {
    if (warehouse.isDefault) {
      alert('No se puede eliminar el almacén principal');
      return;
    }

    if (confirm('¿Está seguro de eliminar este almacén?')) {
      deleteWarehouse(warehouse.id);
    }
  };

  const renderWarehouseTree = (items: any[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {item.type === 'store' ? (
              <Building2 className="h-5 w-5 text-blue-500" />
            ) : (
              <Package className="h-5 w-5 text-gray-500" />
            )}
            <span className="text-sm font-medium">
              {item.name}
              <span className="text-gray-500 text-xs ml-2">({item.location})</span>
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingWarehouse(item);
                setFormData({
                  name: item.name,
                  type: item.type,
                  location: item.location,
                  parentId: item.parentId
                });
                setIsFormOpen(true);
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-1 text-gray-400 hover:text-red-600"
              disabled={item.isDefault}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {item.children && renderWarehouseTree(item.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Gestión de Almacenes</h2>
        <button
          onClick={() => {
            setEditingWarehouse(null);
            setFormData({ name: '', type: 'warehouse', location: '', parentId: null });
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo Almacén
        </button>
      </div>

      <div className="space-y-2">
        {renderWarehouseTree(hierarchy)}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">
              {editingWarehouse ? 'Editar Almacén' : 'Nuevo Almacén'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'store' | 'warehouse' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="store">Tienda</option>
                  <option value="warehouse">Almacén</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pertenece a</label>
                <select
                  value={formData.parentId || ''}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Ninguno</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id} disabled={w.id === editingWarehouse?.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingWarehouse(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  {editingWarehouse ? 'Guardar Cambios' : 'Crear Almacén'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}