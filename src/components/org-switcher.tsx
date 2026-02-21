import { ChevronsUpDown, Command } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useSelector } from 'react-redux';
import { selectAllOrganizations, selectDefaultOrganization } from '@/features/organization/store/selectors';
import { useSetDefaultOrganizationMutation } from '@/features/organization/services';
import { Skeleton } from '@/components/ui/skeleton';

interface OrgSwitcherProps {
  isLoading?: boolean;
}

export function OrgSwitcher({ isLoading = false }: OrgSwitcherProps) {
  const { isMobile } = useSidebar();
  const organizations = useSelector(selectAllOrganizations);
  const defaultOrganization = useSelector(selectDefaultOrganization);
  const [setDefaultOrganization, { isLoading: updatingDefaultOrganization }] =
    useSetDefaultOrganizationMutation();

  const setActiveOrganization = (organizationId: string) => {
    setDefaultOrganization(organizationId);
  };

  const isLoadingState = isLoading || updatingDefaultOrganization || organizations?.length === 0;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isLoadingState ? (
                <>
                  <Skeleton className="flex aspect-square size-8 rounded-lg" />
                  <div className="grid flex-1 gap-1 text-left">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                  <ChevronsUpDown className="ml-auto opacity-50" />
                </>
              ) : (
                <>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{defaultOrganization?.name}</span>
                    <span className="truncate text-xs text-gray-500">
                      Role: {(defaultOrganization?.role as { name?: string } | undefined)?.name}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((organization) => (
              <DropdownMenuItem
                key={organization?.name}
                onClick={() => organization?.id && setActiveOrganization(String(organization.id))}
                disabled={organization?.id === defaultOrganization?.id || updatingDefaultOrganization}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Command className="size-4 shrink-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{organization?.name}</span>
                  <span className="truncate text-xs text-gray-500">
                    Role: {(organization?.role as { name?: string } | undefined)?.name}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
