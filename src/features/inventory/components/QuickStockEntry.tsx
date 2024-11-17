import React, { useState, useRef, useEffect } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { useMovementStore } from '../stores/movementStore';
import { format } from 'date-fns';
import { Barcode, Save } from 'lucide-react';

interface StockEntry {
  barcode: string;
  quantity: number;
}

export function QuickStockEntry({ onClose }: { onClose: () => void }) {
  const { products, warehouses } = useInventoryStore();
  const { addMovement } = useMovementStore();
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [currentBarcode, setCurrentBarcode] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [documentRef, setDocumentRef] = useState('');
  const [notes, setNotes] = useState('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBarcode || !currentQuantity) return;

    setEntries(prev => [...prev, {
      barcode: currentBarcode,
      quantity: Number(currentQuantity)
    }]);
    setCurrentBarcode('');
    setCurrentQuantity('');
    barcodeInputRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!warehouseId || entries.length === 0) return;

    // Agrupar entradas por producto
    const entriesByProduct = new Map();
    
    entries.forEach(entry => {
      const product = products.find(p => 
        p.baseUnit.barcode === entry.barcode || 
        p.units.some(u => u.barcode === entry.barcode)
      );

      if (product) {
        const unit = [product.baseUnit, ...product.units].find(u => u.barcode === entry.barcode);
        if (unit) {
          if (!entriesByProduct.has(product.id)) {
            entriesByProduct.set(product.id, []);
          }
          entriesByProduct.get(product.id).push({
            unitId: unit.id,
            quantity: entry.quantity
          });
        }
      }
    });

    // Crear movimiento para cada producto
    for (const [productId, items] of entriesByProduct) {
      await addMovement({
        type: 'initial',
        date: format(new Date(), 'yyyy-MM-dd'),
        productId,
        toWarehouseId: warehouseId,
        documentRef,
        notes,
        items,
        status: 'completed',
        createdBy: 'user'
      });
    }

    onClose();
  };

  const getProductInfo = (barcode: string) => {
    const product = products.find(p => 
      p.baseUnit.barcode === barcode || 
      p.units.some(u => u.barcode === barcode)
    );
    
    if (!product) return null;
    
    const unit = [product.baseUnit, ...product.units].find(u => u.barcode === barcode);
    return unit ? `${product.name} (${unit.name})` : null;
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Barcode className="h-6 w-6" />
            Entrada Rápida de Inventario
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Cerrar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Almacén/Tienda
              </label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione destino</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referencia
              </label>
              <input
                type="text"
                value={documentRef}
                onChange={(e) => setDocumentRef(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ej: Inventario Inicial #001"
              />
            </div>
          </div>

          <form onSubmit={handleAddEntry} className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Código de Barras
              </label>
              <input
                ref={barcodeInputRef}
                type="text"
                value={currentBarcode}
                onChange={(e) => setCurrentBarcode(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Escanee o ingrese el código"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <input
                type="number"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="h-10 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
          </form>

          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.barcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getProductInfo(entry.barcode) || 'Producto no encontrado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEntries(entries.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay productos agregados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={entries.length === 0 || !warehouseId}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Guardar Inventario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}