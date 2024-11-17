import { Product, ProductImage, UnitOfMeasure } from '../../features/inventory/types';
import db from '../db';

export async function createProduct(product: Product): Promise<void> {
  const { id, sku, name, description, categoryId, minStock, maxStock } = product;

  await db.execute({
    sql: `INSERT INTO products (id, sku, name, description, category_id, min_stock, max_stock)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, sku, name, description || '', categoryId || null, minStock || 0, maxStock || 0]
  });

  if (product.mainImage) {
    await createProductImage(id, product.mainImage);
  }

  if (product.bannerImage) {
    await createProductImage(id, product.bannerImage);
  }

  if (product.gallery) {
    for (const image of product.gallery) {
      await createProductImage(id, image);
    }
  }

  await createProductUnit(id, product.baseUnit, true);
  
  for (const unit of product.units) {
    await createProductUnit(id, unit, false);
  }
}

async function createProductImage(productId: string, image: ProductImage): Promise<void> {
  await db.execute({
    sql: `INSERT INTO product_images (id, product_id, url, alt, type)
          VALUES (?, ?, ?, ?, ?)`,
    args: [image.id, productId, image.url, image.alt, image.type]
  });
}

async function createProductUnit(
  productId: string, 
  unit: UnitOfMeasure, 
  isBaseUnit: boolean
): Promise<void> {
  await db.execute({
    sql: `INSERT INTO product_units (
            id, product_id, type, name, barcode, 
            conversion_factor, price_usd, is_base_unit, is_generated
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      unit.id,
      productId,
      unit.type,
      unit.name,
      unit.barcode || null,
      unit.conversionFactor,
      unit.price.USD,
      isBaseUnit,
      unit.isGenerated
    ]
  });
}

export async function getProducts(): Promise<Product[]> {
  const products = await db.execute('SELECT * FROM products');
  const result: Product[] = [];

  for (const row of products.rows) {
    const product: Product = {
      id: row.id as string,
      sku: row.sku as string,
      name: row.name as string,
      description: row.description as string,
      categoryId: row.category_id as string,
      minStock: Number(row.min_stock),
      maxStock: Number(row.max_stock),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      mainImage: undefined,
      bannerImage: undefined,
      gallery: [],
      baseUnit: null as any,
      units: [],
      stock: {}
    };

    // Obtener imágenes
    const images = await db.execute({
      sql: 'SELECT * FROM product_images WHERE product_id = ?',
      args: [product.id]
    });

    for (const img of images.rows) {
      const image: ProductImage = {
        id: img.id as string,
        url: img.url as string,
        alt: img.alt as string,
        type: img.type as 'main' | 'banner' | 'gallery'
      };

      if (image.type === 'main') {
        product.mainImage = image;
      } else if (image.type === 'banner') {
        product.bannerImage = image;
      } else if (image.type === 'gallery') {
        product.gallery.push(image);
      }
    }

    // Obtener unidades
    const units = await db.execute({
      sql: 'SELECT * FROM product_units WHERE product_id = ?',
      args: [product.id]
    });

    for (const unit of units.rows) {
      const unitData: UnitOfMeasure = {
        id: unit.id as string,
        type: unit.type as any,
        name: unit.name as string,
        barcode: unit.barcode as string,
        conversionFactor: Number(unit.conversion_factor),
        price: {
          USD: Number(unit.price_usd)
        },
        isGenerated: Boolean(unit.is_generated)
      };

      if (unit.is_base_unit) {
        product.baseUnit = unitData;
      } else {
        product.units.push(unitData);
      }
    }

    // Obtener stock
    const stock = await db.execute({
      sql: 'SELECT * FROM stock WHERE product_id = ?',
      args: [product.id]
    });

    for (const item of stock.rows) {
      const warehouseId = item.warehouse_id as string;
      const unitId = item.unit_id as string;
      
      if (!product.stock[warehouseId]) {
        product.stock[warehouseId] = {};
      }
      
      product.stock[warehouseId][unitId] = Number(item.quantity);
    }

    result.push(product);
  }

  return result;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const { sku, name, description, categoryId, minStock, maxStock } = updates;

  await db.execute({
    sql: `UPDATE products 
          SET sku = COALESCE(?, sku),
              name = COALESCE(?, name),
              description = COALESCE(?, description),
              category_id = COALESCE(?, category_id),
              min_stock = COALESCE(?, min_stock),
              max_stock = COALESCE(?, max_stock),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    args: [
      sku || null,
      name || null,
      description || null,
      categoryId || null,
      minStock || null,
      maxStock || null,
      id
    ]
  });

  if (updates.mainImage) {
    await db.execute({
      sql: 'DELETE FROM product_images WHERE product_id = ? AND type = ?',
      args: [id, 'main']
    });
    await createProductImage(id, updates.mainImage);
  }

  if (updates.bannerImage) {
    await db.execute({
      sql: 'DELETE FROM product_images WHERE product_id = ? AND type = ?',
      args: [id, 'banner']
    });
    await createProductImage(id, updates.bannerImage);
  }

  if (updates.gallery) {
    await db.execute({
      sql: 'DELETE FROM product_images WHERE product_id = ? AND type = ?',
      args: [id, 'gallery']
    });
    for (const image of updates.gallery) {
      await createProductImage(id, image);
    }
  }

  if (updates.baseUnit) {
    await db.execute({
      sql: `UPDATE product_units 
            SET type = ?, name = ?, barcode = ?, price_usd = ?, is_generated = ?
            WHERE product_id = ? AND is_base_unit = TRUE`,
      args: [
        updates.baseUnit.type,
        updates.baseUnit.name,
        updates.baseUnit.barcode || null,
        updates.baseUnit.price.USD,
        updates.baseUnit.isGenerated,
        id
      ]
    });
  }

  if (updates.units) {
    await db.execute({
      sql: 'DELETE FROM product_units WHERE product_id = ? AND is_base_unit = FALSE',
      args: [id]
    });
    for (const unit of updates.units) {
      await createProductUnit(id, unit, false);
    }
  }
}