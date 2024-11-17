import { create } from 'zustand';
import { Promotion, PriceRule, Campaign } from '../types';

interface MarketingState {
  promotions: Promotion[];
  priceRules: PriceRule[];
  campaigns: Campaign[];
  
  addPromotion: (promotion: Promotion) => void;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  
  addPriceRule: (rule: PriceRule) => void;
  updatePriceRule: (id: string, rule: Partial<PriceRule>) => void;
  deletePriceRule: (id: string) => void;
  
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  calculateDiscount: (productId: string, quantity: number, customerType?: string) => number;
  getActivePromotions: () => Promotion[];
}

export const useMarketingStore = create<MarketingState>((set, get) => ({
  promotions: [],
  priceRules: [],
  campaigns: [],

  addPromotion: (promotion) =>
    set((state) => ({ promotions: [...state.promotions, promotion] })),

  updatePromotion: (id, updates) =>
    set((state) => ({
      promotions: state.promotions.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
    })),

  deletePromotion: (id) =>
    set((state) => ({
      promotions: state.promotions.filter(p => p.id !== id)
    })),

  addPriceRule: (rule) =>
    set((state) => ({ priceRules: [...state.priceRules, rule] })),

  updatePriceRule: (id, updates) =>
    set((state) => ({
      priceRules: state.priceRules.map(r =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      )
    })),

  deletePriceRule: (id) =>
    set((state) => ({
      priceRules: state.priceRules.filter(r => r.id !== id)
    })),

  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [...state.campaigns, campaign] })),

  updateCampaign: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      )
    })),

  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter(c => c.id !== id)
    })),

  calculateDiscount: (productId, quantity, customerType) => {
    const { priceRules, promotions } = get();
    let totalDiscount = 0;

    // Aplicar reglas de precio
    const applicableRules = priceRules
      .filter(rule => rule.status === 'active')
      .sort((a, b) => b.priority - a.priority);

    for (const rule of applicableRules) {
      if (rule.type === 'bulk' && quantity >= (rule.conditions.minQuantity || 0)) {
        totalDiscount += rule.adjustment.type === 'percentage' 
          ? rule.adjustment.value / 100
          : rule.adjustment.value;
      }

      if (rule.type === 'customer_type' && 
          customerType && 
          rule.conditions.customerTypes?.includes(customerType)) {
        totalDiscount += rule.adjustment.type === 'percentage'
          ? rule.adjustment.value / 100
          : rule.adjustment.value;
      }
    }

    // Aplicar promociones activas
    const now = new Date().toISOString();
    const activePromotions = promotions.filter(p => 
      p.status === 'active' &&
      p.startDate <= now &&
      p.endDate >= now
    );

    for (const promo of activePromotions) {
      if (promo.conditions.productIds?.includes(productId)) {
        if (promo.benefit.type === 'percentage') {
          totalDiscount += promo.benefit.value / 100;
        } else if (promo.benefit.type === 'fixed') {
          totalDiscount += promo.benefit.value;
        }
      }
    }

    return totalDiscount;
  },

  getActivePromotions: () => {
    const { promotions } = get();
    const now = new Date().toISOString();
    return promotions.filter(p => 
      p.status === 'active' &&
      p.startDate <= now &&
      p.endDate >= now
    );
  }
}));