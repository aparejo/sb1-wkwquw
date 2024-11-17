import { Sale, SaleItem } from '../../features/pos/types';

// Tipos de comandos fiscales
export enum FiscalCommand {
  OPEN_FISCAL_RECEIPT = 'S1',
  PRINT_FISCAL_TEXT = 'S2',
  PRINT_LINE_ITEM = 'S3',
  SUBTOTAL = 'S4',
  PAYMENT = 'S5',
  CLOSE_FISCAL_RECEIPT = 'S6',
  STATUS = 'S7'
}

interface PrinterConfig {
  port: string;
  baudRate: number;
  manufacturer: 'TheFactory' | 'Bematech';
}

interface FiscalPayment {
  method: string;
  amountUSD: number;
}

export class FiscalPrinter {
  private port: any; // En un entorno real, esto sería SerialPort
  private config: PrinterConfig;

  constructor(config: PrinterConfig) {
    this.config = config;
    // En un entorno real, inicializaríamos el puerto serial aquí
  }

  private async sendCommand(command: string): Promise<string> {
    // Simulación de envío de comando
    console.log(`Enviando comando fiscal: ${command}`);
    return 'OK';
  }

  private formatAmount(amount: number): string {
    return amount.toFixed(2).replace('.', '');
  }

  private formatText(text: string, maxLength: number = 40): string {
    return text.slice(0, maxLength).padEnd(maxLength);
  }

  async printReceipt(sale: Sale): Promise<void> {
    try {
      // 1. Abrir documento fiscal
      await this.sendCommand(`${FiscalCommand.OPEN_FISCAL_RECEIPT}`);

      // 2. Imprimir encabezado
      await this.sendCommand(`${FiscalCommand.PRINT_FISCAL_TEXT}Cliente: ${sale.customer.name}`);
      await this.sendCommand(`${FiscalCommand.PRINT_FISCAL_TEXT}RIF/CI: ${sale.customer.documentType}-${sale.customer.documentNumber}`);

      // 3. Imprimir items
      for (const item of sale.items) {
        const command = this.formatLineItem(item);
        await this.sendCommand(command);
      }

      // 4. Subtotal
      await this.sendCommand(`${FiscalCommand.SUBTOTAL}`);

      // 5. Procesar pagos
      for (const payment of sale.payments) {
        const command = this.formatPayment(payment);
        await this.sendCommand(command);
      }

      // 6. Cerrar documento fiscal
      await this.sendCommand(`${FiscalCommand.CLOSE_FISCAL_RECEIPT}`);

    } catch (error) {
      console.error('Error al imprimir documento fiscal:', error);
      throw new Error('Error al imprimir documento fiscal');
    }
  }

  private formatLineItem(item: SaleItem): string {
    // El formato depende del fabricante de la impresora
    if (this.config.manufacturer === 'TheFactory') {
      return `${FiscalCommand.PRINT_LINE_ITEM}${this.formatText(item.name || '')}${this.formatAmount(item.quantity)}${this.formatAmount(item.priceUSD)}000`;
    } else {
      // Formato Bematech
      return `${FiscalCommand.PRINT_LINE_ITEM}${this.formatText(item.name || '', 30)}${this.formatAmount(item.quantity)}${this.formatAmount(item.priceUSD)}`;
    }
  }

  private formatPayment(payment: FiscalPayment): string {
    // El formato depende del fabricante de la impresora
    if (this.config.manufacturer === 'TheFactory') {
      return `${FiscalCommand.PAYMENT}${payment.method}${this.formatAmount(payment.amountUSD)}`;
    } else {
      // Formato Bematech
      return `${FiscalCommand.PAYMENT}${payment.method}${this.formatAmount(payment.amountUSD)}`;
    }
  }

  async getStatus(): Promise<string> {
    return await this.sendCommand(FiscalCommand.STATUS);
  }
}