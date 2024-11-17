import React, { useState } from 'react';
import { useMovementStore } from '../stores/movementStore';
import { ImportData } from '../types';
import { Upload } from 'lucide-react';

export function ImportInventory({ onClose }: { onClose: () => void }) {
  const { importInventory } = useMovementStore();
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<'csv' | 'woocommerce' | 'other'>('csv');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n').map(row => row.split(','));
        
        // Omitir la fila de encabezados
        const data = rows.slice(1).map(row => ({
          sku: row[0],
          quantity: Number(row[1]),
          warehouseId: row[2],
          unitId: row[3]
        }));

        await importInventory({
          source,
          data
        });

        onClose();
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error al importar:', error);
      alert('Error al procesar el archivo');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Importar Inventario
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Origen de los Datos
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as ImportData['source'])}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="csv">Archivo CSV</option>
              <option value="woocommerce">WooCommerce</option>
              <option value="other">Otro Sistema</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                >
                  <span>Seleccionar archivo</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs text-gray-500">
                CSV con formato: SKU, Cantidad, ID Almacén, ID Unidad
              </p>
            </div>
            {file && (
              <div className="mt-4 text-sm text-gray-500">
                Archivo seleccionado: {file.name}
              </div>
            )}
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
              disabled={!file || isProcessing}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? 'Procesando...' : 'Importar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}