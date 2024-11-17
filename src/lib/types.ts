export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId?: string;
  minStock: number;
  maxStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Stock {
  productId: string;
  warehouseId: string;
  unitId: string;
  quantity: number;
}

export interface Customer {
  id: string;
  type: 'person' | 'company';
  documentType: string;
  documentNumber: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  date: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  totalBs: number;
  exchangeRate: number;
  warehouseId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}