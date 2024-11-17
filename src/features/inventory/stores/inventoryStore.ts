import { create } from 'zustand';
import { Product, Warehouse, StockMovement } from '../types';

interface InventoryState {
  products: Product[];
  warehouses: Warehouse[];
  movements: StockMovement[];
  selectedWarehouse: string | null;
  categories: { id: string; name: string; parentId?: string }[];
  
  // Acciones
  setSelectedWarehouse: (warehouseId: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addWarehouse: (warehouse: Warehouse) => void;
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  addCategory: (category: { id: string; name: string; parentId?: string }) => void;
  registerMovement: (movement: StockMovement) => void;
  updateStock: (movement: StockMovement) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  warehouses: [
    { 
      id: 'default',
      name: 'Almacén Principal',
      type: 'warehouse',
      location: 'Principal',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  movements: [],
  selectedWarehouse: 'default',
  categories: [],

  setSelectedWarehouse: (warehouseId) => 
    set({ selectedWarehouse: warehouseId }),
  
  addProduct: (product) => 
    set((state) => ({ products: [...state.products, product] })),
  
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map(p => 
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter(p => p.id !== id)
    })),
  
  addWarehouse: (warehouse) =>
    set((state) => ({ warehouses: [...state.warehouses, warehouse] })),
  
  updateWarehouse: (id, updates) =>
    set((state) => ({
      warehouses: state.warehouses.map(w =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      )
    })),

  deleteWarehouse: (id) =>
    set((state) => ({
      warehouses: state.warehouses.filter(w => w.id !== id)
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category]
    })),
  
  registerMovement: (movement) =>
    set((state) => ({ movements: [...state.movements, movement] })),

  updateStock: (movement) => {
    set((state) => {
      const updatedProducts = [...state.products];
      const productIndex = updatedProducts.findIndex(p => p.id === movement.productId);
      
      if (productIndex === -1) return state;

      const product = updatedProducts[productIndex];
      const stock = { ...product.stock };

      // Si es una transferencia, reducir del almacén origen
      if (movement.fromWarehouseId) {
        movement.items.forEach(item => {
          if (!stock[movement.fromWarehouseId]) {
            stock[movement.fromWarehouseId] = {};
          }
          const currentStock = stock[movement.fromWarehouseId][item.unitId] || 0;
          stock[movement.fromWarehouseId][item.unitId] = currentStock - item.quantity;
        });
      }

      // Aumentar en el almacén destino
      movement.items.forEach(item => {
        if (!stock[movement.toWarehouseId]) {
          stock[movement.toWarehouseId] = {};
        }
        const currentStock = stock[movement.toWarehouseId][item.unitId] || 0;
        stock[movement.toWarehouseId][item.unitId] = currentStock + item.quantity;
      });

      updatedProducts[productIndex] = {
        ...product,
        stock,
        updatedAt: new Date().toISOString()
      };

      return { products: updatedProducts };
    });
  }
}));