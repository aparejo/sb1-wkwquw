import { User } from './types';

// Tipos para la base de datos
interface DBSchema {
  users: User[];
  categories: any[];
  warehouses: any[];
  products: any[];
  stock: any[];
  customers: any[];
  sales: any[];
}

// Clase para manejar el almacenamiento local
class LocalDB {
  private static instance: LocalDB;
  private storage: Storage;
  private data: DBSchema;

  private constructor() {
    this.storage = window.localStorage;
    this.data = this.loadData();
  }

  public static getInstance(): LocalDB {
    if (!LocalDB.instance) {
      LocalDB.instance = new LocalDB();
    }
    return LocalDB.instance;
  }

  private loadData(): DBSchema {
    const defaultData: DBSchema = {
      users: [],
      categories: [],
      warehouses: [{
        id: 'default',
        name: 'Almacén Principal',
        type: 'warehouse',
        location: 'Principal',
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }],
      products: [],
      stock: [],
      customers: [],
      sales: []
    };

    try {
      const storedData = this.storage.getItem('db');
      return storedData ? JSON.parse(storedData) : defaultData;
    } catch {
      return defaultData;
    }
  }

  private saveData(): void {
    this.storage.setItem('db', JSON.stringify(this.data));
  }

  // Métodos para usuarios
  public async createUser(userData: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    status: string;
  }) {
    const newUser = {
      ...userData,
      password_hash: userData.passwordHash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.saveData();
    return { rows: [newUser] };
  }

  public async findUserByEmail(email: string) {
    const user = this.data.users.find(u => u.email === email);
    return { rows: user ? [user] : [] };
  }

  // Métodos para categorías
  public async getCategories() {
    return { rows: this.data.categories };
  }

  public async createCategory(category: any) {
    this.data.categories.push(category);
    this.saveData();
    return { rows: [category] };
  }

  // Métodos para productos
  public async getProducts() {
    return { rows: this.data.products };
  }

  public async createProduct(product: any) {
    this.data.products.push(product);
    this.saveData();
    return { rows: [product] };
  }

  public async updateProduct(id: string, updates: any) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.products[index] = { ...this.data.products[index], ...updates };
      this.saveData();
    }
    return { rows: [{ id, ...updates }] };
  }

  // Métodos para stock
  public async getStock() {
    return { rows: this.data.stock };
  }

  public async updateStock(productId: string, warehouseId: string, unitId: string, quantity: number) {
    const stockIndex = this.data.stock.findIndex(
      s => s.productId === productId && s.warehouseId === warehouseId && s.unitId === unitId
    );

    if (stockIndex !== -1) {
      this.data.stock[stockIndex].quantity = quantity;
    } else {
      this.data.stock.push({ productId, warehouseId, unitId, quantity });
    }

    this.saveData();
    return { rows: [{ productId, warehouseId, unitId, quantity }] };
  }
}

// Instancia única de la base de datos
const db = LocalDB.getInstance();

// Exportar funciones de la base de datos
export const createUser = (userData: Parameters<LocalDB['createUser']>[0]) => 
  db.createUser(userData);

export const findUserByEmail = (email: string) => 
  db.findUserByEmail(email);

export const getCategories = () => 
  db.getCategories();

export const createCategory = (category: any) => 
  db.createCategory(category);

export const getProducts = () => 
  db.getProducts();

export const createProduct = (product: any) => 
  db.createProduct(product);

export const updateProduct = (id: string, updates: any) => 
  db.updateProduct(id, updates);

export const getStock = () => 
  db.getStock();

export const updateStock = (productId: string, warehouseId: string, unitId: string, quantity: number) => 
  db.updateStock(productId, warehouseId, unitId, quantity);

export default db;