import React, { useState } from 'react';
import { useAccountingStore } from '../stores/accountingStore';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionFormProps {
  onClose: () => void;
  initialData?: Transaction;
}

export function TransactionForm({ onClose, initialData }: TransactionFormProps) {
  const { addTransaction, updateTransaction, accounts } = useAccountingStore();
  const [formData, setFormData] = useState({
    date: initialData?.date.split('T')[0] || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    reference: initialData?.reference || '',
    entries: initialData?.entries || [
      { accountId: '', debit: 0, credit: 0, description: '' }
    ]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que débitos y créditos estén balanceados
    const totalDebits = formData.entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredits = formData.entries.reduce((sum, entry) => sum + entry.credit, 0);
    
    if (totalDebits !== totalCredits) {
      alert('Los débitos y créditos deben estar balanceados');
      return;
    }

    const transactionData = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      status: initialData?.status || 'draft',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (initialData) {
      updateTransaction(initialData.id, transactionData);
    } else {
      addTransaction(transactionData as Transaction);
    }

    onClose();
  };

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { accountId: '', debit: 0, credit: 0, description: '' }]
    });
  };

  const removeEntry = (index: number) => {
    setFormData({
      ...formData,
      entries: formData.entries.filter((_, i) => i !== index)
    });
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const newEntries = [...formData.entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setFormData({ ...formData, entries: newEntries });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referencia
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Asientos</h3>
              <button
                type="button"
                onClick={addEntry}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                <Plus className="h-4 w-4" />
                Agregar Asiento
              </button>
            </div>

            <div className="space-y-4">
              {formData.entries.map((entry, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Cuenta
                    </label>
                    <select
                      value={entry.accountId}
                      onChange={(e) => updateEntry(index, 'accountId', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccione una cuenta</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700">
                      Débito
                    </label>
                    <input
                      type="number"
                      value={entry.debit}
                      onChange={(e) => updateEntry(index, 'debit', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700">
                      Crédito
                    </label>
                    <input
                      type="number"
                      value={entry.credit}
                      onChange={(e) => updateEntry(index, 'credit', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="text-red-600 hover:text-red-900"
                      disabled={formData.entries.length === 1}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm font-medium">
              <span>Total:</span>
              <div className="space-x-4">
                <span>
                  Débitos: ${formData.entries.reduce((sum, e) => sum + e.debit, 0).toFixed(2)}
                </span>
                <span>
                  Créditos: ${formData.entries.reduce((sum, e) => sum + e.credit, 0).toFixed(2)}
                </span>
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
              {initialData ? 'Guardar Cambios' : 'Crear Transacción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}