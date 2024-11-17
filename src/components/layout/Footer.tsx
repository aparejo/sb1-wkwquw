import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Axiloop. Desarrollado por{' '}
            <a 
              href="https://antonioparejo.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Antonio Parejo
            </a>
            . Todos los derechos reservados 2025.
          </div>
          <div className="flex gap-4">
            <a 
              href="https://antonioparejo.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 text-sm"
            >
              Sitio Web
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}