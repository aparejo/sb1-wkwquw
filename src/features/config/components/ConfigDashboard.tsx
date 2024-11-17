import React from 'react';
import { CompanyConfig } from './CompanyConfig';
import { UserList } from './UserList';
import { RoleList } from './RoleList';
import { TaxRatesManager } from './TaxRatesManager';
import { CurrencyManager } from './CurrencyManager';

export function ConfigDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
      </div>

      <div className="space-y-6">
        <CompanyConfig />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaxRatesManager />
          <CurrencyManager />
        </div>
        <UserList />
        <RoleList />
      </div>
    </div>
  );
}