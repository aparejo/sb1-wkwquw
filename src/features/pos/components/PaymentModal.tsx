import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Receipt, Smartphone } from 'lucide-react';
import { useConfigStore } from '../../config/stores/configStore';
import { Sale } from '../types';

interface PaymentModalProps {
  total: number;
  onClose: () => void;
  onComplete: (paymentDetails: any) => void;
}

export function PaymentModal({ total, onClose, onComplete }: PaymentModalProps) {
  const { currencies, defaultCurrency, getExchangeRate } = useConfigStore();
  const secondaryCurrency = currencies.find(c => c.code !== defaultCurrency && c.isActive);
  const exchangeRate = secondaryCurrency ? getExchangeRate(defaultCurrency, secondaryCurrency.code) : 0;

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');
  const [amountUSD, setAmountUSD] = useState(total);
  const [amountSecondary, setAmountSecondary] = useState(total * exchangeRate);
  const [reference, setReference] = useState('');

  // Manejar cambio en monto USD
  const handleUSDChange = (value: number) => {
    setAmountUSD(value);
    setAmountSecondary(value * exchangeRate);
  };

  // Manejar cambio en monto secundario
  const handleSecondaryChange = (value: number) => {
    setAmountSecondary(value);
    setAmountUSD(value / exchangeRate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onComplete({
      id: crypto.randomUUID(),
      method: paymentMethod,
      amountUSD,
      amountSecondary,
      exchangeRate,
      reference,
      details: {
        change: paymentMethod === 'cash' ? amountUSD - total : 0,
        changeSecondary: paymentMethod === 'cash' ? (amountUSD - total) * exchangeRate : 0
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Procesar Pago</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center p-4 border rounded-lg ${
                  paymentMethod === 'cash'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <DollarSign className="h-6 w-6 text-gray-400" />
                <span className="mt-2 text-sm font-medium text-gray-900">Efectivo</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center p-4 border rounded-lg ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <CreditCard className="h-6 w-6 text-gray-400" />
                <span className="mt-2 text-sm font-medium text-gray-900">Tarjeta</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile')}
                className={`flex flex-col items-center p-4 border rounded-lg ${
                  paymentMethod === 'mobile'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <Smartphone className="h-6 w-6 text-gray-400" />
                <span className="mt-2 text-sm font-medium text-gray-900">Pago Móvil</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Monto en {defaultCurrency}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={amountUSD}
                  onChange={(e) => handleUSDChange(Number(e.target.value))}
                  min={total}
                  step="0.01"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            {secondaryCurrency && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto en {secondaryCurrency.code}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{secondaryCurrency.symbol}</span>
                  </div>
                  <input
                    type="number"
                    value={amountSecondary}
                    onChange={(e) => handleSecondaryChange(Number(e.target.value))}
                    min={total * exchangeRate}
                    step="0.01"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}

            {paymentMethod !== 'cash' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Referencia
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  required
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            )}

            {paymentMethod === 'cash' && amountUSD > total && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cambio en {defaultCurrency}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      value={(amountUSD - total).toFixed(2)}
                      readOnly
                      className="bg-gray-50 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {secondaryCurrency && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cambio en {secondaryCurrency.code}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{secondaryCurrency.symbol}</span>
                      </div>
                      <input
                        type="text"
                        value={((amountUSD - total) * exchangeRate).toFixed(2)}
                        readOnly
                        className="bg-gray-50 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <Receipt className="h-4 w-4" />
              Procesar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}