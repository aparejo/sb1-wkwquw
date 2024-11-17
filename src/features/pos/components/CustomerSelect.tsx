import React, { useState } from 'react';
import { UserPlus, Search, User } from 'lucide-react';
import { CustomerForm } from './CustomerForm';

interface Customer {
  id: string;
  type: 'person' | 'company';
  documentType: 'V' | 'E' | 'J' | 'G' | 'P';
  documentNumber: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface CustomerSelectProps {
  onCustomerSelect: (customer: Customer | null) => void;
}

export function CustomerSelect({ onCustomerSelect }: CustomerSelectProps) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data - En producción esto vendría de un store o API
  const customers: Customer[] = [];

  const handleCustomerCreate = (customer: Customer) => {
    // Aquí se guardaría el cliente en la base de datos
    setSelectedCustomer(customer);
    onCustomerSelect(customer);
    setShowForm(false);
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Buscar cliente por documento o nombre..."
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          Nuevo Cliente
        </button>
      </div>

      {selectedCustomer && (
        <div className="mt-2 p-3 bg-blue-50 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                {selectedCustomer.documentType}-{selectedCustomer.documentNumber}
              </p>
              <p className="text-sm text-blue-700">{selectedCustomer.name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedCustomer(null);
              onCustomerSelect(null);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Cambiar
          </button>
        </div>
      )}

      {showForm && (
        <CustomerForm
          onSubmit={handleCustomerCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}