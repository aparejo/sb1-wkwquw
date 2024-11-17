import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { Users, Edit2, Trash2, Plus } from 'lucide-react';
import { UserForm } from './UserForm';

export function UserList() {
  const { users, roles, deleteUser } = useConfigStore();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      deleteUser(id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="h-5 w-5" />
          Usuarios
        </h3>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <li key={user.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Rol: {roles.find(r => r.id === user.role)?.name || user.role}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingUser(user.id);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-red-400 hover:text-red-500"
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
        <UserForm
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          userId={editingUser}
        />
      )}
    </div>
  );
}