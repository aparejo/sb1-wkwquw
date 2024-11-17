import React, { useState } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { useCategoryStore } from '../stores/categoryStore';
import { Search, Edit, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { ProductForm } from './ProductForm';

export function ProductList() {
  const { products, selectedWarehouse, updateProduct, deleteProduct } = useInventoryStore();
  const { categories } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockDisplay = (product: Product) => {
    const warehouseStock = selectedWarehouse ? product.stock[selectedWarehouse] : null;
    if (!warehouseStock) return 'No disponible';
    
    const baseUnitStock = warehouseStock[product.baseUnit.id] || 0;
    return `${baseUnitStock} ${product.baseUnit.name}`;
  };

  const getMainPrice = (product: Product) => {
    if (!product.baseUnit?.price?.USD) return 'N/A';
    return `$${product.baseUnit.price.USD.toFixed(2)}`;
  };

  const getCategoryName = (product: Product) => {
    if (!product.categoryId) return 'Sin categoría';
    const category = categories.find(c => c.id === product.categoryId);
    return category ? category.name : 'Sin categoría';
  };

  const handleDelete = (productId: string) => {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Base
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.mainImage && (
                      <img
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                        src={product.mainImage.url}
                        alt={product.name}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      {product.baseUnit.barcode && (
                        <div className="text-sm text-gray-500">{product.baseUnit.barcode}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCategoryName(product)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getStockDisplay(product)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getMainPrice(product)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <ProductForm
              initialData={editingProduct}
              onSubmit={(productData) => {
                updateProduct(editingProduct.id, productData);
                setEditingProduct(null);
              }}
              onClose={() => setEditingProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}