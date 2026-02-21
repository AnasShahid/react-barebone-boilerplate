import { useTranslation } from 'react-i18next';
import { PricingCard } from '../components/pricing-card';
import { pricingPlans } from '../config/pricing-plans.config';

export default function PricingPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('pricing.title')}</h1>
        <p className="text-xl text-muted-foreground">{t('pricing.subtitle')}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
