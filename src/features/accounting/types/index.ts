export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parentId?: string;
  description?: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  reference?: string;
  entries: TransactionEntry[];
  status: 'draft' | 'posted' | 'void';
  createdAt: string;
  updatedAt: string;
}

export interface TransactionEntry {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}