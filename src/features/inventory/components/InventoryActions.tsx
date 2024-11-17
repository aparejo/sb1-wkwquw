import React, { useState } from 'react';
import { Plus, Upload, Barcode, ArrowLeftRight, FileText, Building2 } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { ImportInventory } from './ImportInventory';
import { QuickStockEntry } from './QuickStockEntry';
import { StockMovementForm } from './StockMovementForm';
import { useInventoryStore } from '../stores/inventoryStore';

export function InventoryActions() {
  const { addProduct } = useInventoryStore();
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [showMovement, setShowMovement] = useState(false);
  const [movementType, setMovementType] = useState<'purchase' | 'transfer_warehouse' | 'transfer_store' | null>(null);

  const handleMovement = (type: 'purchase' | 'transfer_warehouse' | 'transfer_store') => {
    setMovementType(type);
    setShowMovement(true);
  };

  const handleCreateProduct = (productData: any) => {
    const newProduct = {
      ...productData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stock: {
        default: {
          [productData.baseUnit.id]: 0
        }
      }
    };
    
    addProduct(newProduct);
    setShowNewProduct(false);
  };

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setShowNewProduct(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </button>

        <div className="relative group">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Movimientos
          </button>
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg hidden group-hover:block z-50">
            <div className="py-1">
              <button
                onClick={() => handleMovement('purchase')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <FileText className="h-4 w-4" />
                Por Factura
              </button>
              <button
                onClick={() => handleMovement('transfer_warehouse')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Building2 className="h-4 w-4" />
                Entre Depósitos
              </button>
              <button
                onClick={() => handleMovement('transfer_store')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Entre Tiendas
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowQuickEntry(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          <Barcode className="h-4 w-4" />
          Entrada Rápida
        </button>

        <button
          onClick={() => setShowImport(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Upload className="h-4 w-4" />
          Importar
        </button>
      </div>

      {showNewProduct && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onClose={() => setShowNewProduct(false)}
        />
      )}

      {showImport && (
        <ImportInventory onClose={() => setShowImport(false)} />
      )}

      {showQuickEntry && (
        <QuickStockEntry onClose={() => setShowQuickEntry(false)} />
      )}

      {showMovement && movementType && (
        <StockMovementForm
          type={movementType}
          onClose={() => {
            setShowMovement(false);
            setMovementType(null);
          }}
        />
      )}
    </>
  );
}