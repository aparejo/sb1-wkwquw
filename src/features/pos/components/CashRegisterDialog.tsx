import React, { useState } from 'react';
import { usePOSStore } from '../stores/posStore';
import { useAuthStore } from '../../../stores/auth';
import { useConfigStore } from '../../config/stores/configStore';
import { AlertCircle } from 'lucide-react';

interface CashRegisterDialogProps {
  type: 'open' | 'close';
  onClose: () => void;
}

export function CashRegisterDialog({ type, onClose }: CashRegisterDialogProps) {
  const { openSession, closeSession, hasTerminalAccess } = usePOSStore();
  const { user } = useAuthStore();
  const { warehouses, posTerminals } = useConfigStore();
  
  const [amount, setAmount] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedTerminal, setSelectedTerminal] = useState('');
  const [error, setError] = useState('');

  // Filtrar almacenes y terminales según permisos
  const availableWarehouses = warehouses.filter(w => 
    w.type === 'store' && 
    (user?.role === 'admin' || user?.permissions?.some(p => 
      p.warehouses?.includes('all') || p.warehouses?.includes(w.id)
    ))
  );

  const availableTerminals = posTerminals.filter(t => 
    t.warehouseId === selectedWarehouse &&
    t.isActive &&
    (user?.role === 'admin' || user?.permissions?.some(p =>
      p.terminals?.includes('all') || p.terminals?.includes(t.id)
    ))
  );

  // Autoseleccionar si solo hay una opción
  React.useEffect(() => {
    if (availableWarehouses.length === 1) {
      setSelectedWarehouse(availableWarehouses[0].id);
    }
  }, [availableWarehouses]);

  React.useEffect(() => {
    if (availableTerminals.length === 1) {
      setSelectedTerminal(availableTerminals[0].id);
    }
  }, [availableTerminals, selectedWarehouse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (type === 'open') {
        if (!hasTerminalAccess(user.id, selectedTerminal)) {
          throw new Error('No tiene acceso a este terminal');
        }

        openSession({
          terminalId: selectedTerminal,
          userId: user.id,
          warehouseId: selectedWarehouse,
          initialCash: Number(amount)
        });
      } else {
        closeSession({
          finalCash: Number(amount)
        });
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la operación');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {type === 'open' ? 'Abrir Caja' : 'Cerrar Caja'}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === 'open' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sucursal
                </label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => {
                    setSelectedWarehouse(e.target.value);
                    setSelectedTerminal(''); // Reset terminal al cambiar sucursal
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccione una sucursal</option>
                  {availableWarehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Terminal
                </label>
                <select
                  value={selectedTerminal}
                  onChange={(e) => setSelectedTerminal(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccione un terminal</option>
                  {availableTerminals.map((terminal) => (
                    <option key={terminal.id} value={terminal.id}>
                      {terminal.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {type === 'open' ? 'Monto Inicial' : 'Monto Final'}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {type === 'open' ? 'Abrir Caja' : 'Cerrar Caja'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}