export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId?: string;
  minStock: number;
  maxStock: number;
  mainImage?: ProductImage;
  bannerImage?: ProductImage;
  gallery: ProductImage[];
  baseUnit: UnitOfMeasure;
  units: UnitOfMeasure[];
  stock: {
    [warehouseId: string]: {
      [unitId: string]: number;
    };
  };
  isCustom?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  type: 'main' | 'banner' | 'gallery';
}

export interface UnitOfMeasure {
  id: string;
  type: UnitType;
  name: string;
  barcode?: string;
  conversionFactor: number;
  price: {
    [currency: string]: number;
  };
  isGenerated: boolean;
}

export type UnitType = 'unit' | 'pack' | 'box' | 'case';

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  type: 'store' | 'warehouse';
  location: string;
  parentId?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  type: MovementType;
  date: string;
  productId: string;
  fromWarehouseId?: string;
  toWarehouseId: string;
  documentRef?: string;
  notes?: string;
  items: {
    unitId: string;
    quantity: number;
  }[];
  status: 'pending' | 'completed' | 'cancelled';
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 
  | 'initial'
  | 'purchase'
  | 'purchase_order'
  | 'sale'
  | 'transfer_warehouse'
  | 'transfer_store'
  | 'adjustment';

export interface ImportData {
  source: 'csv' | 'woocommerce' | 'other';
  data: {
    sku: string;
    quantity: number;
    warehouseId: string;
    unitId: string;
  }[];
}

export interface WarehouseHierarchyItem extends Warehouse {
  children: WarehouseHierarchyItem[];
}