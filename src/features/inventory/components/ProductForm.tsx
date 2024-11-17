import React, { useState } from 'react';
import { Product, ProductImage, UnitOfMeasure, UnitType } from '../types';
import { useCategoryStore } from '../stores/categoryStore';
import { ImageUploader } from './ImageUploader';
import { UnitOfMeasureForm } from './UnitOfMeasureForm';
import { generateBarcode } from '../utils/barcodeGenerator';
import { X, Plus } from 'lucide-react';

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  onClose: () => void;
  initialData?: Product;
}

export function ProductForm({ onSubmit, onClose, initialData }: ProductFormProps) {
  const { getFlattenedCategories } = useCategoryStore();
  const flattenedCategories = getFlattenedCategories();

  const [formData, setFormData] = useState<Product>({
    id: initialData?.id || '',
    sku: initialData?.sku || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    categoryId: initialData?.categoryId || '',
    minStock: initialData?.minStock || 0,
    maxStock: initialData?.maxStock || 0,
    mainImage: initialData?.mainImage || null,
    bannerImage: initialData?.bannerImage || null,
    gallery: initialData?.gallery || [],
    baseUnit: initialData?.baseUnit || {
      id: crypto.randomUUID(),
      type: 'unit',
      name: 'Unidad',
      barcode: '',
      conversionFactor: 1,
      price: { USD: 0 },
      isGenerated: true
    },
    units: initialData?.units || [],
    stock: initialData?.stock || {},
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: initialData?.updatedAt || new Date().toISOString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generar códigos de barras si es necesario
    const updatedBaseUnit = formData.baseUnit.isGenerated
      ? { ...formData.baseUnit, barcode: generateBarcode() }
      : formData.baseUnit;

    const updatedUnits = formData.units.map(unit => 
      unit.isGenerated ? { ...unit, barcode: generateBarcode() } : unit
    );

    onSubmit({
      ...formData,
      baseUnit: updatedBaseUnit,
      units: updatedUnits
    });
  };

  const handleImageUpload = (type: 'main' | 'banner' | 'gallery') => (imageData: { url: string }) => {
    if (type === 'gallery') {
      setFormData({
        ...formData,
        gallery: [...formData.gallery, {
          id: crypto.randomUUID(),
          url: imageData.url,
          alt: formData.name,
          type: 'gallery'
        }]
      });
    } else {
      const image: ProductImage = {
        id: crypto.randomUUID(),
        url: imageData.url,
        alt: formData.name,
        type
      };
      setFormData({
        ...formData,
        [type === 'main' ? 'mainImage' : 'bannerImage']: image
      });
    }
  };

  const addUnit = () => {
    const newUnit: UnitOfMeasure = {
      id: crypto.randomUUID(),
      type: 'unit',
      name: '',
      barcode: '',
      conversionFactor: 1,
      price: { USD: 0 },
      isGenerated: true
    };
    setFormData({ ...formData, units: [...formData.units, newUnit] });
  };

  const updateUnit = (index: number, unit: UnitOfMeasure) => {
    const updatedUnits = [...formData.units];
    updatedUnits[index] = unit;
    setFormData({ ...formData, units: updatedUnits });
  };

  const removeUnit = (index: number) => {
    setFormData({
      ...formData,
      units: formData.units.filter((_, i) => i !== index)
    });
  };

  const removeGalleryImage = (imageId: string) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter(img => img.id !== imageId)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccione una categoría</option>
                {flattenedCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Máximo</label>
              <input
                type="number"
                value={formData.maxStock}
                onChange={(e) => setFormData({ ...formData, maxStock: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Imágenes</h3>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <ImageUploader
                    label="Imagen Principal"
                    currentImage={formData.mainImage?.url}
                    onUpload={handleImageUpload('main')}
                    onClear={() => setFormData({ ...formData, mainImage: null })}
                  />
                </div>
                <div>
                  <ImageUploader
                    label="Imagen Banner"
                    currentImage={formData.bannerImage?.url}
                    onUpload={handleImageUpload('banner')}
                    onClear={() => setFormData({ ...formData, bannerImage: null })}
                  />
                </div>
                <div>
                  <ImageUploader
                    label="Galería"
                    onUpload={handleImageUpload('gallery')}
                  />
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {formData.gallery.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="h-20 w-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Unidad Base</h3>
              <UnitOfMeasureForm
                unit={formData.baseUnit}
                onChange={(unit) => setFormData({ ...formData, baseUnit: unit })}
                onRemove={() => {}}
                isBaseUnit
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Unidades Adicionales</h3>
                <button
                  type="button"
                  onClick={addUnit}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Unidad
                </button>
              </div>
              
              {formData.units.map((unit, index) => (
                <UnitOfMeasureForm
                  key={unit.id}
                  unit={unit}
                  baseUnitName={formData.baseUnit.name}
                  onChange={(updatedUnit) => updateUnit(index, updatedUnit)}
                  onRemove={() => removeUnit(index)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}