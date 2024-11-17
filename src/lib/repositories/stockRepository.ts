import db from '../db';
import { StockMovement } from '../../features/inventory/types';

export async function createStockMovement(movement: StockMovement): Promise<void> {
  await db.execute('BEGIN TRANSACTION');

  try {
    // Insertamos el movimiento
    await db.execute({
      sql: `INSERT INTO stock_movements (
              id, type, product_id, from_warehouse_id, to_warehouse_id,
              document_ref, status, notes, created_by, date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        movement.id,
        movement.type,
        movement.productId,
        movement.fromWarehouseId,
        movement.toWarehouseId,
        movement.documentRef,
        movement.status,
        movement.notes,
        movement.createdBy,
        movement.date
      ]
    });

    // Insertamos los items del movimiento
    for (const item of movement.items) {
      await db.execute({
        sql: `INSERT INTO movement_items (movement_id, unit_id, quantity)
              VALUES (?, ?, ?)`,
        args: [movement.id, item.unitId, item.quantity]
      });

      // Si el movimiento está completado, actualizamos el stock
      if (movement.status === 'completed') {
        // Si es una transferencia, reducimos el stock del almacén origen
        if (movement.fromWarehouseId) {
          await db.execute({
            sql: `UPDATE stock 
                  SET quantity = quantity - ?
                  WHERE product_id = ? AND warehouse_id = ? AND unit_id = ?`,
            args: [
              item.quantity,
              movement.productId,
              movement.fromWarehouseId,
              item.unitId
            ]
          });
        }

        // Aumentamos el stock en el almacén destino
        await db.execute({
          sql: `INSERT INTO stock (product_id, warehouse_id, unit_id, quantity)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(product_id, warehouse_id, unit_id)
                DO UPDATE SET quantity = quantity + ?`,
          args: [
            movement.productId,
            movement.toWarehouseId,
            item.unitId,
            item.quantity,
            item.quantity
          ]
        });
      }
    }

    await db.execute('COMMIT');
  } catch (error) {
    await db.execute('ROLLBACK');
    throw error;
  }
}

export async function getStockMovements(): Promise<StockMovement[]> {
  const movements = await db.execute('SELECT * FROM stock_movements ORDER BY date DESC');
  const result: StockMovement[] = [];

  for (const row of movements.rows) {
    // Obtenemos los items del movimiento
    const items = await db.execute({
      sql: 'SELECT * FROM movement_items WHERE movement_id = ?',
      args: [row.id]
    });

    result.push({
      id: row.id as string,
      type: row.type as any,
      productId: row.product_id as string,
      fromWarehouseId: row.from_warehouse_id as string,
      toWarehouseId: row.to_warehouse_id as string,
      documentRef: row.document_ref as string,
      status: row.status as 'pending' | 'completed' | 'cancelled',
      notes: row.notes as string,
      createdBy: row.created_by as string,
      date: row.date as string,
      items: items.rows.map(item => ({
        unitId: item.unit_id as string,
        quantity: item.quantity as number
      })),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string
    });
  }

  return result;
}

export async function updateMovementStatus(id: string, status: string): Promise<void> {
  const movement = await db.execute({
    sql: 'SELECT * FROM stock_movements WHERE id = ?',
    args: [id]
  });

  if (movement.rows.length === 0) {
    throw new Error('Movimiento no encontrado');
  }

  await db.execute('BEGIN TRANSACTION');

  try {
    await db.execute({
      sql: `UPDATE stock_movements 
            SET status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [status, id]
    });

    // Si el movimiento se está completando, actualizamos el stock
    if (status === 'completed') {
      const items = await db.execute({
        sql: 'SELECT * FROM movement_items WHERE movement_id = ?',
        args: [id]
      });

      for (const item of items.rows) {
        // Si es una transferencia, reducimos el stock del almacén origen
        if (movement.rows[0].from_warehouse_id) {
          await db.execute({
            sql: `UPDATE stock 
                  SET quantity = quantity - ?
                  WHERE product_id = ? AND warehouse_id = ? AND unit_id = ?`,
            args: [
              item.quantity,
              movement.rows[0].product_id,
              movement.rows[0].from_warehouse_id,
              item.unit_id
            ]
          });
        }

        // Aumentamos el stock en el almacén destino
        await db.execute({
          sql: `INSERT INTO stock (product_id, warehouse_id, unit_id, quantity)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(product_id, warehouse_id, unit_id)
                DO UPDATE SET quantity = quantity + ?`,
          args: [
            movement.rows[0].product_id,
            movement.rows[0].to_warehouse_id,
            item.unit_id,
            item.quantity,
            item.quantity
          ]
        });
      }
    }

    await db.execute('COMMIT');
  } catch (error) {
    await db.execute('ROLLBACK');
    throw error;
  }
}