import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '../utils/imageUpload';

interface ImageUploaderProps {
  onUpload: (imageData: { url: string; filename: string; path: string }) => void;
  onClear?: () => void;
  currentImage?: string;
  label?: string;
}

export function ImageUploader({ onUpload, onClear, currentImage, label = 'Subir Imagen' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageData = await uploadImage(file);
      setPreviewUrl(imageData.url);
      onUpload(imageData);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Error al subir la imagen. Por favor, intente nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear?.();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-48 rounded-lg object-contain bg-gray-50"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">
            {isUploading ? 'Subiendo...' : 'Haga clic para seleccionar una imagen'}
          </span>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}