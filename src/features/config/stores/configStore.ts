import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Currency, TaxRate, FiscalPrinter, POSTerminal } from '../types';

interface ConfigState {
  // Información de la empresa
  name: string;
  rif: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  receiptHeader?: string;
  receiptFooter?: string;

  // Monedas y tasas
  defaultCurrency: string;
  currencies: Currency[];
  exchangeRates: Record<string, number>;

  // Impuestos
  taxes: TaxRate[];
  
  // Impresoras fiscales
  fiscalPrinters: FiscalPrinter[];
  
  // Terminales POS
  posTerminals: POSTerminal[];

  // Acciones
  updateCompanyInfo: (info: Partial<ConfigState>) => void;
  
  addCurrency: (currency: Currency) => void;
  updateCurrency: (code: string, updates: Partial<Currency>) => void;
  deleteCurrency: (code: string) => void;
  getExchangeRate: (from: string, to: string) => number;
  
  addTax: (tax: TaxRate) => void;
  updateTax: (id: string, updates: Partial<TaxRate>) => void;
  deleteTax: (id: string) => void;
  
  addPrinter: (printer: FiscalPrinter) => void;
  updatePrinter: (id: string, updates: Partial<FiscalPrinter>) => void;
  deletePrinter: (id: string) => void;
  
  addTerminal: (terminal: POSTerminal) => void;
  updateTerminal: (id: string, updates: Partial<POSTerminal>) => void;
  deleteTerminal: (id: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      // Valores iniciales
      name: 'Mi Empresa',
      rif: '',
      address: '',
      phone: '',
      email: '',
      logo: undefined,
      receiptHeader: '',
      receiptFooter: '',

      defaultCurrency: 'USD',
      currencies: [
        {
          code: 'USD',
          name: 'Dólar Estadounidense',
          symbol: '$',
          rate: 1,
          isDefault: true,
          isActive: true
        },
        {
          code: 'VES',
          name: 'Bolívar',
          symbol: 'Bs.',
          rate: 35.5,
          isDefault: false,
          isActive: true
        }
      ],
      exchangeRates: {},

      taxes: [
        {
          id: 'iva',
          name: 'IVA',
          rate: 16,
          appliesTo: 'all',
          isDefault: true,
          isActive: true
        }
      ],

      fiscalPrinters: [],
      posTerminals: [],

      // Acciones
      updateCompanyInfo: (info) => set((state) => ({ ...state, ...info })),

      addCurrency: (currency) => set((state) => ({
        currencies: [...state.currencies, currency]
      })),

      updateCurrency: (code, updates) => set((state) => ({
        currencies: state.currencies.map(c =>
          c.code === code ? { ...c, ...updates } : c
        )
      })),

      deleteCurrency: (code) => set((state) => ({
        currencies: state.currencies.filter(c => c.code !== code)
      })),

      getExchangeRate: (from, to) => {
        const { currencies } = get();
        const fromCurrency = currencies.find(c => c.code === from);
        const toCurrency = currencies.find(c => c.code === to);
        
        if (!fromCurrency || !toCurrency) return 1;
        return toCurrency.rate / fromCurrency.rate;
      },

      addTax: (tax) => set((state) => ({
        taxes: [...state.taxes, tax]
      })),

      updateTax: (id, updates) => set((state) => ({
        taxes: state.taxes.map(t =>
          t.id === id ? { ...t, ...updates } : t
        )
      })),

      deleteTax: (id) => set((state) => ({
        taxes: state.taxes.filter(t => t.id !== id)
      })),

      addPrinter: (printer) => set((state) => ({
        fiscalPrinters: [...state.fiscalPrinters, printer]
      })),

      updatePrinter: (id, updates) => set((state) => ({
        fiscalPrinters: state.fiscalPrinters.map(p =>
          p.id === id ? { ...p, ...updates } : p
        )
      })),

      deletePrinter: (id) => set((state) => ({
        fiscalPrinters: state.fiscalPrinters.filter(p => p.id !== id)
      })),

      addTerminal: (terminal) => set((state) => ({
        posTerminals: [...state.posTerminals, terminal]
      })),

      updateTerminal: (id, updates) => set((state) => ({
        posTerminals: state.posTerminals.map(t =>
          t.id === id ? { ...t, ...updates } : t
        )
      })),

      deleteTerminal: (id) => set((state) => ({
        posTerminals: state.posTerminals.filter(t => t.id !== id)
      }))
    }),
    {
      name: 'config-storage'
    }
  )
);