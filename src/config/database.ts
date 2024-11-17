import { createClient } from '@libsql/client';

export interface DatabaseConfig {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export async function createTenantDatabase(tenant: string): Promise<void> {
  // En un entorno real, esto crearía una nueva base de datos para el tenant
  const dbName = `axiloop_${tenant}`;
  
  // Crear la base de datos del tenant
  const db = createClient({
    url: `file:${dbName}.db`,
  });

  // Inicializar esquema
  await initializeSchema(db);
}

async function initializeSchema(db: any): Promise<void> {
  // Tablas del sistema
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      plan TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      subscription_id TEXT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      currency TEXT NOT NULL,
      status TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id),
      FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );
  `);

  // Tablas específicas del negocio
  await initializeBusinessSchema(db);
}

async function initializeBusinessSchema(db: any): Promise<void> {
  // Aquí van todas las tablas del sistema que ya teníamos
  // (productos, inventario, ventas, etc.)
  
  // Por ejemplo:
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      sku TEXT NOT NULL,
      name TEXT NOT NULL,
      /* ... resto de campos ... */
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );
  `);
}