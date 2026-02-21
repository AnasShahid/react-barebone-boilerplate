import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/providers/theme-provider';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 px-2">
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
        aria-label={t('common.theme.dark')}
        className="h-6"
      />
      <Moon className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </div>
  );
}
