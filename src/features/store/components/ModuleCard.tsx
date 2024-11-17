import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, Megaphone, CheckCircle, Clock } from 'lucide-react';
import { useStoreStore } from '../stores/storeStore';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const navigate = useNavigate();
  const { getModuleStatus, startTrial } = useStoreStore();
  const status = getModuleStatus(module.id);

  const getIcon = () => {
    switch (module.icon) {
      case 'Package':
        return <Package className="h-8 w-8" />;
      case 'DollarSign':
        return <DollarSign className="h-8 w-8" />;
      case 'Megaphone':
        return <Megaphone className="h-8 w-8" />;
      default:
        return <Package className="h-8 w-8" />;
    }
  };

  const handleClick = () => {
    if (status === 'inactive' && module.price > 0) {
      startTrial(module.id);
    }
    navigate(module.route);
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 ${
        status === 'inactive' ? 'opacity-75' : ''
      }`}
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-lg ${
            status === 'free' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
            status === 'trial' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
            'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {getIcon()}
          </div>
          {status === 'free' && (
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded">
              Gratis
            </span>
          )}
          {status === 'trial' && (
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded">
              Prueba
            </span>
          )}
          {status === 'inactive' && module.price > 0 && (
            <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded">
              ${module.price}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          {module.name}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {module.description}
        </p>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Características:
          </h4>
          <ul className="space-y-2">
            {module.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
        <button
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md ${
            status === 'inactive' 
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {status === 'inactive' ? (
            <>
              <Clock className="h-4 w-4" />
              Iniciar Prueba Gratis
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Acceder
            </>
          )}
        </button>
      </div>
    </div>
  );
}