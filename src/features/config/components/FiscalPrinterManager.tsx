import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { FiscalPrinter, FiscalPrinterModel } from '../types';
import { Printer, Plus, Edit2, Trash2 } from 'lucide-react';

const PRINTER_MODELS: { value: FiscalPrinterModel; label: string }[] = [
  { value: 'TheFactory-HKA112', label: 'The Factory HKA-112' },
  { value: 'Bematech-MP4200', label: 'Bematech MP-4200' },
  { value: 'Epson-TM-T88', label: 'Epson TM-T88' },
  { value: 'Custom-K3', label: 'Custom K3' },
  { value: 'Other', label: 'Otra' }
];

const BAUD_RATES = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];

interface PrinterFormData {
  name: string;
  model: FiscalPrinterModel;
  port: string;
  baudRate: number;
  enabled: boolean;
  isDefault: boolean;
}

export function FiscalPrinterManager() {
  const { fiscalPrinters = [], addPrinter, updatePrinter, deletePrinter } = useConfigStore();
  const [showForm, setShowForm] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<FiscalPrinter | null>(null);
  const [formData, setFormData] = useState<PrinterFormData>({
    name: '',
    model: 'TheFactory-HKA112',
    port: 'COM1',
    baudRate: 9600,
    enabled: true,
    isDefault: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const printerData = {
      id: editingPrinter?.id || crypto.randomUUID(),
      ...formData
    };

    if (editingPrinter) {
      updatePrinter(editingPrinter.id, printerData);
    } else {
      addPrinter(printerData);
    }

    setShowForm(false);
    setEditingPrinter(null);
    setFormData({
      name: '',
      model: 'TheFactory-HKA112',
      port: 'COM1',
      baudRate: 9600,
      enabled: true,
      isDefault: false
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Impresoras Fiscales
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Impresora
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {fiscalPrinters.map((printer) => (
          <div key={printer.id} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {printer.name}
                  {printer.isDefault && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Por Defecto
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">
                  {PRINTER_MODELS.find(m => m.value === printer.model)?.label} - 
                  Puerto: {printer.port} - 
                  Velocidad: {printer.baudRate} baudios
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingPrinter(printer);
                    setFormData({
                      name: printer.name,
                      model: printer.model,
                      port: printer.port,
                      baudRate: printer.baudRate,
                      enabled: printer.enabled,
                      isDefault: printer.isDefault
                    });
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deletePrinter(printer.id)}
                  className="text-red-600 hover:text-red-900"
                  disabled={printer.isDefault}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleSubmit} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPrinter ? 'Editar Impresora' : 'Nueva Impresora'}
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Modelo
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value as FiscalPrinterModel })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {PRINTER_MODELS.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Puerto
                  </label>
                  <input
                    type="text"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    placeholder="COM1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Velocidad (baudios)
                  </label>
                  <select
                    value={formData.baudRate}
                    onChange={(e) => setFormData({ ...formData, baudRate: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {BAUD_RATES.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Habilitada</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Impresora por defecto</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPrinter(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {editingPrinter ? 'Guardar Cambios' : 'Crear Impresora'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}