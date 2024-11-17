export interface POSSession {
  id: string;
  terminalId: string;
  userId: string;
  warehouseId: string;
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  finalCash?: number;
  status: 'open' | 'closed';
  sales: string[];
  payments: {
    method: string;
    amount: number;
    count: number;
  }[];
  transactions: {
    type: 'income' | 'expense';
    description: string;
    amount: number;
    reference?: string;
  }[];
}

export interface CashMovement {
  id: string;
  sessionId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  reference?: string;
  createdAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: {
    module: string;
    actions: string[];
    warehouses?: string[]; // Lista de IDs de almacenes permitidos
    terminals?: string[]; // Lista de IDs de terminales permitidos
  }[];
}

export interface POSUser {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedWarehouses: string[]; // Sucursales asignadas
  assignedTerminals: string[]; // Terminales asignados
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}