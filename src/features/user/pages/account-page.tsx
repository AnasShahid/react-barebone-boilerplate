import { UserProfile } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { Building2 } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export default function AccountPage() {
  return (
    <>
      <UserProfile appearance={{ baseTheme: dark }} routing="path" path="/account">
        <UserProfile.Page
          label="Organizations & Users"
          labelIcon={<Building2 size={14} />}
          url="organizations"
        >
          <Outlet />
        </UserProfile.Page>
      </UserProfile>
    </>
  );
}
