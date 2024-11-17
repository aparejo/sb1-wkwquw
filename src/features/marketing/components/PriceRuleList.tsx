import React, { useState } from 'react';
import { useMarketingStore } from '../stores/marketingStore';
import { Tag, Users, Clock, Plus } from 'lucide-react';
import { PriceRule } from '../types';
import { PriceRuleForm } from './PriceRuleForm';

export function PriceRuleList() {
  const { priceRules, addPriceRule, updatePriceRule, deletePriceRule } = useMarketingStore();
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<PriceRule | null>(null);

  const handleSubmit = (rule: PriceRule) => {
    if (editingRule) {
      updatePriceRule(editingRule.id, rule);
    } else {
      addPriceRule(rule);
    }
    setShowForm(false);
    setEditingRule(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta regla?')) {
      deletePriceRule(id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'bulk':
        return <Tag className="h-5 w-5 text-blue-500" />;
      case 'customer_type':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'time_based':
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Reglas de Precio</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Regla
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {priceRules.map((rule) => (
          <div key={rule.id} className="p-6">
            <div className="flex items-center gap-3">
              {getIcon(rule.type)}
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {rule.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {rule.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full
                  ${rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                `}>
                  {rule.status === 'active' ? 'Activa' : 'Inactiva'}
                </span>
                <span className="text-sm text-gray-500">
                  Prioridad: {rule.priority}
                </span>
              </div>

              <div className="text-sm text-gray-900">
                {rule.adjustment.type === 'percentage' ? (
                  <span>-{rule.adjustment.value}%</span>
                ) : (
                  <span>-${rule.adjustment.value}</span>
                )}
              </div>
            </div>

            {rule.type === 'bulk' && rule.conditions.minQuantity && (
              <div className="mt-2 text-sm text-gray-500">
                Mínimo {rule.conditions.minQuantity} unidades
              </div>
            )}

            {rule.type === 'customer_type' && rule.conditions.customerTypes && (
              <div className="mt-2 text-sm text-gray-500">
                Para: {rule.conditions.customerTypes.join(', ')}
              </div>
            )}

            {rule.type === 'time_based' && rule.conditions.timeRanges && (
              <div className="mt-2 text-sm text-gray-500">
                Horarios específicos
              </div>
            )}
          </div>
        ))}
        {priceRules.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">
            No hay reglas de precio configuradas
          </div>
        )}
      </div>

      {showForm && (
        <PriceRuleForm
          onClose={() => {
            setShowForm(false);
            setEditingRule(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingRule}
        />
      )}
    </div>
  );
}