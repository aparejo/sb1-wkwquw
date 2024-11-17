import React, { useState } from 'react';
import { useAccountingStore } from '../stores/accountingStore';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { Account } from '../types';
import { AccountForm } from './AccountForm';

export function AccountList() {
  const { accounts, deleteAccount } = useAccountingStore();
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta cuenta?')) {
      deleteAccount(id);
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'asset': return 'Activo';
      case 'liability': return 'Pasivo';
      case 'equity': return 'Patrimonio';
      case 'income': return 'Ingreso';
      case 'expense': return 'Gasto';
      default: return type;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Plan de Cuentas
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Cuenta
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="divide-y divide-gray-200">
          {accounts.map((account) => (
            <div key={account.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {account.code} - {account.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getAccountTypeLabel(account.type)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingAccount(account);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-900">
                Balance: ${account.balance.toFixed(2)}
              </div>
            </div>
          ))}
          {accounts.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No hay cuentas registradas
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <AccountForm
          onClose={() => {
            setShowForm(false);
            setEditingAccount(null);
          }}
          initialData={editingAccount}
        />
      )}
    </div>
  );
}