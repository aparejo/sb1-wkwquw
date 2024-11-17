import React, { useState } from 'react';
import { PriceRule, TimeRange } from '../types';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface PriceRuleFormProps {
  onSubmit: (rule: PriceRule) => void;
  onClose: () => void;
  initialData?: PriceRule;
}

export function PriceRuleForm({ onSubmit, onClose, initialData }: PriceRuleFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'bulk',
    conditions: {
      minQuantity: initialData?.conditions.minQuantity || 0,
      customerTypes: initialData?.conditions.customerTypes || [],
      timeRanges: initialData?.conditions.timeRanges || []
    },
    adjustment: {
      type: initialData?.adjustment.type || 'percentage',
      value: initialData?.adjustment.value || 0
    },
    priority: initialData?.priority || 1,
    status: initialData?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ruleData = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(ruleData as PriceRule);
  };

  const updateTimeRange = (index: number, field: keyof TimeRange, value: any) => {
    const newTimeRanges = [...formData.conditions.timeRanges];
    newTimeRanges[index] = { ...newTimeRanges[index], [field]: value };
    setFormData({
      ...formData,
      conditions: {
        ...formData.conditions,
        timeRanges: newTimeRanges
      }
    });
  };

  const addTimeRange = () => {
    setFormData({
      ...formData,
      conditions: {
        ...formData.conditions,
        timeRanges: [
          ...formData.conditions.timeRanges,
          { start: '', end: '', days: [] }
        ]
      }
    });
  };

  const removeTimeRange = (index: number) => {
    setFormData({
      ...formData,
      conditions: {
        ...formData.conditions,
        timeRanges: formData.conditions.timeRanges.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Editar Regla de Precio' : 'Nueva Regla de Precio'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la Regla
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
                Tipo de Regla
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="bulk">Por Cantidad</option>
                <option value="customer_type">Por Tipo de Cliente</option>
                <option value="time_based">Por Horario</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prioridad
              </label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {formData.type === 'bulk' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad Mínima
                </label>
                <input
                  type="number"
                  value={formData.conditions.minQuantity}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: {
                      ...formData.conditions,
                      minQuantity: Number(e.target.value)
                    }
                  })}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            {formData.type === 'customer_type' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tipos de Cliente
                </label>
                <select
                  multiple
                  value={formData.conditions.customerTypes}
                  onChange={(e) => {
                    const selectedTypes = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({
                      ...formData,
                      conditions: {
                        ...formData.conditions,
                        customerTypes: selectedTypes
                      }
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  size={4}
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="wholesale">Mayorista</option>
                </select>
              </div>
            )}

            {formData.type === 'time_based' && (
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Horarios
                  </label>
                  <button
                    type="button"
                    onClick={addTimeRange}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Horario
                  </button>
                </div>

                {formData.conditions.timeRanges.map((timeRange, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hora Inicio
                        </label>
                        <input
                          type="time"
                          value={timeRange.start}
                          onChange={(e) => updateTimeRange(index, 'start', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hora Fin
                        </label>
                        <input
                          type="time"
                          value={timeRange.end}
                          onChange={(e) => updateTimeRange(index, 'end', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Días
                        </label>
                        <select
                          multiple
                          value={timeRange.days.map(String)}
                          onChange={(e) => {
                            const selectedDays = Array.from(e.target.selectedOptions, option => Number(option.value));
                            updateTimeRange(index, 'days', selectedDays);
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          size={4}
                        >
                          <option value="1">Lunes</option>
                          <option value="2">Martes</option>
                          <option value="3">Miércoles</option>
                          <option value="4">Jueves</option>
                          <option value="5">Viernes</option>
                          <option value="6">Sábado</option>
                          <option value="0">Domingo</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTimeRange(index)}
                      className="mt-2 text-sm text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Ajuste
              </label>
              <select
                value={formData.adjustment.type}
                onChange={(e) => setFormData({
                  ...formData,
                  adjustment: {
                    ...formData.adjustment,
                    type: e.target.value as 'percentage' | 'fixed'
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="percentage">Porcentaje</option>
                <option value="fixed">Monto Fijo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor del Ajuste
              </label>
              <input
                type="number"
                value={formData.adjustment.value}
                onChange={(e) => setFormData({
                  ...formData,
                  adjustment: {
                    ...formData.adjustment,
                    value: Number(e.target.value)
                  }
                })}
                min="0"
                step={formData.adjustment.type === 'percentage' ? '0.01' : '1'}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
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
              {initialData ? 'Guardar Cambios' : 'Crear Regla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}