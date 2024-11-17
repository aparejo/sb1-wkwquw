export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  status: 'free' | 'paid' | 'trial' | 'inactive';
  features: string[];
  route: string;
}

export interface License {
  id: string;
  moduleId: string;
  userId: string;
  paymentId: string;
  status: 'active' | 'expired' | 'cancelled';
  activationDate: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  moduleId: string;
  userId: string;
  amount: number;
  method: 'paypal' | 'pago_movil';
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  createdAt: string;
  updatedAt: string;
}