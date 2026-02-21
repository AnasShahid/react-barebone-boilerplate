import { useDispatch } from 'react-redux';
import { userLogout } from '@/store/root-reducer';
import {
  Send,
  LayoutDashboard,
  UserRound,
  FolderCog2,
  LifeBuoy,
  Users,
  FolderClosed,
  type LucideIcon,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavConfig } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { useUser, useAuth } from '@clerk/clerk-react';
import { OrgSwitcher } from './org-switcher';
import type { AppDispatch } from '@/store';

interface NavMainItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

interface NavSecondaryItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface ConfigItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

const navMain: NavMainItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, isActive: true },
  { title: 'Customers', url: '/customers', icon: UserRound, isActive: false },
  { title: 'Projects', url: '/projects', icon: FolderClosed, isActive: false },
];

const navSecondary: NavSecondaryItem[] = [
  { title: 'Support', url: '#', icon: LifeBuoy },
  { title: 'Feedback', url: '#', icon: Send },
];

const config: ConfigItem[] = [
  { name: 'Project Config', url: '/config-templates', icon: FolderCog2 },
  { name: 'Service Roles', url: '/config-templates/service-roles', icon: Users },
];

interface AppSidebarProps {
  isLoading?: boolean;
}

export function AppSidebar({ isLoading, ...props }: AppSidebarProps) {
  const { user } = useUser();
  const { signOut } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const handleUserSignOut = () => {
    void signOut();
    dispatch(userLogout());
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <OrgSwitcher isLoading={isLoading} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavConfig items={config} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} handleSignout={handleUserSignOut} />
      </SidebarFooter>
    </Sidebar>
  );
}
