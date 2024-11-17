import { useState } from 'react';
import { FiscalPrinter } from '../../../lib/services/fiscalPrinter';
import { Sale } from '../types';

export function useFiscalPrinter() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const printFiscalReceipt = async (sale: Sale) => {
    setIsPrinting(true);
    setError(null);

    try {
      const printer = new FiscalPrinter({
        port: 'COM1', // Esto debería venir de la configuración
        baudRate: 9600,
        manufacturer: 'TheFactory' // Esto debería venir de la configuración
      });

      await printer.printReceipt(sale);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al imprimir');
      throw err;
    } finally {
      setIsPrinting(false);
    }
  };

  return {
    printFiscalReceipt,
    isPrinting,
    error
  };
}