import React, { useState } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { useMovementStore } from '../stores/movementStore';
import { Product, StockMovement } from '../types';
import { X, Save, Package, ArrowRight } from 'lucide-react';

interface StockMovementFormProps {
  type: 'purchase' | 'transfer_warehouse' | 'transfer_store';
  onClose: () => void;
}

export function StockMovementForm({ type, onClose }: StockMovementFormProps) {
  const { products, warehouses } = useInventoryStore();
  const { addMovement } = useMovementStore();
  const [formData, setFormData] = useState({
    productId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    documentRef: '',
    notes: '',
    items: [{ unitId: '', quantity: 1 }]
  });

  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const movement: StockMovement = {
      id: crypto.randomUUID(),
      type,
      date: new Date().toISOString(),
      productId: formData.productId,
      fromWarehouseId: type === 'purchase' ? undefined : formData.fromWarehouseId,
      toWarehouseId: formData.toWarehouseId,
      documentRef: formData.documentRef,
      notes: formData.notes,
      items: formData.items,
      status: 'completed',
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addMovement(movement);
    onClose();
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { unitId: '', quantity: 1 }]
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {type === 'purchase' && 'Entrada por Compra'}
            {type === 'transfer_warehouse' && 'Transferencia entre Depósitos'}
            {type === 'transfer_store' && 'Transferencia entre Tiendas'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Producto
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            {type !== 'purchase' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Desde
                </label>
                <select
                  value={formData.fromWarehouseId}
                  onChange={(e) => setFormData({ ...formData, fromWarehouseId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione origen</option>
                  {warehouses
                    .filter(w => type === 'transfer_warehouse' ? w.type === 'warehouse' : w.type === 'store')
                    .map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {type === 'purchase' ? 'Almacén Destino' : 'Hacia'}
              </label>
              <select
                value={formData.toWarehouseId}
                onChange={(e) => setFormData({ ...formData, toWarehouseId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione destino</option>
                {warehouses
                  .filter(w => type === 'transfer_warehouse' ? w.type === 'warehouse' : w.type === 'store')
                  .map((warehouse) => (
                    <option 
                      key={warehouse.id} 
                      value={warehouse.id}
                      disabled={warehouse.id === formData.fromWarehouseId}
                    >
                      {warehouse.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referencia
              </label>
              <input
                type="text"
                value={formData.documentRef}
                onChange={(e) => setFormData({ ...formData, documentRef: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={type === 'purchase' ? 'Número de factura' : 'Referencia del movimiento'}
              />
            </div>
          </div>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Cantidades</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  Agregar Unidad
                </button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Unidad
                    </label>
                    <select
                      value={item.unitId}
                      onChange={(e) => updateItem(index, 'unitId', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccione unidad</option>
                      <option value={selectedProduct.baseUnit.id}>
                        {selectedProduct.baseUnit.name}
                      </option>
                      {selectedProduct.units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-6 text-red-600 hover:text-red-900"
                    disabled={formData.items.length === 1}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Guardar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}