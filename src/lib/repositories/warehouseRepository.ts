import db from '../db';
import { Warehouse } from '../../features/inventory/types';

export async function createWarehouse(warehouse: Warehouse): Promise<void> {
  await db.execute({
    sql: `INSERT INTO warehouses (id, name, type, location, parent_id, is_default)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      warehouse.id,
      warehouse.name,
      warehouse.type,
      warehouse.location,
      warehouse.parentId || null,
      warehouse.isDefault ? 1 : 0
    ]
  });
}

export async function getWarehouses(): Promise<Warehouse[]> {
  const result = await db.execute('SELECT * FROM warehouses ORDER BY name');
  
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    type: row.type as 'store' | 'warehouse',
    location: row.location as string,
    parentId: row.parent_id as string | null,
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }));
}

export async function updateWarehouse(id: string, updates: Partial<Warehouse>): Promise<void> {
  await db.execute({
    sql: `UPDATE warehouses 
          SET name = COALESCE(?, name),
              type = COALESCE(?, type),
              location = COALESCE(?, location),
              parent_id = COALESCE(?, parent_id),
              is_default = COALESCE(?, is_default),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    args: [
      updates.name || null,
      updates.type || null,
      updates.location || null,
      updates.parentId || null,
      updates.isDefault === undefined ? null : (updates.isDefault ? 1 : 0),
      id
    ]
  });
}