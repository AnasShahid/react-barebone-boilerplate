import { NavLink, Outlet, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Info, Users, ShieldCheck } from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  exact?: boolean;
}

export default function EditOrgLayout() {
  const { orgId } = useParams<{ orgId: string }>();

  const menuItems: MenuItem[] = [
    {
      name: 'Info',
      path: `/account/organizations/${orgId}/info`,
      icon: <Info className="h-4 w-4 mr-2" />,
      exact: true,
    },
    {
      name: 'Users & Invites',
      path: `/account/organizations/${orgId}/users`,
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Roles',
      path: `/account/organizations/${orgId}/roles`,
      icon: <ShieldCheck className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <div className="text-foreground flex flex-row h-full">
      <aside className="w-52 border-r pr-4 mr-6 min-h-[650px]">
        <div className="text-[1.0625rem] font-bold mb-[1rem]">Edit Organization</div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary hover:text-white'
                )
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
