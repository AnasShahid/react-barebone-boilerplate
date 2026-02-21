import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEN from './locales/en.json';
import commonES from './locales/es.json';
import authEN from './features/auth/locales/en.json';
import authES from './features/auth/locales/es.json';
import pricingEN from './features/pricing/locales/en.json';
import pricingES from './features/pricing/locales/es.json';
import onboardingEN from './features/onboarding/locales/en.json';
import onboardingES from './features/onboarding/locales/es.json';
import dashboardEN from './features/dashboard/locales/en.json';
import dashboardES from './features/dashboard/locales/es.json';
import userEN from './features/user/locales/en.json';
import userES from './features/user/locales/es.json';
import organizationEN from './features/organization/locales/en.json';
import organizationES from './features/organization/locales/es.json';
import customersEN from './features/customers/locales/en.json';
import customersES from './features/customers/locales/es.json';
import configTemplatesEN from './features/config-templates/locales/en.json';
import configTemplatesES from './features/config-templates/locales/es.json';
import projectsEN from './features/projects/locales/en.json';
import projectsES from './features/projects/locales/es.json';

const resources = {
  en: {
    translation: {
      ...commonEN,
      ...authEN,
      ...pricingEN,
      ...onboardingEN,
      ...dashboardEN,
      ...userEN,
      ...organizationEN,
      ...customersEN,
      ...configTemplatesEN,
      ...projectsEN,
    },
  },
  es: {
    translation: {
      ...commonES,
      ...authES,
      ...pricingES,
      ...onboardingES,
      ...dashboardES,
      ...userES,
      ...organizationES,
      ...customersES,
      ...configTemplatesES,
      ...projectsES,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
