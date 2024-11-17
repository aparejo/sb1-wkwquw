import React, { useState } from 'react';
import { useMarketingStore } from '../stores/marketingStore';
import { PromotionForm } from './PromotionForm';
import { Plus, Tag, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Promotion } from '../types';

export function PromotionList() {
  const { promotions, deletePromotion } = useMarketingStore();
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta promoción?')) {
      deletePromotion(id);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Promociones
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Promoción
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {promotion.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {promotion.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingPromotion(promotion);
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(promotion.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full
                  ${promotion.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  ${promotion.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                  ${promotion.status === 'expired' ? 'bg-red-100 text-red-800' : ''}
                  ${promotion.status === 'cancelled' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}>
                  {promotion.status === 'active' && 'Activa'}
                  {promotion.status === 'draft' && 'Borrador'}
                  {promotion.status === 'expired' && 'Expirada'}
                  {promotion.status === 'cancelled' && 'Cancelada'}
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              {promotion.type === 'discount' && (
                <span>
                  {promotion.benefit.type === 'percentage' ? (
                    `${promotion.benefit.value}% de descuento`
                  ) : (
                    `$${promotion.benefit.value} de descuento`
                  )}
                </span>
              )}
              {promotion.type === 'bogo' && <span>Compre 1 Lleve 2</span>}
              {promotion.type === 'bundle' && <span>Paquete Especial</span>}
              {promotion.conditions.minPurchase > 0 && (
                <span className="ml-2">
                  (Compra mínima: ${promotion.conditions.minPurchase})
                </span>
              )}
            </div>
          </div>
        ))}
        {promotions.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">
            No hay promociones registradas
          </div>
        )}
      </div>

      {showForm && (
        <PromotionForm
          onClose={() => {
            setShowForm(false);
            setEditingPromotion(null);
          }}
          initialData={editingPromotion}
        />
      )}
    </div>
  );
}