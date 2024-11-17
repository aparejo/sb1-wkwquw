import db from '../db';
import { Category } from '../../features/inventory/types';

export async function createCategory(category: Category): Promise<void> {
  await db.execute({
    sql: `INSERT INTO categories (id, name, description, parent_id)
          VALUES (?, ?, ?, ?)`,
    args: [category.id, category.name, category.description, category.parentId]
  });
}

export async function getCategories(): Promise<Category[]> {
  const result = await db.execute('SELECT * FROM categories ORDER BY name');
  
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    parentId: row.parent_id as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }));
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  await db.execute({
    sql: `UPDATE categories 
          SET name = COALESCE(?, name),
              description = COALESCE(?, description),
              parent_id = COALESCE(?, parent_id),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    args: [updates.name, updates.description, updates.parentId, id]
  });
}

export async function deleteCategory(id: string): Promise<void> {
  // Primero actualizamos las categorías hijas para que no tengan padre
  await db.execute({
    sql: 'UPDATE categories SET parent_id = NULL WHERE parent_id = ?',
    args: [id]
  });

  // Luego eliminamos la categoría
  await db.execute({
    sql: 'DELETE FROM categories WHERE id = ?',
    args: [id]
  });
}