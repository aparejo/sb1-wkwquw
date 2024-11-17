import React, { useState } from 'react';
import { useMarketingStore } from '../stores/marketingStore';
import { useInventoryStore } from '../../inventory/stores/inventoryStore';
import { useCategoryStore } from '../../inventory/stores/categoryStore';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Promotion } from '../types';

interface PromotionFormProps {
  onClose: () => void;
  initialData?: Promotion;
}

export function PromotionForm({ onClose, initialData }: PromotionFormProps) {
  const { addPromotion, updatePromotion } = useMarketingStore();
  const { products } = useInventoryStore();
  const { categories } = useCategoryStore();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'discount',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    conditions: {
      minPurchase: initialData?.conditions.minPurchase || 0,
      productIds: initialData?.conditions.productIds || [],
      categoryIds: initialData?.conditions.categoryIds || [],
      customerTypes: initialData?.conditions.customerTypes || []
    },
    benefit: {
      type: initialData?.benefit.type || 'percentage',
      value: initialData?.benefit.value || 0,
      productId: initialData?.benefit.productId || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const promotionData = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      status: initialData?.status || 'draft',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (initialData) {
      updatePromotion(initialData.id, promotionData);
    } else {
      addPromotion(promotionData as Promotion);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Editar Promoción' : 'Nueva Promoción'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la Promoción
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Promoción
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="discount">Descuento</option>
                <option value="bogo">Compre 1 Lleve 2</option>
                <option value="bundle">Paquete</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Beneficio
              </label>
              <select
                value={formData.benefit.type}
                onChange={(e) => setFormData({
                  ...formData,
                  benefit: { ...formData.benefit, type: e.target.value as any }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="percentage">Porcentaje</option>
                <option value="fixed">Monto Fijo</option>
                <option value="free_product">Producto Gratis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor del Beneficio
              </label>
              <input
                type="number"
                value={formData.benefit.value}
                onChange={(e) => setFormData({
                  ...formData,
                  benefit: { ...formData.benefit, value: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {formData.benefit.type === 'free_product' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Producto Gratis
                </label>
                <select
                  value={formData.benefit.productId}
                  onChange={(e) => setFormData({
                    ...formData,
                    benefit: { ...formData.benefit, productId: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required={formData.benefit.type === 'free_product'}
                >
                  <option value="">Seleccione un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Compra Mínima
              </label>
              <input
                type="number"
                value={formData.conditions.minPurchase}
                onChange={(e) => setFormData({
                  ...formData,
                  conditions: { ...formData.conditions, minPurchase: Number(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={formData.startDate.split('T')[0]}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={formData.endDate.split('T')[0]}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Productos Aplicables
              </label>
              <div className="space-y-2">
                <select
                  multiple
                  value={formData.conditions.productIds}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({
                      ...formData,
                      conditions: {
                        ...formData.conditions,
                        productIds: selectedOptions
                      }
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  size={4}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500">
                  Mantenga presionado Ctrl/Cmd para seleccionar múltiples productos
                </p>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorías Aplicables
              </label>
              <div className="space-y-2">
                <select
                  multiple
                  value={formData.conditions.categoryIds}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({
                      ...formData,
                      conditions: {
                        ...formData.conditions,
                        categoryIds: selectedOptions
                      }
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  size={4}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500">
                  Mantenga presionado Ctrl/Cmd para seleccionar múltiples categorías
                </p>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipos de Cliente
              </label>
              <div className="space-y-2">
                <select
                  multiple
                  value={formData.conditions.customerTypes}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({
                      ...formData,
                      conditions: {
                        ...formData.conditions,
                        customerTypes: selectedOptions
                      }
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  size={3}
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="wholesale">Mayorista</option>
                </select>
              </div>
            </div>
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
              {initialData ? 'Guardar Cambios' : 'Crear Promoción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}