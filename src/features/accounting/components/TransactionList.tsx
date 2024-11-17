import React, { useState } from 'react';
import { useAccountingStore } from '../stores/accountingStore';
import { Plus, FileText, Check, X } from 'lucide-react';
import { Transaction } from '../types';
import { TransactionForm } from './TransactionForm';

export function TransactionList() {
  const { transactions } = useAccountingStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transacciones
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Transacción
          </button>
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
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Débito
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Crédito
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{transaction.description}</div>
                  {transaction.reference && (
                    <div className="text-gray-500">Ref: {transaction.reference}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${transaction.entries.reduce((sum, e) => sum + e.debit, 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${transaction.entries.reduce((sum, e) => sum + e.credit, 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${transaction.status === 'posted' ? 'bg-green-100 text-green-800' : ''}
                    ${transaction.status === 'draft' ? 'bg-gray-100 text-gray-800' : ''}
                    ${transaction.status === 'void' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {transaction.status === 'posted' && <Check className="h-4 w-4 mr-1" />}
                    {transaction.status === 'void' && <X className="h-4 w-4 mr-1" />}
                    {transaction.status === 'posted' && 'Registrado'}
                    {transaction.status === 'draft' && 'Borrador'}
                    {transaction.status === 'void' && 'Anulado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      setEditingTransaction(transaction);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay transacciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TransactionForm
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
          initialData={editingTransaction}
        />
      )}
    </div>
  );
}