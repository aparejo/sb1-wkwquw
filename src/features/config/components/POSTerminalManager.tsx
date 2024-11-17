import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { POSTerminal } from '../types';
import { Plus, Edit2, Trash2, Monitor } from 'lucide-react';

interface TerminalFormData {
  name: string;
  warehouseId: string;
  printerId?: string;
  isActive: boolean;
}

export function POSTerminalManager() {
  const { posTerminals = [], fiscalPrinters = [], warehouses = [], addTerminal, updateTerminal, deleteTerminal } = useConfigStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<POSTerminal | null>(null);
  const [formData, setFormData] = useState<TerminalFormData>({
    name: '',
    warehouseId: '',
    printerId: undefined,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const terminalData = {
      id: editingTerminal?.id || crypto.randomUUID(),
      ...formData,
      createdAt: editingTerminal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingTerminal) {
      updateTerminal(editingTerminal.id, terminalData);
    } else {
      addTerminal(terminalData);
    }

    setShowForm(false);
    setEditingTerminal(null);
    setFormData({
      name: '',
      warehouseId: '',
      printerId: undefined,
      isActive: true
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Puntos de Venta
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nuevo Terminal
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {posTerminals.map((terminal) => {
          const warehouse = warehouses.find(w => w.id === terminal.warehouseId);
          const printer = fiscalPrinters.find(p => p.id === terminal.printerId);
          
          return (
            <div key={terminal.id} className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {terminal.name}
                    {!terminal.isActive && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Inactivo
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {warehouse?.name} - 
                    Impresora: {printer?.name || 'No asignada'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingTerminal(terminal);
                      setFormData({
                        name: terminal.name,
                        warehouseId: terminal.warehouseId,
                        printerId: terminal.printerId,
                        isActive: terminal.isActive
                      });
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteTerminal(terminal.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleSubmit} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTerminal ? 'Editar Terminal' : 'Nuevo Terminal'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    placeholder="Caja 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tienda/Almacén
                  </label>
                  <select
                    value={formData.warehouseId}
                    onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione una tienda</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Impresora Fiscal
                  </label>
                  <select
                    value={formData.printerId || ''}
                    onChange={(e) => setFormData({ ...formData, printerId: e.target.value || undefined })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sin impresora asignada</option>
                    {fiscalPrinters
                      .filter(p => p.enabled)
                      .map((printer) => (
                        <option key={printer.id} value={printer.id}>
                          {printer.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Terminal activo</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTerminal(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {editingTerminal ? 'Guardar Cambios' : 'Crear Terminal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}