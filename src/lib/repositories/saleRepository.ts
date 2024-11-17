import db from '../db';
import { Sale, SaleItem, Payment } from '../../features/pos/types';

export async function createSale(sale: Sale): Promise<void> {
  // Iniciamos una transacción
  await db.execute('BEGIN TRANSACTION');

  try {
    // Insertamos la venta
    await db.execute({
      sql: `INSERT INTO sales (
              id, customer_id, date, subtotal, tax_amount,
              total, total_bs, exchange_rate, warehouse_id, status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        sale.id,
        sale.customer.id,
        sale.date,
        sale.subtotal,
        sale.taxAmount,
        sale.total,
        sale.totalBs,
        sale.exchangeRate,
        sale.warehouseId,
        sale.status
      ]
    });

    // Insertamos los items
    for (const item of sale.items) {
      await db.execute({
        sql: `INSERT INTO sale_items (
                sale_id, product_id, unit_id, quantity, price_usd
              )
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          sale.id,
          item.productId,
          item.unitId,
          item.quantity,
          item.priceUSD
        ]
      });

      // Actualizamos el stock
      await db.execute({
        sql: `UPDATE stock 
              SET quantity = quantity - ?
              WHERE product_id = ? AND warehouse_id = ? AND unit_id = ?`,
        args: [item.quantity, item.productId, sale.warehouseId, item.unitId]
      });
    }

    // Insertamos los pagos
    for (const payment of sale.payments) {
      await db.execute({
        sql: `INSERT INTO payments (
                id, sale_id, method, amount_usd, amount_bs,
                exchange_rate, reference, details
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          payment.id,
          sale.id,
          payment.method,
          payment.amountUSD,
          payment.amountBs,
          payment.exchangeRate,
          payment.reference,
          JSON.stringify(payment.details)
        ]
      });
    }

    await db.execute('COMMIT');
  } catch (error) {
    await db.execute('ROLLBACK');
    throw error;
  }
}

export async function getSales(): Promise<Sale[]> {
  const sales = await db.execute('SELECT * FROM sales ORDER BY date DESC');
  const result: Sale[] = [];

  for (const row of sales.rows) {
    // Obtenemos los items
    const items = await db.execute({
      sql: 'SELECT * FROM sale_items WHERE sale_id = ?',
      args: [row.id]
    });

    // Obtenemos los pagos
    const payments = await db.execute({
      sql: 'SELECT * FROM payments WHERE sale_id = ?',
      args: [row.id]
    });

    // Obtenemos el cliente
    const customer = await db.execute({
      sql: 'SELECT * FROM customers WHERE id = ?',
      args: [row.customer_id]
    });

    result.push({
      id: row.id as string,
      customer: {
        id: customer.rows[0].id as string,
        type: customer.rows[0].type as 'person' | 'company',
        documentType: customer.rows[0].document_type as string,
        documentNumber: customer.rows[0].document_number as string,
        name: customer.rows[0].name as string,
        address: customer.rows[0].address as string,
        phone: customer.rows[0].phone as string,
        email: customer.rows[0].email as string
      },
      date: row.date as string,
      subtotal: row.subtotal as number,
      taxAmount: row.tax_amount as number,
      total: row.total as number,
      totalBs: row.total_bs as number,
      exchangeRate: row.exchange_rate as number,
      warehouseId: row.warehouse_id as string,
      status: row.status as string,
      items: items.rows.map(item => ({
        productId: item.product_id as string,
        unitId: item.unit_id as string,
        quantity: item.quantity as number,
        priceUSD: item.price_usd as number
      })),
      payments: payments.rows.map(payment => ({
        id: payment.id as string,
        method: payment.method as string,
        amountUSD: payment.amount_usd as number,
        amountBs: payment.amount_bs as number,
        exchangeRate: payment.exchange_rate as number,
        reference: payment.reference as string,
        details: JSON.parse(payment.details as string)
      })),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string
    });
  }

  return result;
}

export async function getSaleById(id: string): Promise<Sale | null> {
  const sales = await db.execute({
    sql: 'SELECT * FROM sales WHERE id = ?',
    args: [id]
  });

  if (sales.rows.length === 0) return null;

  const row = sales.rows[0];

  // Obtenemos los items
  const items = await db.execute({
    sql: 'SELECT * FROM sale_items WHERE sale_id = ?',
    args: [id]
  });

  // Obtenemos los pagos
  const payments = await db.execute({
    sql: 'SELECT * FROM payments WHERE sale_id = ?',
    args: [id]
  });

  // Obtenemos el cliente
  const customer = await db.execute({
    sql: 'SELECT * FROM customers WHERE id = ?',
    args: [row.customer_id]
  });

  return {
    id: row.id as string,
    customer: {
      id: customer.rows[0].id as string,
      type: customer.rows[0].type as 'person' | 'company',
      documentType: customer.rows[0].document_type as string,
      documentNumber: customer.rows[0].document_number as string,
      name: customer.rows[0].name as string,
      address: customer.rows[0].address as string,
      phone: customer.rows[0].phone as string,
      email: customer.rows[0].email as string
    },
    date: row.date as string,
    subtotal: row.subtotal as number,
    taxAmount: row.tax_amount as number,
    total: row.total as number,
    totalBs: row.total_bs as number,
    exchangeRate: row.exchange_rate as number,
    warehouseId: row.warehouse_id as string,
    status: row.status as string,
    items: items.rows.map(item => ({
      productId: item.product_id as string,
      unitId: item.unit_id as string,
      quantity: item.quantity as number,
      priceUSD: item.price_usd as number
    })),
    payments: payments.rows.map(payment => ({
      id: payment.id as string,
      method: payment.method as string,
      amountUSD: payment.amount_usd as number,
      amountBs: payment.amount_bs as number,
      exchangeRate: payment.exchange_rate as number,
      reference: payment.reference as string,
      details: JSON.parse(payment.details as string)
    })),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

export async function updateSaleStatus(id: string, status: string): Promise<void> {
  await db.execute({
    sql: `UPDATE sales 
          SET status = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    args: [status, id]
  });
}