import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { Currency } from '../types';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';

interface CurrencyFormData {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isDefault: boolean;
  isActive: boolean;
}

export function CurrencyManager() {
  const { currencies, addCurrency, updateCurrency, deleteCurrency } = useConfigStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [formData, setFormData] = useState<CurrencyFormData>({
    code: '',
    name: '',
    symbol: '',
    rate: 1,
    isDefault: false,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currencyData = {
      ...formData,
      updatedAt: new Date().toISOString()
    };

    if (editingCurrency) {
      updateCurrency(editingCurrency.code, currencyData);
    } else {
      addCurrency(currencyData);
    }

    setShowForm(false);
    setEditingCurrency(null);
    setFormData({
      code: '',
      name: '',
      symbol: '',
      rate: 1,
      isDefault: false,
      isActive: true
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monedas y Tasas de Cambio
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Moneda
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {currencies.map((currency) => (
          <div key={currency.code} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {currency.name} ({currency.code})
                </h3>
                <p className="text-sm text-gray-500">
                  Tasa: {currency.rate} - Símbolo: {currency.symbol}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingCurrency(currency);
                    setFormData({
                      code: currency.code,
                      name: currency.name,
                      symbol: currency.symbol,
                      rate: currency.rate,
                      isDefault: currency.isDefault,
                      isActive: currency.isActive
                    });
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteCurrency(currency.code)}
                  className="text-red-600 hover:text-red-900"
                  disabled={currency.isDefault}
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
                {editingCurrency ? 'Editar Moneda' : 'Nueva Moneda'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Código (ISO)
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    maxLength={3}
                    pattern="[A-Z]{3}"
                    placeholder="USD"
                  />
                </div>

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
                    Símbolo
                  </label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tasa de Cambio (respecto a USD)
                  </label>
                  <input
                    type="number"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: Number(e.target.value) })}
                    step="0.0001"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Moneda por defecto</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Activa</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCurrency(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {editingCurrency ? 'Guardar Cambios' : 'Crear Moneda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}