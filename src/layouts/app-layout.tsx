import { ThemeProvider } from '@/providers/theme-provider';
import { AppSidebar } from '@/components/app-sidebar';
import { useState, useEffect } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Search } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useGetMyProfileQuery } from '@/features/user/services';

const AppLayout = () => {
  const { isLoading } = useGetMyProfileQuery();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <SidebarProvider>
        <AppSidebar isLoading={isLoading} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-4 px-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <button
                  onClick={() => setOpen(true)}
                  className="flex h-9 w-full items-center rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                >
                  Search anything...{' '}
                  <kbd className="pointer-events-none absolute right-2 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </button>
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>

          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Dashboard</CommandItem>
                <CommandItem>Customers</CommandItem>
                <CommandItem>Projects</CommandItem>
                <CommandItem>Settings</CommandItem>
              </CommandGroup>
              <CommandGroup heading="Resources">
                <CommandItem>Documentation</CommandItem>
                <CommandItem>API Reference</CommandItem>
                <CommandItem>Support</CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
