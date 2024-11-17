import React from 'react';
import { Trash2, Plus, Minus, Receipt } from 'lucide-react';
import { useConfigStore } from '../../config/stores/configStore';

interface CartPanelProps {
  items: any[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  total: number;
  subtotal: number;
  taxAmount: number;
}

export function CartPanel({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  total,
  subtotal,
  taxAmount
}: CartPanelProps) {
  const { currencies, defaultCurrency, getExchangeRate } = useConfigStore();
  const secondaryCurrency = currencies.find(c => c.code !== defaultCurrency && c.isActive);
  
  // Obtener tasa de cambio entre la moneda principal y secundaria
  const exchangeRate = secondaryCurrency 
    ? getExchangeRate(defaultCurrency, secondaryCurrency.code)
    : 0;

  // Calcular montos en moneda secundaria
  const subtotalSecondary = subtotal * exchangeRate;
  const taxAmountSecondary = taxAmount * exchangeRate;
  const totalSecondary = total * exchangeRate;

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Carrito de Compra
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No hay productos en el carrito
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.productId} className="py-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                    {secondaryCurrency && (
                      <p className="text-xs text-gray-500">
                        {secondaryCurrency.symbol} {(item.price * exchangeRate).toFixed(2)} x {item.quantity}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="p-1 text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal:</span>
            <div className="text-right">
              <div className="font-medium">${subtotal.toFixed(2)}</div>
              {secondaryCurrency && (
                <div className="text-xs text-gray-500">
                  {secondaryCurrency.symbol} {subtotalSecondary.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">IVA (16%):</span>
            <div className="text-right">
              <div className="font-medium">${taxAmount.toFixed(2)}</div>
              {secondaryCurrency && (
                <div className="text-xs text-gray-500">
                  {secondaryCurrency.symbol} {taxAmountSecondary.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-base font-medium text-gray-900">Total</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${total.toFixed(2)}
              </div>
              {secondaryCurrency && (
                <div className="text-sm text-gray-500">
                  {secondaryCurrency.symbol} {totalSecondary.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Receipt className="h-5 w-5" />
          Procesar Venta
        </button>
      </div>
    </div>
  );
}