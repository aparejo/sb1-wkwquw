import React from 'react';
import { X } from 'lucide-react';

interface ImageInputProps {
  label: string;
  imageUrl: string;
  onChange: (url: string) => void;
  onClear: () => void;
  placeholder?: string;
  required?: boolean;
}

export function ImageInput({ 
  label, 
  imageUrl, 
  onChange, 
  onClear, 
  placeholder = 'Ingrese la URL de la imagen', 
  required = false 
}: ImageInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="space-y-2">
        {imageUrl && (
          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}