export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push';
  audience: {
    customerTypes?: string[];
    lastPurchaseDays?: number;
    minPurchaseAmount?: number;
  };
  content: {
    subject?: string;
    body: string;
    imageUrl?: string;
  };
  schedule: {
    startDate: string;
    endDate?: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled';
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PriceRule {
  id: string;
  name: string;
  description?: string;
  type: 'bulk' | 'customer_type' | 'time_based';
  conditions: {
    minQuantity?: number;
    customerTypes?: string[];
    timeRanges?: TimeRange[];
  };
  adjustment: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  priority: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface TimeRange {
  start: string;
  end: string;
  days: number[];
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'bogo' | 'bundle';
  startDate: string;
  endDate: string;
  conditions: {
    minPurchase?: number;
    productIds?: string[];
    categoryIds?: string[];
    customerTypes?: string[];
  };
  benefit: {
    type: 'percentage' | 'fixed' | 'free_product';
    value: number;
    productId?: string;
  };
  status: 'draft' | 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}