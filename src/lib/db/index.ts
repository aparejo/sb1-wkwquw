import Database from 'better-sqlite3';
import { join } from 'path';

// Inicializar base de datos SQLite
const db = new Database(join(process.cwd(), 'axiloop.db'), { verbose: console.log });

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    parent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS warehouses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    parent_id TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES warehouses(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category_id TEXT,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS product_units (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    barcode TEXT UNIQUE,
    conversion_factor REAL NOT NULL DEFAULT 1,
    price_usd REAL NOT NULL DEFAULT 0,
    is_base_unit BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS stock (
    product_id TEXT NOT NULL,
    warehouse_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, warehouse_id, unit_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (unit_id) REFERENCES product_units(id)
  );

  CREATE TABLE IF NOT EXISTS stock_movements (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    product_id TEXT NOT NULL,
    from_warehouse_id TEXT,
    to_warehouse_id TEXT NOT NULL,
    document_ref TEXT,
    status TEXT NOT NULL,
    notes TEXT,
    created_by TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (from_warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (to_warehouse_id) REFERENCES warehouses(id)
  );

  CREATE TABLE IF NOT EXISTS movement_items (
    movement_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (movement_id, unit_id),
    FOREIGN KEY (movement_id) REFERENCES stock_movements(id),
    FOREIGN KEY (unit_id) REFERENCES product_units(id)
  );

  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_type, document_number)
  );

  CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    date TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax_amount REAL NOT NULL,
    total REAL NOT NULL,
    total_bs REAL NOT NULL,
    exchange_rate REAL NOT NULL,
    warehouse_id TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    sale_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_usd REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (sale_id, product_id, unit_id),
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (unit_id) REFERENCES product_units(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    sale_id TEXT NOT NULL,
    method TEXT NOT NULL,
    amount_usd REAL NOT NULL,
    amount_bs REAL NOT NULL,
    exchange_rate REAL NOT NULL,
    reference TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id)
  );
`);

// Insertar almacén por defecto si no existe
const defaultWarehouse = db.prepare('SELECT * FROM warehouses WHERE is_default = 1').get();
if (!defaultWarehouse) {
  db.prepare(`
    INSERT INTO warehouses (id, name, type, location, is_default)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'default',
    'Almacén Principal',
    'warehouse',
    'Principal',
    1
  );
}

// Exportar funciones de base de datos
export const createUser = (userData: any) => {
  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    userData.id,
    userData.name,
    userData.email,
    userData.passwordHash,
    userData.role,
    userData.status
  );

  return { rows: [{ ...userData, password_hash: userData.passwordHash }] };
};

export const findUserByEmail = (email: string) => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  return { rows: user ? [user] : [] };
};

export const createCategory = (category: any) => {
  const stmt = db.prepare(`
    INSERT INTO categories (id, name, description, parent_id)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    category.id,
    category.name,
    category.description,
    category.parentId
  );

  return { rows: [category] };
};

export const getCategories = () => {
  const stmt = db.prepare('SELECT * FROM categories ORDER BY name');
  const categories = stmt.all();
  return { rows: categories };
};

export const createProduct = (product: any) => {
  const stmt = db.prepare(`
    INSERT INTO products (id, sku, name, description, category_id, min_stock, max_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    product.id,
    product.sku,
    product.name,
    product.description,
    product.categoryId,
    product.minStock,
    product.maxStock
  );

  return { rows: [product] };
};

export const getProducts = () => {
  const stmt = db.prepare('SELECT * FROM products ORDER BY name');
  const products = stmt.all();
  return { rows: products };
};

export const updateProduct = (id: string, updates: any) => {
  const stmt = db.prepare(`
    UPDATE products 
    SET name = COALESCE(?, name),
        description = COALESCE(?, description),
        category_id = COALESCE(?, category_id),
        min_stock = COALESCE(?, min_stock),
        max_stock = COALESCE(?, max_stock),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  
  const result = stmt.run(
    updates.name,
    updates.description,
    updates.categoryId,
    updates.minStock,
    updates.maxStock,
    id
  );

  return { rows: [{ id, ...updates }] };
};

export const updateStock = (productId: string, warehouseId: string, unitId: string, quantity: number) => {
  const stmt = db.prepare(`
    INSERT INTO stock (product_id, warehouse_id, unit_id, quantity)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(product_id, warehouse_id, unit_id)
    DO UPDATE SET quantity = ?
  `);
  
  const result = stmt.run(productId, warehouseId, unitId, quantity, quantity);
  return { rows: [{ productId, warehouseId, unitId, quantity }] };
};

export const getStock = (productId?: string, warehouseId?: string) => {
  let sql = 'SELECT * FROM stock';
  const params = [];

  if (productId || warehouseId) {
    sql += ' WHERE';
    if (productId) {
      sql += ' product_id = ?';
      params.push(productId);
    }
    if (warehouseId) {
      if (productId) sql += ' AND';
      sql += ' warehouse_id = ?';
      params.push(warehouseId);
    }
  }

  const stmt = db.prepare(sql);
  const stock = stmt.all(...params);
  return { rows: stock };
};

export const createStockMovement = (movement: any) => {
  const stmt = db.prepare(`
    INSERT INTO stock_movements (
      id, type, product_id, from_warehouse_id, to_warehouse_id,
      document_ref, status, notes, created_by, date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  db.transaction(() => {
    stmt.run(
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
    );

    // Insert movement items
    const itemStmt = db.prepare(`
      INSERT INTO movement_items (movement_id, unit_id, quantity)
      VALUES (?, ?, ?)
    `);

    for (const item of movement.items) {
      itemStmt.run(movement.id, item.unitId, item.quantity);
    }

    // Update stock if movement is completed
    if (movement.status === 'completed') {
      const stockStmt = db.prepare(`
        INSERT INTO stock (product_id, warehouse_id, unit_id, quantity)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(product_id, warehouse_id, unit_id)
        DO UPDATE SET quantity = quantity + ?
      `);

      for (const item of movement.items) {
        if (movement.fromWarehouseId) {
          stockStmt.run(
            movement.productId,
            movement.fromWarehouseId,
            item.unitId,
            -item.quantity,
            -item.quantity
          );
        }
        stockStmt.run(
          movement.productId,
          movement.toWarehouseId,
          item.unitId,
          item.quantity,
          item.quantity
        );
      }
    }
  })();

  return { rows: [movement] };
};

export const createSale = (sale: any) => {
  const stmt = db.prepare(`
    INSERT INTO sales (
      id, customer_id, date, subtotal, tax_amount,
      total, total_bs, exchange_rate, warehouse_id, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  db.transaction(() => {
    stmt.run(
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
    );

    // Insert sale items
    const itemStmt = db.prepare(`
      INSERT INTO sale_items (sale_id, product_id, unit_id, quantity, price_usd)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of sale.items) {
      itemStmt.run(
        sale.id,
        item.productId,
        item.unitId,
        item.quantity,
        item.priceUSD
      );
    }

    // Insert payments
    const paymentStmt = db.prepare(`
      INSERT INTO payments (
        id, sale_id, method, amount_usd, amount_bs,
        exchange_rate, reference, details
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const payment of sale.payments) {
      paymentStmt.run(
        payment.id,
        sale.id,
        payment.method,
        payment.amountUSD,
        payment.amountBs,
        payment.exchangeRate,
        payment.reference,
        JSON.stringify(payment.details)
      );
    }

    // Update stock
    const stockStmt = db.prepare(`
      INSERT INTO stock (product_id, warehouse_id, unit_id, quantity)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(product_id, warehouse_id, unit_id)
      DO UPDATE SET quantity = quantity - ?
    `);

    for (const item of sale.items) {
      stockStmt.run(
        item.productId,
        sale.warehouseId,
        item.unitId,
        -item.quantity,
        item.quantity
      );
    }
  })();

  return { rows: [sale] };
};

export const getSales = () => {
  const sales = db.prepare('SELECT * FROM sales ORDER BY date DESC').all();
  const saleItems = db.prepare('SELECT * FROM sale_items').all();
  const payments = db.prepare('SELECT * FROM payments').all();

  // Attach items and payments to each sale
  const fullSales = sales.map(sale => ({
    ...sale,
    items: saleItems.filter(item => item.saleId === sale.id),
    payments: payments.filter(payment => payment.saleId === sale.id)
  }));

  return { rows: fullSales };
};

export default db;