interface PricingFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: string;
  highlighted?: boolean;
  features: PricingFeature[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out our AI features',
    price: 0,
    billingPeriod: 'monthly',
    features: [
      { name: 'AI Text Generation', included: true, limit: '1,000 words/month' },
      { name: 'Image Analysis', included: true, limit: '50 images/month' },
      { name: 'API Access', included: false },
      { name: 'Custom Models', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Team Collaboration', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Best for professionals and small teams',
    price: 10,
    billingPeriod: 'monthly',
    highlighted: true,
    features: [
      { name: 'AI Text Generation', included: true, limit: '10,000 words/month' },
      { name: 'Image Analysis', included: true, limit: '500 images/month' },
      { name: 'API Access', included: true },
      { name: 'Custom Models', included: false },
      { name: 'Priority Support', included: true },
      { name: 'Team Collaboration', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations with advanced needs',
    price: 50,
    billingPeriod: 'monthly',
    features: [
      { name: 'AI Text Generation', included: true, limit: '100,000 words/month' },
      { name: 'Image Analysis', included: true, limit: '5,000 images/month' },
      { name: 'API Access', included: true },
      { name: 'Custom Models', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Team Collaboration', included: true },
    ],
  },
];
