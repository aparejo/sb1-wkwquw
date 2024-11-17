import React from 'react';
import { Tag, Users, TrendingUp } from 'lucide-react';
import { useMarketingStore } from '../stores/marketingStore';
import { PromotionList } from './PromotionList';
import { CampaignList } from './CampaignList';
import { PriceRuleList } from './PriceRuleList';

export function MarketingDashboard() {
  const { promotions, campaigns, priceRules } = useMarketingStore();

  const activePromotions = promotions.filter(p => p.status === 'active');
  const activeCampaigns = campaigns.filter(c => 
    c.status === 'running' || c.status === 'scheduled'
  );

  const totalConversions = campaigns.reduce((sum, c) => sum + c.metrics.converted, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Tag className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Promociones Activas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activePromotions.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Campañas en Curso
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activeCampaigns.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Conversiones
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalConversions}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PromotionList />
        </div>
        <div className="space-y-6">
          <CampaignList />
          <PriceRuleList />
        </div>
      </div>
    </div>
  );
}