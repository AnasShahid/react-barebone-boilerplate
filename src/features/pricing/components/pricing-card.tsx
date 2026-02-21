import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PricingPlan } from '../config/pricing-plans.config';

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const { t } = useTranslation();

  return (
    <Card className={`w-[300px] ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader>
        <CardTitle>{t(`pricing.plans.${plan.id}.name`)}</CardTitle>
        <CardDescription>{t(`pricing.plans.${plan.id}.description`)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">
            /{t(`pricing.billingPeriod.${plan.billingPeriod}`)}
          </span>
        </div>
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature.name} className="flex items-center gap-2">
              {feature.included ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">
                {feature.name}
                {feature.limit && (
                  <span className="text-muted-foreground"> ({feature.limit})</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
          {t('pricing.getStarted')}
        </Button>
      </CardFooter>
    </Card>
  );
}
