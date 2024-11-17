export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  appliesTo: 'all' | 'products' | 'services';
  isDefault: boolean;
  isActive: boolean;
}

export type FiscalPrinterModel = 
  | 'TheFactory-HKA112'
  | 'Bematech-MP4200'
  | 'Epson-TM-T88'
  | 'Custom-K3'
  | 'Other';

export interface FiscalPrinter {
  id: string;
  name: string;
  model: FiscalPrinterModel;
  port: string;
  baudRate: number;
  enabled: boolean;
  isDefault: boolean;
}

export interface POSTerminal {
  id: string;
  name: string;
  warehouseId: string;
  printerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}