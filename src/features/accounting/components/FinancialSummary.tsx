import React from 'react';
import { useAccountingStore } from '../stores/accountingStore';
import { TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';

export function FinancialSummary() {
  const { accounts, selectedPeriod } = useAccountingStore();

  const totalAssets = accounts
    .filter(a => a.type === 'asset')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter(a => a.type === 'liability')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalEquity = accounts
    .filter(a => a.type === 'equity')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalIncome = accounts
    .filter(a => a.type === 'income')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalExpenses = accounts
    .filter(a => a.type === 'expense')
    .reduce((sum, a) => sum + a.balance, 0);

  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Resumen Financiero
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Balance General</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Activos</span>
              <span className="text-sm font-medium text-gray-900">
                ${totalAssets.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Pasivos</span>
              <span className="text-sm font-medium text-gray-900">
                ${totalLiabilities.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Patrimonio</span>
              <span className="text-sm font-medium text-gray-900">
                ${totalEquity.toFixed(2)}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center font-medium">
                <span className="text-sm text-gray-900">Total</span>
                <span className="text-sm text-gray-900">
                  ${(totalAssets - totalLiabilities).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Estado de Resultados</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-500">Ingresos</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${totalIncome.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <ArrowDown className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-500">Gastos</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${totalExpenses.toFixed(2)}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center font-medium">
                <span className="text-sm text-gray-900">Utilidad Neta</span>
                <span className={`text-sm ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netIncome.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}