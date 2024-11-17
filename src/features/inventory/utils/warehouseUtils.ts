import { Warehouse, WarehouseHierarchyItem } from '../types';

export function getWarehouseHierarchy(warehouses: Warehouse[]): WarehouseHierarchyItem[] {
  // Encontrar tiendas principales (sin parentId)
  const stores = warehouses.filter(w => w.type === 'store' && !w.parentId);
  
  // Función recursiva para construir la jerarquía
  const buildHierarchy = (parent: Warehouse | null): WarehouseHierarchyItem[] => {
    const children = warehouses.filter(w => w.parentId === (parent?.id || null));
    
    return children.map(child => ({
      ...child,
      children: buildHierarchy(child)
    }));
  };

  // Construir la jerarquía completa
  return stores.map(store => ({
    ...store,
    children: buildHierarchy(store)
  }));
}