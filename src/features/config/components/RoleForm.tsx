import React, { useState, useEffect } from 'react';
import { useConfigStore } from '../stores/configStore';
import { X } from 'lucide-react';

interface RoleFormProps {
  onClose: () => void;
  roleId?: string | null;
}

const availablePermissions = [
  { id: 'all', name: 'Acceso Total' },
  { id: 'inventory.read', name: 'Ver Inventario' },
  { id: 'inventory.write', name: 'Modificar Inventario' },
  { id: 'pos', name: 'Punto de Venta' },
  { id: 'config', name: 'Configuración' },
  { id: 'reports', name: 'Reportes' },
];

export function RoleForm({ onClose, roleId }: RoleFormProps) {
  const { roles, addRole, updateRole } = useConfigStore();
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[]
  });

  useEffect(() => {
    if (roleId) {
      const role = roles.find(r => r.id === roleId);
      if (role) {
        setFormData({
          name: role.name,
          permissions: role.permissions
        });
      }
    }
  }, [roleId, roles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (roleId) {
      updateRole(roleId, formData);
    } else {
      addRole({
        id: crypto.randomUUID(),
        ...formData
      });
    }
    
    onClose();
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {roleId ? 'Editar Rol' : 'Nuevo Rol'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre del Rol
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permisos
            </label>
            <div className="space-y-2">
              {availablePermissions.map((permission) => (
                <label key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-300">
                    {permission.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {roleId ? 'Guardar Cambios' : 'Crear Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}