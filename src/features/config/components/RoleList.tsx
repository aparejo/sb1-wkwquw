import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { Shield, Edit2, Trash2, Plus } from 'lucide-react';
import { RoleForm } from './RoleForm';

export function RoleList() {
  const { roles, deleteRole } = useConfigStore();
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este rol?')) {
      deleteRole(id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Roles y Permisos
        </h3>
        <button
          onClick={() => {
            setEditingRole(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Rol
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {roles.map((role) => (
            <li key={role.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {role.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {role.permissions.length} permisos
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingRole(role.id);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="p-2 text-red-400 hover:text-red-500"
                    disabled={role.id === '1'} // Prevent deleting admin role
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
        <RoleForm
          onClose={() => {
            setShowForm(false);
            setEditingRole(null);
          }}
          roleId={editingRole}
        />
      )}
    </div>
  );
}