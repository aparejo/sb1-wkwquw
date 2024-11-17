import React, { useState } from 'react';
import { useMarketingStore } from '../stores/marketingStore';
import { X, Save, Mail, Smartphone, Bell } from 'lucide-react';
import { Campaign } from '../types';
import { ImageUploader } from '../../inventory/components/ImageUploader';

interface CampaignFormProps {
  onClose: () => void;
  initialData?: Campaign;
}

export function CampaignForm({ onClose, initialData }: CampaignFormProps) {
  const { addCampaign, updateCampaign } = useMarketingStore();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'email',
    audience: {
      customerTypes: initialData?.audience.customerTypes || [],
      lastPurchaseDays: initialData?.audience.lastPurchaseDays || 30,
      minPurchaseAmount: initialData?.audience.minPurchaseAmount || 0
    },
    content: {
      subject: initialData?.content.subject || '',
      body: initialData?.content.body || '',
      imageUrl: initialData?.content.imageUrl || ''
    },
    schedule: {
      startDate: initialData?.schedule.startDate || '',
      endDate: initialData?.schedule.endDate || '',
      frequency: initialData?.schedule.frequency || 'once'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaignData = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      status: initialData?.status || 'draft',
      metrics: initialData?.metrics || { sent: 0, opened: 0, clicked: 0, converted: 0 },
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (initialData) {
      updateCampaign(initialData.id, campaignData);
    } else {
      addCampaign(campaignData as Campaign);
    }

    onClose();
  };

  const handleImageUpload = (imageData: { url: string }) => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        imageUrl: imageData.url
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Editar Campaña' : 'Nueva Campaña'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la Campaña
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
                Tipo de Campaña
              </label>
              <div className="mt-1 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'email' })}
                  className={`flex flex-col items-center p-4 border rounded-lg ${
                    formData.type === 'email'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <Mail className="h-6 w-6 text-gray-400" />
                  <span className="mt-2 text-sm font-medium text-gray-900">Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'sms' })}
                  className={`flex flex-col items-center p-4 border rounded-lg ${
                    formData.type === 'sms'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <Smartphone className="h-6 w-6 text-gray-400" />
                  <span className="mt-2 text-sm font-medium text-gray-900">SMS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'push' })}
                  className={`flex flex-col items-center p-4 border rounded-lg ${
                    formData.type === 'push'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <Bell className="h-6 w-6 text-gray-400" />
                  <span className="mt-2 text-sm font-medium text-gray-900">Push</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Frecuencia
              </label>
              <select
                value={formData.schedule.frequency}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, frequency: e.target.value as any }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="once">Una vez</option>
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
              </label>
              <input
                type="datetime-local"
                value={formData.schedule.startDate}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, startDate: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Fin
              </label>
              <input
                type="datetime-local"
                value={formData.schedule.endDate}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, endDate: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Audiencia</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipos de Cliente
                  </label>
                  <select
                    multiple
                    value={formData.audience.customerTypes}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData({
                        ...formData,
                        audience: {
                          ...formData.audience,
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

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Última Compra (días)
                  </label>
                  <input
                    type="number"
                    value={formData.audience.lastPurchaseDays}
                    onChange={(e) => setFormData({
                      ...formData,
                      audience: {
                        ...formData.audience,
                        lastPurchaseDays: Number(e.target.value)
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Monto Mínimo de Compra
                  </label>
                  <input
                    type="number"
                    value={formData.audience.minPurchaseAmount}
                    onChange={(e) => setFormData({
                      ...formData,
                      audience: {
                        ...formData.audience,
                        minPurchaseAmount: Number(e.target.value)
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contenido</h3>
              
              {formData.type === 'email' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Asunto
                    </label>
                    <input
                      type="text"
                      value={formData.content.subject}
                      onChange={(e) => setFormData({
                        ...formData,
                        content: { ...formData.content, subject: e.target.value }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mensaje
                </label>
                <textarea
                  value={formData.content.body}
                  onChange={(e) => setFormData({
                    ...formData,
                    content: { ...formData.content, body: e.target.value }
                  })}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-4">
                <ImageUploader
                  label="Imagen de la Campaña"
                  currentImage={formData.content.imageUrl}
                  onUpload={handleImageUpload}
                  onClear={() => setFormData({
                    ...formData,
                    content: { ...formData.content, imageUrl: '' }
                  })}
                />
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
              {initialData ? 'Guardar Cambios' : 'Crear Campaña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}