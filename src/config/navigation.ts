interface NavItem {
  title: string;
  href: string;
}

interface NavigationConfig {
  mainNav: NavItem[];
  authNav: NavItem;
  accountNav: NavItem;
  securityNav: NavItem;
  billingNav: NavItem;
  organizationsNav: NavItem;
}

export const navigationConfig: NavigationConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Pricing', href: '/pricing' },
  ],
  authNav: { title: 'Login', href: '/auth/login' },
  accountNav: { title: 'Account', href: '/account' },
  securityNav: { title: 'Security', href: '/account/security' },
  billingNav: { title: 'Billing', href: '/account/billing' },
  organizationsNav: { title: 'Organizations', href: '/account/organizations' },
};
