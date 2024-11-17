import { format } from 'date-fns';

interface UploadedImage {
  url: string;
  filename: string;
  path: string;
}

export async function uploadImage(file: File): Promise<UploadedImage> {
  // Crear estructura de carpetas por año/mes como WordPress
  const date = new Date();
  const year = format(date, 'yyyy');
  const month = format(date, 'MM');
  
  // Generar nombre de archivo único
  const timestamp = date.getTime();
  const safeFilename = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
  const filename = `${timestamp}-${safeFilename}`;
  const path = `uploads/${year}/${month}/${filename}`;

  // En un entorno real, aquí subiríamos el archivo al servidor
  // Por ahora, creamos una URL local
  const url = URL.createObjectURL(file);

  // Simular un delay para emular la subida
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    url,
    filename,
    path
  };
}