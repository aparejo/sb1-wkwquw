import React, { useState } from 'react';
import { useMarketingStore } from '../stores/marketingStore';
import { Mail, Smartphone, Bell, TrendingUp, Plus } from 'lucide-react';
import { Campaign } from '../types';
import { CampaignForm } from './CampaignForm';

export function CampaignList() {
  const { campaigns } = useMarketingStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'sms':
        return <Smartphone className="h-5 w-5" />;
      case 'push':
        return <Bell className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Campañas</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Campaña
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getIcon(campaign.type)}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {campaign.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {campaign.metrics.converted} conversiones
                </span>
               </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {campaign.metrics.sent}
                </div>
                <div className="text-xs text-gray-500">Enviados</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {campaign.metrics.opened}
                </div>
                <div className="text-xs text-gray-500">Abiertos</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {campaign.metrics.clicked}
                </div>
                <div className="text-xs text-gray-500">Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {((campaign.metrics.converted / campaign.metrics.sent) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Conversión</div>
              </div>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">
            No hay campañas activas
          </div>
        )}
      </div>

      {showForm && (
        <CampaignForm
          onClose={() => {
            setShowForm(false);
            setEditingCampaign(null);
          }}
          initialData={editingCampaign}
        />
      )}
    </div>
  );
}