import { create } from 'zustand';
import { StockMovement, ImportData } from '../types';
import { useInventoryStore } from './inventoryStore';

interface MovementState {
  movements: StockMovement[];
  addMovement: (movement: Omit<StockMovement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMovement: (id: string, updates: Partial<StockMovement>) => void;
  deleteMovement: (id: string) => void;
  importInventory: (importData: ImportData) => Promise<void>;
}

export const useMovementStore = create<MovementState>((set, get) => ({
  movements: [],

  addMovement: (movement) => {
    const newMovement = {
      ...movement,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      movements: [...state.movements, newMovement]
    }));

    // Actualizar el stock si el movimiento está completado
    if (movement.status === 'completed') {
      useInventoryStore.getState().updateStock(newMovement);
    }
  },

  updateMovement: (id, updates) => {
    set((state) => ({
      movements: state.movements.map(m =>
        m.id === id
          ? { ...m, ...updates, updatedAt: new Date().toISOString() }
          : m
      )
    }));

    // Si el estado cambió a completado, actualizar el stock
    if (updates.status === 'completed') {
      const movement = get().movements.find(m => m.id === id);
      if (movement) {
        useInventoryStore.getState().updateStock({ ...movement, ...updates });
      }
    }
  },

  deleteMovement: (id) =>
    set((state) => ({
      movements: state.movements.filter(m => m.id !== id)
    })),

  importInventory: async (importData) => {
    const { addMovement } = get();
    const { products } = useInventoryStore.getState();

    // Procesar los datos importados
    for (const item of importData.data) {
      const product = products.find(p => p.sku === item.sku);
      if (!product) continue;

      // Crear un movimiento de inventario inicial para cada producto
      addMovement({
        type: 'initial',
        date: new Date().toISOString(),
        productId: product.id,
        toWarehouseId: item.warehouseId,
        items: [{
          unitId: item.unitId,
          quantity: item.quantity
        }],
        status: 'completed',
        notes: `Importado desde ${importData.source}`
      });
    }
  }
}));