import React, { useState } from 'react';
import { useAccountingStore } from '../stores/accountingStore';
import { FileText, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';

export function TaxBook() {
  const { transactions } = useAccountingStore();
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [type, setType] = useState<'sales' | 'purchases'>('sales');

  // Filtrar transacciones por período y tipo
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const [year, month] = period.split('-').map(Number);
    return (
      transactionDate.getFullYear() === year &&
      transactionDate.getMonth() + 1 === month &&
      t.status === 'posted'
    );
  });

  const calculateTotals = () => {
    return filteredTransactions.reduce(
      (acc, t) => {
        const baseAmount = t.entries.reduce((sum, e) => sum + (e.debit - e.credit), 0);
        const taxAmount = baseAmount * 0.16; // 16% IVA
        return {
          baseAmount: acc.baseAmount + Math.abs(baseAmount),
          taxAmount: acc.taxAmount + Math.abs(taxAmount),
          total: acc.total + Math.abs(baseAmount + taxAmount)
        };
      },
      { baseAmount: 0, taxAmount: 0, total: 0 }
    );
  };

  const totals = calculateTotals();

  const handleExport = () => {
    // Aquí iría la lógica para exportar a Excel/CSV
    console.log('Exportando libro de IVA...');
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Libro de IVA
          </h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'sales' | 'purchases')}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="sales">Ventas</option>
              <option value="purchases">Compras</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente/Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Imponible
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IVA (16%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const baseAmount = transaction.entries.reduce((sum, e) => sum + (e.debit - e.credit), 0);
                const taxAmount = baseAmount * 0.16;
                const total = baseAmount + taxAmount;

                return (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(transaction.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.reference || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Math.abs(baseAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Math.abs(taxAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${Math.abs(total).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay registros para el período seleccionado
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                  Totales
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${totals.baseAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${totals.taxAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${totals.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}