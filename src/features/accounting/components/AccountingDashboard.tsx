import React from 'react';
import { DollarSign, FileText, TrendingUp } from 'lucide-react';
import { useAccountingStore } from '../stores/accountingStore';
import { AccountList } from './AccountList';
import { TransactionList } from './TransactionList';
import { FinancialSummary } from './FinancialSummary';
import { TaxBook } from './TaxBook';

export function AccountingDashboard() {
  const { accounts, transactions, selectedPeriod } = useAccountingStore();

  const totalAssets = accounts
    .filter(a => a.type === 'asset')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter(a => a.type === 'liability')
    .reduce((sum, a) => sum + a.balance, 0);

  const monthlyTransactions = transactions.filter(t => {
    const transactionMonth = new Date(t.date).getMonth();
    const currentMonth = new Date().getMonth();
    return transactionMonth === currentMonth;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Activos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalAssets.toFixed(2)}
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
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Transacciones del Mes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {monthlyTransactions.length}
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
                    Capital Neto
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${(totalAssets - totalLiabilities).toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList />
          <div className="mt-6">
            <TaxBook />
          </div>
        </div>
        <div className="space-y-6">
          <AccountList />
          <FinancialSummary />
        </div>
      </div>
    </div>
  );
}