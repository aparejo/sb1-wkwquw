import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, DollarSign, Receipt } from 'lucide-react';
import { ProductSearch } from './ProductSearch';
import { CartPanel } from './CartPanel';
import { PaymentModal } from './PaymentModal';
import { CustomerSelect } from './CustomerSelect';
import { CashRegisterDialog } from './CashRegisterDialog';
import { useInventoryStore } from '../../inventory/stores/inventoryStore';
import { useConfigStore } from '../../config/stores/configStore';
import { useAuthStore } from '../../../stores/auth';
import { usePOSStore } from '../stores/posStore';

export function POSDashboard() {
  const navigate = useNavigate();
  const { selectedWarehouse } = useInventoryStore();
  const { taxes } = useConfigStore();
  const { user } = useAuthStore();
  const { currentSession } = usePOSStore();
  
  const [showPayment, setShowPayment] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCashDialog, setShowCashDialog] = useState(false);
  const [cashDialogType, setCashDialogType] = useState<'open' | 'close'>('open');

  // Verificar permisos
  const hasAccess = user?.role === 'admin' || user?.permissions?.some(p => 
    p.module === 'all' || p.module === 'pos'
  );

  // Si no hay sesión abierta y el usuario tiene acceso, mostrar diálogo de apertura
  React.useEffect(() => {
    if (!currentSession && hasAccess) {
      setShowCashDialog(true);
      setCashDialogType('open');
    }
  }, [currentSession, hasAccess]);

  if (!hasAccess) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            No tiene permisos para acceder al punto de venta
          </h2>
        </div>
      </div>
    );
  }

  // Si no hay sesión, mostrar botón de apertura
  if (!currentSession) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            No hay una sesión de caja abierta
          </h2>
          <button
            onClick={() => {
              setCashDialogType('open');
              setShowCashDialog(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Abrir Caja
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: any, quantity: number = 1) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.baseUnit.price.USD,
        quantity,
        unitId: product.baseUnit.id
      }]);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleCheckout = () => {
    if (!selectedCustomer) {
      alert('Por favor seleccione un cliente antes de procesar la venta');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentComplete = (paymentDetails: any) => {
    const sale = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      customer: selectedCustomer,
      items: cart,
      subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      taxAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * (taxes[0]?.rate || 16) / 100,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * (1 + (taxes[0]?.rate || 16) / 100),
      payment: paymentDetails,
      warehouseId: selectedWarehouse,
      status: 'completed'
    };
    
    // Aquí iría la lógica para guardar la venta
    setCart([]);
    setShowPayment(false);
    setSelectedCustomer(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = subtotal * (taxes[0]?.rate || 16) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 shadow">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Punto de Venta
            </h1>
          </div>
        </div>

        <div className="p-4">
          <CustomerSelect onCustomerSelect={setSelectedCustomer} />
        </div>

        <div className="p-4">
          <ProductSearch onProductSelect={handleAddToCart} />
        </div>

        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Ventas del Día</p>
                <p className="text-xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Total del Día</p>
                <p className="text-xl font-semibold text-gray-900">${0.00}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Productos Vendidos</p>
                <p className="text-xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartPanel
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        total={total}
        subtotal={subtotal}
        taxAmount={taxAmount}
      />

      {showPayment && (
        <PaymentModal
          total={total}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}

      {showCashDialog && (
        <CashRegisterDialog
          type={cashDialogType}
          onClose={() => setShowCashDialog(false)}
        />
      )}
    </div>
  );
}