import React, { useState } from 'react';
import { Search, Barcode } from 'lucide-react';
import { useInventoryStore } from '../../inventory/stores/inventoryStore';

interface ProductSearchProps {
  onProductSelect: (product: any, quantity?: number) => void;
}

export function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const { products } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.baseUnit.barcode?.includes(searchTerm)
  );

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar productos por nombre, SKU o código de barras..."
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Barcode className="h-5 w-5" />
          Escanear
        </button>
      </div>

      {showResults && searchTerm && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {filteredProducts.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No se encontraron productos
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onProductSelect(product);
                    setSearchTerm('');
                    setShowResults(false);
                  }}
                >
                  <div className="flex items-center">
                    {product.mainImage && (
                      <img
                        src={product.mainImage.url}
                        alt={product.name}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {product.sku} | Precio: ${product.baseUnit.price.USD}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}