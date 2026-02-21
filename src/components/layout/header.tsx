import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/layout/navigation-menu';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { navigationConfig } from '@/config/navigation';
import { useTranslation } from 'react-i18next';
import { SettingsMenu } from '@/components/layout/settings-menu';
import { UserButton, useUser, SignInButton } from '@clerk/clerk-react';

function Header() {
  const [isOpen, setOpen] = useState(false);
  const { mainNav, authNav } = navigationConfig;
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const leftNavItems = mainNav.slice(0, Math.ceil(mainNav.length / 2));
  const rightNavItems = mainNav.slice(Math.ceil(mainNav.length / 2));

  const handleBtnNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex items-center justify-between py-4">
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {leftNavItems.map((item) => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink asChild>
                <Link
                  to={item.href}
                  className="group text-primary inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  {t(`common.navigation.${item.title.toLowerCase()}`)}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center justify-center">
        <Link
          to="/"
          className="text-xl font-bold text-primary no-underline hover:text-accent-foreground"
        >
          {t('common.welcome')}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {rightNavItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className="group text-primary inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    {t(`common.navigation.${item.title.toLowerCase()}`)}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex items-center gap-4">
          {isSignedIn && <UserButton />}
          {!isSignedIn && (
            <>
              <SignInButton />
              <Button onClick={() => handleBtnNavigate('/auth/signup')}>
                {t('home.getStarted')}
              </Button>
            </>
          )}
        </div>

        <SettingsMenu />

        <Button
          variant="ghost"
          className="lg:hidden"
          size="icon"
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 top-[4rem] z-50 bg-background border-t lg:hidden">
          <nav className="container mx-auto px-4 py-6">
            <ul className="space-y-4">
              {mainNav.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.href}
                    className="block text-lg font-medium text-primary hover:text-accent-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {t(`common.navigation.${item.title.toLowerCase()}`)}
                  </Link>
                </li>
              ))}
              <li className="border-t pt-4 mt-4">
                <Link
                  to={authNav.href}
                  className="block text-lg font-medium text-primary hover:text-accent-foreground"
                  onClick={() => setOpen(false)}
                >
                  {t('common.navigation.login')}
                </Link>
              </li>
              <li className="mt-4">
                <Button className="w-full">{t('home.getStarted')}</Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export { Header };
