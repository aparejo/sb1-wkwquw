import { create } from 'zustand';
import { Account, Transaction } from '../types';

interface AccountingState {
  accounts: Account[];
  transactions: Transaction[];
  selectedPeriod: string;
  
  addAccount: (account: Account) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  setPeriod: (period: string) => void;
  getBalance: (accountId: string, toDate?: string) => number;
}

export const useAccountingStore = create<AccountingState>((set, get) => ({
  accounts: [],
  transactions: [],
  selectedPeriod: new Date().getFullYear().toString(),

  addAccount: (account) => 
    set((state) => ({ accounts: [...state.accounts, account] })),

  updateAccount: (id, updates) =>
    set((state) => ({
      accounts: state.accounts.map(a => 
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      )
    })),

  deleteAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter(a => a.id !== id)
    })),

  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),

  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter(t => t.id !== id)
    })),

  setPeriod: (period) => set({ selectedPeriod: period }),

  getBalance: (accountId, toDate) => {
    const { transactions } = get();
    return transactions
      .filter(t => 
        t.status === 'posted' && 
        (!toDate || t.date <= toDate)
      )
      .reduce((balance, t) => {
        const entries = t.entries.filter(e => e.accountId === accountId);
        return balance + entries.reduce((sum, e) => sum + (e.debit - e.credit), 0);
      }, 0);
  }
}));