import { createUser, findUserByEmail } from '../db';
import bcrypt from 'bcryptjs';

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
  country?: string;
  phone?: string;
}

export async function register(userData: RegisterData): Promise<{ success: boolean; user: UserResponse }> {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser.rows.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(userData.password, 10);

    // Crear usuario en la base de datos
    const userId = crypto.randomUUID();
    const result = await createUser({
      id: userId,
      name: userData.name,
      email: userData.email,
      passwordHash,
      role: 'user',
      status: 'active'
    });

    const user = result.rows[0] as UserRow;

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function login(email: string, password: string): Promise<UserResponse> {
  try {
    const result = await findUserByEmail(email);
    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0] as UserRow;
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}