import { create } from 'zustand';
import { Category } from '../types';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryPath: (categoryId: string) => Category[];
  getFlattenedCategories: () => Category[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],

  addCategory: (category) => 
    set((state) => ({ 
      categories: [...state.categories, category] 
    })),

  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter(c => c.id !== id)
    })),

  getCategoryPath: (categoryId) => {
    const path: Category[] = [];
    const { categories } = get();

    const findPath = (id: string): boolean => {
      const category = categories.find(c => c.id === id);
      if (!category) return false;

      path.unshift(category);
      if (category.parentId) {
        return findPath(category.parentId);
      }
      return true;
    };

    findPath(categoryId);
    return path;
  },

  getFlattenedCategories: () => {
    const { categories } = get();
    const flattened: Category[] = [];

    const flatten = (cats: Category[], level = 0) => {
      cats.forEach(category => {
        const children = categories.filter(c => c.parentId === category.id);
        flattened.push({
          ...category,
          name: '  '.repeat(level) + category.name
        });
        flatten(children, level + 1);
      });
    };

    flatten(categories.filter(c => !c.parentId));
    return flattened;
  }
}));