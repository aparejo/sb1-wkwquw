import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { TaxRate } from '../types';
import { Plus, Edit2, Trash2, Percent } from 'lucide-react';

interface TaxFormData {
  name: string;
  rate: number;
  appliesTo: 'all' | 'products' | 'services';
  isDefault: boolean;
  isActive: boolean;
}

export function TaxRatesManager() {
  const { taxes, addTax, updateTax, deleteTax } = useConfigStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null);
  const [formData, setFormData] = useState<TaxFormData>({
    name: '',
    rate: 0,
    appliesTo: 'all',
    isDefault: false,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taxData = {
      id: editingTax?.id || crypto.randomUUID(),
      ...formData,
      createdAt: editingTax?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingTax) {
      updateTax(editingTax.id, taxData);
    } else {
      addTax(taxData);
    }

    setShowForm(false);
    setEditingTax(null);
    setFormData({
      name: '',
      rate: 0,
      appliesTo: 'all',
      isDefault: false,
      isActive: true
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Impuestos
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nuevo Impuesto
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {taxes.map((tax) => (
          <div key={tax.id} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {tax.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {tax.rate}% - Aplica a: {tax.appliesTo}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingTax(tax);
                    setFormData({
                      name: tax.name,
                      rate: tax.rate,
                      appliesTo: tax.appliesTo,
                      isDefault: tax.isDefault,
                      isActive: tax.isActive
                    });
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteTax(tax.id)}
                  className="text-red-600 hover:text-red-900"
                  disabled={tax.isDefault}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleSubmit} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTax ? 'Editar Impuesto' : 'Nuevo Impuesto'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tasa (%)
                  </label>
                  <input
                    type="number"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                    step="0.01"
                    min="0"
                    max="100"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Aplica a
                  </label>
                  <select
                    value={formData.appliesTo}
                    onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">Todo</option>
                    <option value="products">Solo Productos</option>
                    <option value="services">Solo Servicios</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Impuesto por defecto</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Activo</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTax(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {editingTax ? 'Guardar Cambios' : 'Crear Impuesto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}