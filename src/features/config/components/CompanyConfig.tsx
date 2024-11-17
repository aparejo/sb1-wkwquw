import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { Building2 } from 'lucide-react';
import { ImageUploader } from '../../inventory/components/ImageUploader';
import { CompanyConfig as CompanyConfigType } from '../types';

export function CompanyConfig() {
  const config = useConfigStore();
  const [formData, setFormData] = useState<CompanyConfigType>({
    name: config.name || '',
    rif: config.rif || '',
    address: config.address || '',
    phone: config.phone || '',
    email: config.email || '',
    logo: config.logo || '',
    receiptHeader: config.receiptHeader || '',
    receiptFooter: config.receiptFooter || '',
    defaultCurrency: config.defaultCurrency || 'USD',
    taxes: config.taxes || [],
    currencies: config.currencies || [],
    exchangeRates: config.exchangeRates || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(formData).forEach(([key, value]) => {
      if (key in config) {
        config[key] = value;
      }
    });
  };

  const handleImageUpload = (imageData: { url: string }) => {
    setFormData({ ...formData, logo: imageData.url });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5" />
        Datos de la Empresa
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre de la Empresa
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              RIF
            </label>
            <input
              type="text"
              value={formData.rif}
              onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dirección
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Teléfono
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Logo
            </label>
            <ImageUploader
              currentImage={formData.logo}
              onUpload={handleImageUpload}
              onClear={() => setFormData({ ...formData, logo: '' })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Encabezado del Ticket
            </label>
            <textarea
              value={formData.receiptHeader}
              onChange={(e) => setFormData({ ...formData, receiptHeader: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pie del Ticket
            </label>
            <textarea
              value={formData.receiptFooter}
              onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}