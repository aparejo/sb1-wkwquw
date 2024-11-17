import React from 'react';
import { UnitOfMeasure, UnitType } from '../types';

interface UnitOfMeasureFormProps {
  unit: UnitOfMeasure;
  baseUnitName?: string;
  onChange: (unit: UnitOfMeasure) => void;
  onRemove: () => void;
  isBaseUnit?: boolean;
}

const unitTypes: { value: UnitType; label: string }[] = [
  { value: 'unit', label: 'Unidad' },
  { value: 'pack', label: 'Paquete' },
  { value: 'box', label: 'Caja' },
  { value: 'case', label: 'Case' }
];

export function UnitOfMeasureForm({
  unit,
  baseUnitName,
  onChange,
  onRemove,
  isBaseUnit
}: UnitOfMeasureFormProps) {
  const handleChange = (field: keyof UnitOfMeasure, value: any) => {
    onChange({ ...unit, [field]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Unidad
          </label>
          <select
            value={unit.type}
            onChange={(e) => handleChange('type', e.target.value)}
            disabled={isBaseUnit}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {unitTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre de la Unidad
          </label>
          <input
            type="text"
            value={unit.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="ej: Caja de 24 unidades"
          />
        </div>

        {!isBaseUnit && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Factor de Conversión ({baseUnitName}s)
            </label>
            <input
              type="number"
              value={unit.conversionFactor}
              onChange={(e) => handleChange('conversionFactor', Number(e.target.value))}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Precio (USD)
          </label>
          <input
            type="number"
            value={unit.price.USD}
            onChange={(e) => handleChange('price', { USD: Number(e.target.value) })}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Código de Barras
          </label>
          <input
            type="text"
            value={unit.barcode || ''}
            onChange={(e) => handleChange('barcode', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={unit.isGenerated ? 'Se generará automáticamente' : 'Ingrese el código de barras'}
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={unit.isGenerated}
              onChange={(e) => handleChange('isGenerated', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Generar código automáticamente
            </span>
          </label>
        </div>
      </div>

      {!isBaseUnit && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Eliminar unidad
          </button>
        </div>
      )}
    </div>
  );
}