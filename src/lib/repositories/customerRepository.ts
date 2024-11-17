import db from '../db';
import { Customer } from '../../features/pos/types';

export async function createCustomer(customer: Customer): Promise<void> {
  await db.execute({
    sql: `INSERT INTO customers (
            id, type, document_type, document_number, 
            name, address, phone, email
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      customer.id,
      customer.type,
      customer.documentType,
      customer.documentNumber,
      customer.name,
      customer.address,
      customer.phone,
      customer.email
    ]
  });
}

export async function getCustomers(): Promise<Customer[]> {
  const result = await db.execute('SELECT * FROM customers ORDER BY name');
  
  return result.rows.map(row => ({
    id: row.id as string,
    type: row.type as 'person' | 'company',
    documentType: row.document_type as string,
    documentNumber: row.document_number as string,
    name: row.name as string,
    address: row.address as string,
    phone: row.phone as string,
    email: row.email as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }));
}

export async function findCustomerByDocument(type: string, number: string): Promise<Customer | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM customers WHERE document_type = ? AND document_number = ?',
    args: [type, number]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id as string,
    type: row.type as 'person' | 'company',
    documentType: row.document_type as string,
    documentNumber: row.document_number as string,
    name: row.name as string,
    address: row.address as string,
    phone: row.phone as string,
    email: row.email as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
  await db.execute({
    sql: `UPDATE customers 
          SET type = COALESCE(?, type),
              document_type = COALESCE(?, document_type),
              document_number = COALESCE(?, document_number),
              name = COALESCE(?, name),
              address = COALESCE(?, address),
              phone = COALESCE(?, phone),
              email = COALESCE(?, email),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    args: [
      updates.type,
      updates.documentType,
      updates.documentNumber,
      updates.name,
      updates.address,
      updates.phone,
      updates.email,
      id
    ]
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM customers WHERE id = ?',
    args: [id]
  });
}